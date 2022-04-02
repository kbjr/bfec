
import { BuildError } from '../error';
import { Refable, RefLocality, ResolvedRef } from './refs';
import {
	Schema, node_type, SchemaNode,
	ImportedSymbol,
	Struct,
	Switch,
	Enum,
	TypeExpr, TypeExpr_named, TypeExpr_array,
	ArrayLengthType, TextLengthType,
	BoolExpr, BoolExprLogicalOperator,
	ValueExpr,
	SwitchCaseType,
} from '../schema';

export function link_locals(schema: Schema, errors: BuildError[]) : void {
	schema.elements.forEach((elem) => {
		switch (elem.type) {
			case node_type.imported_symbol:
				return link_imported_symbol(schema, elem, errors);

			case node_type.struct:
				return link_struct(schema, elem, errors);
					
			case node_type.switch:
				return link_switch(schema, elem, errors);
				
			case node_type.enum:
				return link_enum(schema, elem, errors);
		}
	});
}

function link_imported_symbol(schema: Schema, elem: ImportedSymbol, errors: BuildError[]) : void {
	if (elem.from.source_schema) {
		const imported = elem.from.source_schema.element_map.get(elem.imported.name);

		if (! imported) {
			build_error(errors, schema, elem.imported, `Symbol ${elem.imported.name} not found in "${elem.from.source_expr.value}"`);
			return;
		}

		const { is_external, is_remote } = elem.from.source_schema;
		const locality
			= is_remote ? RefLocality.remote
			: is_external ? RefLocality.external
			: RefLocality.project
			;

		elem.imported = ResolvedRef.promote_ref(elem.imported, imported, locality);
	}
}

function link_struct(schema: Schema, elem: Struct, errors: BuildError[]) : void {
	for (const param of elem.params) {
		link_type_expr(schema, param.param_type, errors);
	}

	for (const field of elem.fields) {
		if (field.type === node_type.struct_expansion) {
			link_type_expr(schema, field.expanded_type, errors);
		}

		else {
			if (field.condition) {
				link_bool_expr(schema, field.condition, errors);
			}

			if (! field.field_type) {
				build_error(errors, schema, field, `Invalid Schema: Missing field_type for field "${field.name.name}"`);
				continue;
			}

			if (field.field_type.type !== node_type.const_int && field.field_type.type !== node_type.const_string) {
				link_type_expr(schema, field.field_type, errors);
			}
		}
	}
}

function link_switch(schema: Schema, elem: Switch, errors: BuildError[]) : void {
	link_type_expr(schema, elem.arg_type, errors);

	let arg_enum: Enum;
	let locality: RefLocality;

	// Validate that the switch arg type is actually an enum
	if (is_named_type_expr(elem.arg_type)) {
		const refed = ResolvedRef.fully_resolve(elem.arg_type.name);

		if (refed) {
			if (refed.type === node_type.enum) {
				arg_enum = refed;
				locality = (elem.arg_type.name as ResolvedRef<Refable>).locality;
			}
	
			else {
				build_error(errors, schema, elem.arg_type, 'Expected switch arg type to refer to an enum');
			}
		}
	}
	
	else {
		build_error(errors, schema, elem.arg_type, 'Expected switch arg type to refer to an enum');
	}

	for (const case_node of elem.cases) {
		if (arg_enum) {
			const name = case_node.case_value.name;
			const found = arg_enum.member_map.get(name);
			
			if (found) {
				case_node.case_value = ResolvedRef.promote_ref(case_node.case_value, found, locality);
			}

			else {
				build_error(errors, schema, case_node.case_value, `Referenced member "${name}" not found for enum "${arg_enum.name.name}"`);
			}
		}

		if (case_node.case_type === SwitchCaseType.type_expr) {
			link_type_expr(schema, case_node.case_type_expr, errors);
		}
	}

	if (elem.default) {
		if (elem.default.case_type === SwitchCaseType.type_expr) {
			link_type_expr(schema, elem.default.case_type_expr, errors);
		}
	}

	else {
		// TODO: Should no default be allowed? Default to `invalid` or `void`?
	}
}

function link_enum(schema: Schema, elem: Enum, errors: BuildError[]) : void {
	// TODO: elem.member_type if named
}



// ===== Type Expressions =====

function link_type_expr(schema: Schema, expr: TypeExpr, errors: BuildError[]) : void {
	switch (expr.type) {
		case node_type.type_expr_array:
			link_array_type_expr(schema, expr, errors);
			break;

		case node_type.type_expr_named:
			link_named_type_expr(schema, expr, errors);
			break;

		case node_type.type_expr_named_refine:
			link_type_expr(schema, expr.parent_type, errors);
			link_named_type_expr(schema, expr.refined_type, errors);
			break;

		case node_type.type_expr_checksum:
			link_type_expr(schema, expr.real_type, errors);
			link_value_expr(schema, expr.data_expr, errors);
			break;

		case node_type.type_expr_struct_refine:
			// TODO: type_expr_struct_refine
			break;
		
		case node_type.type_expr_switch_refine:
			// TODO: type_expr_switch_refine
			break;
		
		case node_type.type_expr_text:
			if (expr.length_type === TextLengthType.length_field) {
				link_value_expr(schema, expr.length_field, errors);
			}
			break;
				
		case node_type.type_expr_length:
		case node_type.type_expr_varint:
		case node_type.type_expr_fixed_int:
		case node_type.type_expr_float:
			// no linking required
			break;
	}
}

function link_array_type_expr(schema: Schema, expr: TypeExpr_array, errors: BuildError[]) : void {
	link_type_expr(schema, expr.element_type, errors);

	if (expr.length_type === ArrayLengthType.length_field) {
		link_value_expr(schema, expr.length_field, errors);
	}
}

function link_named_type_expr(schema: Schema, expr: TypeExpr_named, errors: BuildError[]) : void {
	const name = expr.name.name;
	const found = schema.element_map.get(name);

	if (! found) {
		build_error(errors, schema, expr.name, `Referenced type "${name}" not found`);
		return;
	}

	expr.name = ResolvedRef.promote_ref(expr.name, found, RefLocality.schema);
}



// ===== Value Expressions =====

function link_value_expr(schema: Schema, expr: ValueExpr, errors: BuildError[]) : void {
	// TODO: link_value_expr
}



// ===== Bool Expressions =====

function link_bool_expr(schema: Schema, expr: BoolExpr, errors: BuildError[]) : void {
	if (expr.type === node_type.bool_expr_comparison) {
		if (expr.lh_expr.type === node_type.value_expr) {
			link_value_expr(schema, expr.lh_expr, errors);
		}

		if (expr.rh_expr.type === node_type.value_expr) {
			link_value_expr(schema, expr.rh_expr, errors);
		}

		return;
	}

	link_bool_expr(schema, expr.lh_expr, errors);

	if (expr.operator !== BoolExprLogicalOperator.not) {
		link_bool_expr(schema, expr.rh_expr, errors);
	}
}



// ===== Expectations =====

function is_named_type_expr(expr: TypeExpr) : expr is TypeExpr_named {
	return expr && expr.type === node_type.type_expr_named;
}



// ===== Errors =====

function build_error(errors: BuildError[], schema: Schema, schema_node: SchemaNode, message: string) {
	const node = schema.include_source_maps
		? schema.source_map.get(schema_node)
		: null;

	errors.push(
		new BuildError(message, schema, node)
	);
}
