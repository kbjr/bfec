
import assert = require('assert');
import * as sch from '../schema';
import { BuildError, BuildErrorFactory, build_error_factory } from '../error';

export function link_locals(schema: sch.Schema, errors: BuildError[]) : void {
	const error = build_error_factory(errors, schema);

	for (const node of schema.imported_refs) {
		link_imported_symbol(node, error)
	}

	for (const node of schema.enums) {
		link_enum(schema, node, error);
	}

	for (const node of schema.switches) {
		link_switch(schema, node, error);
	}

	for (const node of schema.structs) {
		link_struct(schema, node, error);
	}
}

function link_imported_symbol(ref: sch.ImportedRef, error: BuildErrorFactory) : void {
	if (ref.from.source_schema) {
		const source_name = ref.import_root ? '$' : ref.source_token.text || ref.local_token.text;
		const imported = ref.from.source_schema.element_map.get(source_name);

		if (! imported) {
			error(imported, `Symbol ${source_name} not found in "${ref.from.source_expr.value}"`);
			return;
		}

		const { is_external, is_remote } = ref.from.source_schema;
		const locality
			= is_remote ? sch.ref_locality.remote
			: is_external ? sch.ref_locality.external
			: sch.ref_locality.project
			;

		ref.points_to = imported;
		ref.locality = locality;
	}
}

function link_struct(schema: sch.Schema, elem: sch.Struct, error: BuildErrorFactory) : void {
	for (const param of elem.params) {
		link_type_expr(schema, param.param_type, error);
	}

	for (const field of elem.fields) {
		if (sch.is_struct_expansion(field)) {
			link_type_expr(schema, field.expanded_type, error, elem);
		}

		else {
			if (field.condition) {
				link_bool_expr(schema, field.condition, error);
			}

			assert(field.field_type, 'expected StructField.field_type to be populated');

			if (sch.is_const(field.field_type)) {
				// pass
			}
			
			else {
				link_type_expr(schema, field.field_type, error, elem);
			}

			if (field.field_value) {
				link_value_expr(schema, field.field_value, error, elem);
			}
		}
	}
}

function link_switch(schema: sch.Schema, elem: sch.Switch, error: BuildErrorFactory) : void {
	link_type_expr(schema, elem.arg_type, error);

	let arg_enum: sch.Enum;
	let locality: sch.ref_locality;

	// Validate that the switch arg type is actually an enum
	const map = schema.element_map as Map<string, any>;
	const found = elem.arg_type.resolve_in(map, sch.ref_locality.schema);

	if (found) {
		const refed = sch.fully_resolve(elem.arg_type);
	
		if (refed) {
			if (sch.is_enum(refed)) {
				arg_enum = refed;
				locality = elem.arg_type.locality;
			}
	
			else {
				error(elem.arg_type, 'Expected switch arg type to refer to an enum');
			}
		}

		else {
			error(elem.arg_type, `Referenced enum "${elem.arg_type.name}" not found`);
		}
	}

	else {
		error(elem.arg_type, `Referenced enum "${elem.arg_type.name}" not found`);
	}

	for (const case_node of elem.cases) {
		if (arg_enum) {
			const found = case_node.case_value.resolve_in(arg_enum.member_map, locality);

			if (! found) {
				error(case_node.case_value, `Referenced member "${case_node.case_value.name}" not found for enum "${arg_enum.name.text}"`);
			}
		}

		if (case_node.case_type === sch.switch_case_type.type_expr) {
			link_type_expr(schema, case_node.case_type_expr, error);
		}
	}

	if (elem.default) {
		if (elem.default.case_type === sch.switch_case_type.type_expr) {
			link_type_expr(schema, elem.default.case_type_expr, error);
		}
	}

	else {
		// TODO: Should no default be allowed? Default to `invalid` or `void`?
	}
}

function link_enum(schema: sch.Schema, elem: sch.Enum, error: BuildErrorFactory) : void {
	// pass
}



// ===== Type Expressions =====

function link_type_expr(schema: sch.Schema, expr: sch.TypeExpr, error: BuildErrorFactory, context?: sch.Struct) : void {
	if (sch.is_type_expr_int(expr) || sch.is_type_expr_float(expr)) {
		// no linking required
		return;
	}

	if (sch.is_type_expr_length(expr)) {
		// no linking required
		return;
	}

	if (sch.is_type_expr_text(expr)) {
		link_length_type(schema, expr, error, context);
		return;
	}

	if (sch.is_type_expr_named(expr)) {
		link_named_type_expr(schema, expr, error, context);
		return;
	}

	if (sch.is_type_expr_array(expr)) {
		link_type_expr(schema, expr.element_type, error, context);
		link_length_type(schema, expr, error, context);
		return;
	}

	if (sch.is_type_expr_named_refine(expr)) {
		link_type_expr(schema, expr.parent_type, error, context);
		link_named_type_expr(schema, expr.refined_type, error);
		return;
	}

	if (sch.is_type_expr_struct_refine(expr)) {
		link_type_expr(schema, expr.parent_type, error, context);
		link_struct(schema, expr.refined_type, error);
		return;
	}

	if (sch.is_type_expr_switch_refine(expr)) {
		link_type_expr(schema, expr.parent_type, error, context);
		link_switch(schema, expr.refined_type, error);
		// TODO: param
		return;
	}

	if (sch.is_type_expr_checksum(expr)) {
		link_type_expr(schema, expr.real_type, error, context);
		return;
	}
}

