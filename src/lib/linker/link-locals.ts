
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
			link_type_expr(schema, field.expanded_type, error);
		}

		else {
			if (field.condition) {
				link_bool_expr(schema, field.condition, error);
			}

			const { field_type } = field;

			if (! field_type) {
				error(field, `Invalid Schema: Missing field_type for field "${field.name.text}"`);
				continue;
			}

			if (sch.is_const(field_type)) {
				link_type_expr(schema, field_type, error);
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

function link_type_expr(schema: sch.Schema, expr: sch.TypeExpr, error: BuildErrorFactory) : void {
	if (sch.is_type_expr_int(expr) || sch.is_type_expr_float(expr)) {
		// no linking required
		return;
	}

	if (sch.is_type_expr_text(expr)) {
		// no linking required
		return;
	}

	if (sch.is_type_expr_named(expr)) {
		link_named_type_expr(schema, expr, error);
		return;
	}

	if (sch.is_type_expr_array(expr)) {
		link_type_expr(schema, expr.element_type, error);
		return;
	}

	if (sch.is_type_expr_named_refine(expr)) {
		link_type_expr(schema, expr.parent_type, error);
		link_named_type_expr(schema, expr.refined_type, error);
		return;
	}

	if (sch.is_type_expr_struct_refine(expr)) {
		// TODO:
		return;
	}

	if (sch.is_type_expr_switch_refine(expr)) {
		// TODO:
		return;
	}

	if (sch.is_type_expr_checksum(expr)) {
		link_type_expr(schema, expr.real_type, error);
		return;
	}
}

function link_named_type_expr(schema: sch.Schema, expr: sch.TypeExpr_named, error: BuildErrorFactory) : void {
	const name = expr.name.name;
	const found = schema.element_map.get(name);

	if (! found) {
		error(expr.name, `Referenced type "${name}" not found`);
		return;
	}

	expr.name.points_to = found;
	expr.name.locality = sch.ref_locality.schema;
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
