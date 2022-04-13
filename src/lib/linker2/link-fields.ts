
import { ast } from '../parser';
import { Switch } from './switch';
import { Schema } from './schema';
import { ArrayType, ChecksumType, Length, TextType } from './base-types';
import { Struct, StructField } from './struct';
import { BuildError, BuildErrorFactory, build_error_factory } from '../error2';
import { BoolExpr_and, BoolExpr_eq, BoolExpr_neq, BoolExpr_not, BoolExpr_or, BoolExpr_xor } from './bool-expr';
import { ConstInt, ConstString } from './const';
import { EnumMemberRef, EnumRef, ImportedRef, ImportedRefable, ParamRef } from './ref';
import { NameToken_normal } from '../parser/ast';
import { FieldType } from './field-type';

export function link_fields(schema: Schema, errors: BuildError[]) {
	const error = build_error_factory(errors, schema);
	
	for (const node of schema.structs) {
		link_struct(schema, node, error);
	}
	
	for (const node of schema.switches) {
		link_switch(schema, node, error);
	}
}

function link_struct(schema: Schema, node: Struct, error: BuildErrorFactory) {
	for (const field of node.fields) {
		if (field.type === 'struct_field') {
			link_field_type(schema, field.field_type, error, node);

			if (field.has_condition) {
				build_and_link_bool_expr(schema, node, field.ast_node.optional_condition.condition, error);
			}

			if (field.has_field_value) {
				const value_node = field.ast_node.optional_value;

				switch (value_node.type) {
					case ast.node_type.value_expr_path:
						field.field_value = build_struct_value_ref(schema, value_node, node, error);
						break;

					case ast.node_type.const_ascii:
					case ast.node_type.const_unicode:
						field.field_value = ConstString.from_ast(value_node);
						break;

					case ast.node_type.const_int:
					case ast.node_type.const_hex_int:
						field.field_value = ConstInt.from_ast(value_node);
						break;
				}
			}
		}

		else if (field.type === 'struct_expansion') {
			link_field_type(schema, field.expanded_type, error, node);
		}
	}
}

// TODO: type validation
export function build_struct_value_ref(schema: Schema, expr: ast.ValueExpr_path, struct: Struct, error: BuildErrorFactory) {
	const found_param = struct.param_map.get(expr.lh_name.text);

	if (found_param) {
		const ref = new ParamRef();
		ref.ast_node = expr;
		ref.points_to = found_param;

		if (expr.rh_names.length) {
			const access = expr.rh_names[0].field_name;
			error(access, `Cannot access field "${access.text}" of a parameter`);
		}

		return ref;
	}

	const found_global = schema.symbols.get(expr.lh_name.text);

	if (! found_global) {
		error(expr.lh_name, `Referenced name "${expr.lh_name.text}" not found`);
		return;
	}

	let points_to: ImportedRefable = found_global;

	while (points_to && points_to.type === 'imported_ref') {
		points_to = points_to.points_to;
	}

	if (! points_to) {
		error(expr.lh_name, `Failed to resolve imported symbol "${expr.lh_name.text}"`);
		return null;
	}
	
	if (points_to.type !== 'enum') {
		error(expr.lh_name, `Expected resolved name to refer to an enum`);
		return null;
	}

	const enum_ref = new EnumRef();
	enum_ref.ast_node = expr.lh_name as NameToken_normal;

	if (found_global.type === 'imported_ref') {
		enum_ref.imported = found_global;
	}

	enum_ref.points_to = points_to;

	if (! expr.rh_names.length) {
		error(enum_ref, 'Unexpected reference to a whole enum; expected to find a following member name');
		return null;
	}

	const member_name = expr.rh_names[0].field_name;
	const found_member = points_to.symbols.get(member_name.text);

	if (! found_member) {
		error(member_name, `Member "${member_name.text}" of enum "${points_to.name}" not found`);
		return null;
	}

	const member_ref = new EnumMemberRef();
	member_ref.ast_node = expr;
	member_ref.enum_ref = enum_ref;
	member_ref.points_to = found_member;

	if (expr.rh_names.length > 1) {
		error(expr.rh_names[1].field_name, `Unexpected attempt to access a property of an enum member`);
		return null;
	}

	return member_ref;
}

function build_and_link_bool_expr(schema: Schema, struct: Struct, expr: ast.BoolExpr, error: BuildErrorFactory) {
	switch (expr.type) {
		case ast.node_type.bool_expr_not: {
			const bool = new BoolExpr_not();
			bool.ast_node = expr;
			bool.operand = build_and_link_bool_expr(schema, struct, expr.expr, error);
			return bool;
		}

		case ast.node_type.bool_expr_and: {
			const bool = new BoolExpr_and();
			bool.ast_node = expr;
			bool.lh_operand = build_and_link_bool_expr(schema, struct, expr.lh_expr, error);
			bool.rh_operand = build_and_link_bool_expr(schema, struct, expr.rh_expr, error);
			return bool;
		}

		case ast.node_type.bool_expr_or: {
			const bool = new BoolExpr_or();
			bool.ast_node = expr;
			bool.lh_operand = build_and_link_bool_expr(schema, struct, expr.lh_expr, error);
			bool.rh_operand = build_and_link_bool_expr(schema, struct, expr.rh_expr, error);
			return bool;
		}

		case ast.node_type.bool_expr_xor: {
			const bool = new BoolExpr_xor();
			bool.ast_node = expr;
			bool.lh_operand = build_and_link_bool_expr(schema, struct, expr.lh_expr, error);
			bool.rh_operand = build_and_link_bool_expr(schema, struct, expr.rh_expr, error);
			return bool;
		}

		case ast.node_type.bool_expr_eq: {
			const bool = new BoolExpr_eq();
			bool.ast_node = expr;
			// TODO: bool.lh_operand = 
			// TODO: bool.rh_operand = 
			return bool;
		}

		case ast.node_type.bool_expr_neq: {
			const bool = new BoolExpr_neq();
			bool.ast_node = expr;
			// TODO: bool.lh_operand = 
			// TODO: bool.rh_operand = 
			return bool;
		}
	}
}

function link_switch(schema: Schema, node: Switch, error: BuildErrorFactory) {
	for (const case_node of node.cases) {
		// TODO: case_node.case_value
	}
}



// ===== Field Types =====

function link_field_type(schema: Schema, field_type: FieldType, error: BuildErrorFactory, struct?: Struct) {
	switch (field_type.type) {
		case 'struct_ref':
			// TODO: params
			break;

		case 'switch_ref':
			// TODO: param
			break;
			
		case 'type_array':
			link_field_type(schema, field_type.elem_type, error, struct);
			// no break

		case 'type_text':
			link_length(schema, field_type, field_type.length, error, struct);
			break;

		case 'type_checksum':
			link_checksum_type(schema, field_type, error, struct);
			break;

		case 'type_refinement':
			// TODO: refined type
			break;
	}
}

function link_length(schema: Schema, node: ArrayType | TextType, length: Length, error: BuildErrorFactory, struct?: Struct) {
	if (length.length_type === 'length_field') {
		// TODO: Link & Validate: length.field
	}
}

function link_checksum_type(schema: Schema, node: ChecksumType, error: BuildErrorFactory, struct?: Struct) {
	// TODO: Link: node.data_field
}
