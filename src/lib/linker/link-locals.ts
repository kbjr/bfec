
import { BuildError, BuildErrorFactory, build_error_factory } from '../error';
import { Refable, RefLocality, ResolvedRef } from './refs';
import {
	Schema, node_type,
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
	const error = build_error_factory(errors, schema);

	schema.elements.forEach((elem) => {
		switch (elem.type) {
			case node_type.imported_symbol:
				return link_imported_symbol(elem, error);

			case node_type.struct:
				return link_struct(schema, elem, error);
					
			case node_type.switch:
				return link_switch(schema, elem, error);
				
			case node_type.enum:
				return link_enum(schema, elem, error);
		}
	});
}

function link_imported_symbol(elem: ImportedSymbol, error: BuildErrorFactory) : void {
	if (elem.from.source_schema) {
		const imported = elem.from.source_schema.element_map.get(elem.imported.name);

		if (! imported) {
			error(elem.imported, `Symbol ${elem.imported.name} not found in "${elem.from.source_expr.value}"`);
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

function link_struct(schema: Schema, elem: Struct, error: BuildErrorFactory) : void {
	for (const param of elem.params) {
		link_type_expr(schema, param.param_type, error);
	}

	for (const field of elem.fields) {
		if (field.type === node_type.struct_expansion) {
			link_type_expr(schema, field.expanded_type, error);
		}

		else {
			if (field.condition) {
				link_bool_expr(schema, field.condition, error);
			}

			if (! field.field_type) {
				error(field, `Invalid Schema: Missing field_type for field "${field.name.name}"`);
				continue;
			}

			if (field.field_type.type !== node_type.const_int && field.field_type.type !== node_type.const_string) {
				link_type_expr(schema, field.field_type, error);
			}

			if (field.field_value) {
				link_value_expr(schema, field.field_value, error);
			}
		}
	}
}

function link_switch(schema: Schema, elem: Switch, error: BuildErrorFactory) : void {
	link_type_expr(schema, elem.arg_type, error);

	let arg_enum: Enum;
	let locality: RefLocality;

	// Validate that the switch arg type is actually an enum
	if (elem.arg_type && elem.arg_type.type === node_type.type_expr_named) {
		const refed = ResolvedRef.fully_resolve(elem.arg_type.name);

		if (refed) {
			if (refed.type === node_type.enum) {
				arg_enum = refed;
				locality = (elem.arg_type.name as ResolvedRef<Refable>).locality;
			}
	
			else {
				error(elem.arg_type, 'Expected switch arg type to refer to an enum');
			}
		}
	}
	
	else {
		error(elem.arg_type, 'Expected switch arg type to refer to an enum');
	}

	for (const case_node of elem.cases) {
		if (arg_enum) {
			const name = case_node.case_value.name;
			const found = arg_enum.member_map.get(name);
			
			if (found) {
				case_node.case_value = ResolvedRef.promote_ref(case_node.case_value, found, locality);
			}

			else {
				error(case_node.case_value, `Referenced member "${name}" not found for enum "${arg_enum.name.name}"`);
			}
		}

		if (case_node.case_type === SwitchCaseType.type_expr) {
			link_type_expr(schema, case_node.case_type_expr, error);
		}
	}

	if (elem.default) {
		if (elem.default.case_type === SwitchCaseType.type_expr) {
			link_type_expr(schema, elem.default.case_type_expr, error);
		}
	}

	else {
		// TODO: Should no default be allowed? Default to `invalid` or `void`?
	}
}

function link_enum(schema: Schema, elem: Enum, error: BuildErrorFactory) : void {
	// pass
}



// ===== Type Expressions =====

function link_type_expr(schema: Schema, expr: TypeExpr, error: BuildErrorFactory) : void {
	switch (expr.type) {
		case node_type.type_expr_array:
			link_array_type_expr(schema, expr, error);
			break;

		case node_type.type_expr_named:
			link_named_type_expr(schema, expr, error);
			break;

		case node_type.type_expr_named_refine:
			link_type_expr(schema, expr.parent_type, error);
			link_named_type_expr(schema, expr.refined_type, error);
			break;

		case node_type.type_expr_checksum:
			link_type_expr(schema, expr.real_type, error);
			link_value_expr(schema, expr.data_expr, error);
			break;

		case node_type.type_expr_struct_refine:
			// TODO: type_expr_struct_refine
			break;
		
		case node_type.type_expr_switch_refine:
			// TODO: type_expr_switch_refine
			break;
		
		case node_type.type_expr_text:
			if (expr.length_type === TextLengthType.length_field) {
				link_value_expr(schema, expr.length_field, error);
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

function link_array_type_expr(schema: Schema, expr: TypeExpr_array, error: BuildErrorFactory) : void {
	link_type_expr(schema, expr.element_type, error);

	if (expr.length_type === ArrayLengthType.length_field) {
		link_value_expr(schema, expr.length_field, error);
	}
}

function link_named_type_expr(schema: Schema, expr: TypeExpr_named, error: BuildErrorFactory) : void {
	const name = expr.name.name;
	const found = schema.element_map.get(name);

	if (! found) {
		error(expr.name, `Referenced type "${name}" not found`);
		return;
	}

	expr.name = ResolvedRef.promote_ref(expr.name, found, RefLocality.schema);
}



// ===== Value Expressions =====

function link_value_expr(schema: Schema, expr: ValueExpr, error: BuildErrorFactory) : void {
	// TODO: link_value_expr
}



// ===== Bool Expressions =====

function link_bool_expr(schema: Schema, expr: BoolExpr, error: BuildErrorFactory) : void {
	if (expr.type === node_type.bool_expr_comparison) {
		if (expr.lh_expr.type === node_type.value_expr) {
			link_value_expr(schema, expr.lh_expr, error);
		}

		if (expr.rh_expr.type === node_type.value_expr) {
			link_value_expr(schema, expr.rh_expr, error);
		}

		return;
	}

	link_bool_expr(schema, expr.lh_expr, error);

	if (expr.operator !== BoolExprLogicalOperator.not) {
		link_bool_expr(schema, expr.rh_expr, error);
	}
}