function link_named_type_expr(schema: sch.Schema, expr: sch.TypeExpr_named, error: BuildErrorFactory, context?: sch.Struct) : void {
	const name = expr.name.name;
	const found = schema.element_map.get(name);

	if (! found) {
		error(expr.name, `Referenced type "${name}" not found`);
		return;
	}

	for (const param of expr.params) {
		if (sch.is_const(param)) {
			continue;
		}

		link_value_expr(schema, param, error, context);
	}

	expr.name.points_to = found;
	expr.name.locality = sch.ref_locality.schema;
}

function link_length_type(schema: sch.Schema, expr: sch.TypeExpr_array | sch.TypeExpr_text, error: BuildErrorFactory, context?: sch.Struct) : void {
	if (expr.length_type === sch.len_type.length_field) {
		link_value_expr(schema, expr.length_field, error, context);
	}
}



// ===== Value Expr =====

function link_value_expr(schema: sch.Schema, ref: sch.NamedRef, error: BuildErrorFactory, context?: sch.Struct) : void {
	const parent = ref.parent_ref;
	
	if (sch.is_root_ref(parent)) {
		const from_root = schema.root_schema == null;
		parent.points_to = from_root ? schema.root : schema.root_schema.root;
		
		const is_root = parent.points_to === context;
		parent.locality
			= is_root ? sch.ref_locality.declaration
			: from_root ? sch.ref_locality.schema
			: sch.ref_locality.project;

		const found = parent.points_to.field_map.get(ref.name);

		if (found) {
			ref.points_to = found;
			ref.locality = parent.locality;
		}

		else {
			error(ref.name_token, `Property "${ref.name}" of "$" not found`);
		}
	}

	else if (sch.is_self_ref(parent)) {
		if (! context) {
			error(ref.name_token, 'Self-reference "@" used in a non-local context');
			return;
		}

		parent.points_to = context;
		parent.locality = sch.ref_locality.declaration;
		
		const found = parent.points_to.field_map.get(ref.name);

		if (found) {
			ref.points_to = found;
			ref.locality = sch.ref_locality.declaration;
		}

		else {
			error(ref.name_token, `Property "${ref.name}" of "@" ("${context.name.text}") not found`);
		}
	}

	else if (sch.is_named_ref(parent)) {
		if (parent.parent_ref) {
			link_value_expr(schema, parent, error, context);
		}

		const resolved_parent = sch.fully_resolve(parent);

		if (sch.is_struct_field(resolved_parent)) {
			if (sch.is_type_expr_named(resolved_parent.field_type)) {
				link_named_type_expr(schema, resolved_parent.field_type, error);

				const points_to = sch.fully_resolve(resolved_parent.field_type.name);

				if (sch.is_struct(points_to)) {
					const found = points_to.field_map.get(ref.name);

					if (found) {
						ref.points_to = found;
						ref.locality = parent.locality;
					}

					else {
						error(ref.name_token, `Property "${ref.name}" of "${parent.full_name}" not found`);
					}
				}
			}

			else if (sch.is_type_expr_named_refine(resolved_parent.field_type)) {
				link_named_type_expr(schema, resolved_parent.field_type.refined_type, error);

				const points_to = sch.fully_resolve(resolved_parent.field_type.refined_type.name);

				if (sch.is_struct(points_to)) {
					const found = points_to.field_map.get(ref.name);

					if (found) {
						ref.points_to = found;
						ref.locality = parent.locality;
					}

					else {
						error(ref.name_token, `Property "${ref.name}" of "${parent.full_name}" not found`);
					}
				}
			}

			else if (sch.is_type_expr_struct_refine(resolved_parent.field_type)) {
				// 
			}

			else {
				error(ref.parent_ref, 'Expected value expr to refer to a static struct field');
			}
		}

		else if (sch.is_enum(resolved_parent)) {
			const found = resolved_parent.member_map.get(ref.name);

			if (found) {
				ref.points_to = found;
				ref.locality = parent.locality;
			}

			else {
				error(ref.name_token, `Property "${ref.name}" of "${parent.full_name}" not found`);
			}
		}

		else {
			error(ref.parent_ref, 'Expected value expr to refer to a static struct field or enum member');
		}
	}

	else if (! parent) {
		if (context) {
			const found_param = context.param_map.get(ref.name);

			if (found_param) {
				ref.points_to = found_param;
				ref.locality = sch.ref_locality.declaration;
				return;
			}
		}

		const found = schema.element_map.get(ref.name);

		if (found) {
			ref.points_to = found;
			ref.locality = sch.is_imported_ref(found) ? found.locality : sch.ref_locality.schema;
		}

		else {
			error(ref.name_token, `Referenced name "${ref.name}" not found`);
		}
	}

	else {
		error(ref.parent_ref, 'Expected value expr to refer to a static struct field or enum member');
	}
}



// ===== Bool Expressions =====

function link_bool_expr(schema: sch.Schema, expr: sch.BoolExpr, error: BuildErrorFactory) : void {
	if (sch.is_bool_expr_comparison(expr)) {
		// no linking required
		return;
	}

	if (sch.is_bool_expr_logical(expr)) {
		link_bool_expr(schema, expr.lh_expr, error);
	
		if (expr.operator !== sch.bool_expr_op_logical.not) {
			link_bool_expr(schema, expr.rh_expr, error);
		}
	}
}
