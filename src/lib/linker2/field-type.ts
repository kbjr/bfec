
import { ast } from '../parser';
import { Schema } from './schema';
import { NamedSwitch, Switch } from './switch';
import { NamedStruct, Struct } from './struct';
import { BuildErrorFactory } from '../error2';
import { ConstInt, ConstString } from './const';
import { Enum, EnumType } from './enum';
import { linker as log } from '../log';
import {
	EnumMemberRef, EnumRef,
	ImportedRef, ImportedRefable,
	ParamType,
	GlobalFieldRef, LocalFieldRef, StructRef,
	SwitchRef
} from './ref';
import {
	BuiltinType,
	ArrayType,
	ChecksumType,
	FixedIntType, VarIntType,
	FloatType,
	TextType,
	is_array_of, is_fixed_int,
	Length, LengthField, LengthPrefix, LengthType, NullTerminatedLength, StaticLength, TakeRemainingLength,
} from './base-types';

export type FieldType = BuiltinType | EnumRef | StructRef | SwitchRef | ImportedRef<NamedStruct | NamedSwitch>; // | TypeRefinement

export function build_field_type(schema: Schema, expr: ast.TypeExpr, error: BuildErrorFactory) : FieldType {
	switch (expr.type) {
		case ast.node_type.type_expr_array:
			return build_array(schema, expr, error);

		case ast.node_type.type_expr_checksum:
			return build_checksum(schema, expr, error);

		case ast.node_type.type_expr_len:
			return build_len(schema, expr, error);

		case ast.node_type.type_expr_named:
			return build_named(schema, expr, error);

		case ast.node_type.type_expr_named_refinement:
			return build_named_refinement(schema, expr, error);

		case ast.node_type.type_expr_struct_refinement:
			return build_struct_refinement(schema, expr, error);

		case ast.node_type.type_expr_switch_refinement:
			return build_switch_refinement(schema, expr, error);

		case ast.node_type.type_expr_text:
			return build_text(expr, error);

		case ast.node_type.type_expr_vint:
			return build_varint(expr, error);

		case ast.node_type.name_builtin_uint:
		case ast.node_type.name_builtin_sint:
		case ast.node_type.name_builtin_bit:
			return build_fixed_int(expr, error);

		case ast.node_type.name_builtin_bin_float:
		case ast.node_type.name_builtin_dec_float:
			return build_float(expr, error);
	}
}

export function build_enum_type(expr: ast.TypeExpr, error: BuildErrorFactory) : EnumType {
	switch (expr.type) {
		case ast.node_type.type_expr_array:
		case ast.node_type.type_expr_checksum:
		case ast.node_type.type_expr_len:
		case ast.node_type.type_expr_named:
		case ast.node_type.type_expr_named_refinement:
		case ast.node_type.type_expr_struct_refinement:
		case ast.node_type.type_expr_switch_refinement:
		case ast.node_type.name_builtin_bin_float:
		case ast.node_type.name_builtin_dec_float:
			error.type_expr(expr, 'Type expression not valid for enum; Must be a text or integer type');
			return null;

		case ast.node_type.type_expr_text:
			return build_text(expr, error);

		case ast.node_type.type_expr_vint:
			return build_varint(expr, error);

		case ast.node_type.name_builtin_uint:
		case ast.node_type.name_builtin_sint:
		case ast.node_type.name_builtin_bit:
			return build_fixed_int(expr, error);
	}
}

export function build_simple_type(expr: ast.TypeExpr, error: BuildErrorFactory) {
	switch (expr.type) {
		case ast.node_type.type_expr_array:
			return build_simple_array(expr, error);

		case ast.node_type.type_expr_text:
			return build_text(expr, error);

		case ast.node_type.type_expr_vint:
			return build_varint(expr, error);

		case ast.node_type.name_builtin_uint:
		case ast.node_type.name_builtin_sint:
		case ast.node_type.name_builtin_bit:
			return build_fixed_int(expr, error);

		case ast.node_type.name_builtin_bin_float:
		case ast.node_type.name_builtin_dec_float:
			return build_float(expr, error);

		case ast.node_type.type_expr_checksum:
		case ast.node_type.type_expr_len:
		case ast.node_type.type_expr_named:
		case ast.node_type.type_expr_named_refinement:
		case ast.node_type.type_expr_struct_refinement:
		case ast.node_type.type_expr_switch_refinement:
			error.type_expr(expr, 'Non-simple type expr provided to build_simple_type');
			return null;
	}
}

export function build_simple_array(expr: ast.TypeExpr_array, error: BuildErrorFactory) {
	const type = new ArrayType();
	type.ast_node = expr;
	type.length = build_length(expr.length_type, error);
	type.elem_type = build_simple_type(expr.elem_type, error);
	return type;
}

export function build_array(schema: Schema, expr: ast.TypeExpr_array, error: BuildErrorFactory) {
	const type = new ArrayType();
	type.ast_node = expr;
	type.length = build_length(expr.length_type, error);

	const elem_type = build_field_type(schema, expr.elem_type, error);

	if (elem_type.type === 'type_checksum' || elem_type.type === 'type_len') {
		error(elem_type, 'Invalid element type for array type expr');
		return type;
	}

	type.elem_type = elem_type;
	return type;
}

export function build_checksum(schema: Schema, expr: ast.TypeExpr_builtin_checksum, error: BuildErrorFactory) {
	const type = new ChecksumType();
	type.checksum_func = ConstString.from_ast(expr.checksum_func);
	type.data_field = build_struct_field_ref(expr.data_expr, error);
	
	switch (expr.real_type.type) {
		case ast.node_type.type_expr_text:
			type.real_type = build_text(expr.real_type, error);
			break;

		case ast.node_type.type_expr_array: {
			const real_type = build_array(schema, expr.real_type, error);

			if (is_array_of(real_type, is_fixed_int)) {
				type.real_type = real_type;
			}

			else {
				error(real_type, 'Real type for `checksum<real>` must be either a fixed-int, text, or fixed-int array type');
			}

			break;
		}

		case ast.node_type.name_builtin_uint:
		case ast.node_type.name_builtin_sint:
		case ast.node_type.name_builtin_bit:
			type.real_type = build_fixed_int(expr.real_type, error);
			break;

		default:
			error.type_expr(expr.real_type, 'Real type for `checksum<real>` must be either a fixed-int, text, or fixed-int array type');
			break
	}

	return type;
}

export function build_len(schema: Schema, expr: ast.TypeExpr_builtin_len, error: BuildErrorFactory) {
	const type = new LengthType();
	type.ast_node = expr;
	type.real_type = expr.real_type.type === ast.node_type.type_expr_vint
		? build_varint(expr.real_type, error)
		: build_fixed_int(expr.real_type, error);
	return type;
}

export function build_named(schema: Schema, expr: ast.TypeExpr_named, error: BuildErrorFactory) {
	const found = schema.symbols.get(expr.name.text);

	if (! found) {
		error(expr.name, `Referenced name "${expr.name.text}" not found`);
		return null;
	}

	const params: ParamType[] = [ ];

	if (expr.params) {
		for (const param of expr.params.params) {
			params.push(
				build_named_param(param.param, error)
			);
		}
	}

	switch (found.type) {
		case 'imported_ref':
			let points_to: ImportedRefable = found;

			while (points_to && points_to.type === 'imported_ref') {
				points_to = points_to.points_to;
			}

			if (! points_to) {
				error(expr.name, `Failed to resolve imported symbol "${expr.name.text}"`);
				return null;
			}

			switch (points_to.type) {
				case 'struct': return struct_ref(expr, points_to, found, params);
				case 'switch': return switch_ref(expr, points_to, found, params);

				case 'enum':
					if (params.length) {
						error.type_expr(expr, 'Enum reference not expected to have parameters');
					}

					return enum_ref(expr, points_to, found);

				default:
					error(expr.name, `Failed to resolve imported symbol "${expr.name.text}"`);
					return null;
			}

		case 'struct': return struct_ref(expr, found, void 0, params);
		case 'switch': return switch_ref(expr, found, void 0, params);

		case 'enum':
			if (params.length) {
				error.type_expr(expr, 'Enum reference not expected to have parameters');
			}

			return enum_ref(expr, found);

		default:
			error(expr.name, `Failed to resolve symbol "${expr.name.text}"`);
			return null;
	}
}

function struct_ref(expr: ast.TypeExpr_named, points_to: Struct, imported?: ImportedRef, params?: ParamType[]) {
	const ref = new StructRef();
	ref.ast_node = expr;
	ref.points_to = points_to;
	ref.imported = imported;
	return ref;
}

function switch_ref(expr: ast.TypeExpr_named, points_to: Switch, imported?: ImportedRef, params?: ParamType[]) {
	const ref = new SwitchRef();
	ref.ast_node = expr;
	ref.points_to = points_to;
	ref.imported = imported;
	return ref;
}

function enum_ref(expr: ast.TypeExpr_named, points_to: Enum, imported?: ImportedRef) {
	const ref = new EnumRef();
	ref.ast_node = expr;
	ref.points_to = points_to;
	ref.imported = imported;
	return ref;
}

export function build_text(expr: ast.TypeExpr_builtin_text, error: BuildErrorFactory) {
	const type = new TextType();
	type.ast_node = expr;
	type.length = build_length(expr.length_type, error);
	return type;
}

export function build_varint(expr: ast.TypeExpr_builtin_vint, error: BuildErrorFactory) {
	const type = new VarIntType();
	type.ast_node = expr;
	type.real_type = build_fixed_int(expr.real_type, error);
	return type;
}

export type ASTFixedInt = ast.NameToken_builtin_uint | ast.NameToken_builtin_sint | ast.NameToken_builtin_bit;

const parse_int_type = /^(u|i|b)([0-9]+)(_be|_le)?/;

export function build_fixed_int(expr: ASTFixedInt, error: BuildErrorFactory) {
	const type = new FixedIntType();
	type.ast_node = expr;

	const int_info = parse_int_type.exec(expr.text);

	if (! int_info) {
		log.debug('Invalid node passed to build_type_expr_fixed_int', expr);
		error(type, `Unknown fixed int type`);
	}
	
	else {
		type.is_big_endian = int_info[3] === '_be';
		type.size_bits = parseInt(int_info[2], 10);
		type.is_signed = int_info[1] === 'i';
	}

	return type;
}

export type ASTFloat = ast.NameToken_builtin_bin_float | ast.NameToken_builtin_dec_float;

const parse_float_type = /^(f|d)([0-9]+)/;

export function build_float(expr: ASTFloat, error: BuildErrorFactory) {
	const type = new FloatType();
	type.ast_node = expr;
	
	const float_info = parse_float_type.exec(expr.text);

	if (! float_info) {
		log.debug('Invalid node passed to build_type_expr_float', expr);
		error(expr, `Unknown float type`);
	}

	else {
		type.size_bits = parseInt(float_info[2], 10);
		type.is_decimal = float_info[1] === 'd';
	}

	return type;
}

export function build_length(expr: ast.LengthType, error: BuildErrorFactory) : Length {
	switch (expr.type) {
		case ast.node_type.kw_null: {
			const len = new NullTerminatedLength();
			len.ast_node = expr;
			return len;
		}

		case ast.node_type.op_expansion: {
			const len = new TakeRemainingLength();
			len.ast_node = expr;
			return len;
		}

		case ast.node_type.const_int:
		case ast.node_type.const_hex_int: {
			const len = new StaticLength();
			len.ast_node = expr;
			len.value = ConstInt.from_ast(expr);
			return len;
		}

		case ast.node_type.type_expr_vint:
		case ast.node_type.name_builtin_bit:
		case ast.node_type.name_builtin_sint:
		case ast.node_type.name_builtin_uint: {
			const len = new LengthPrefix();
			len.ast_node = expr;
			len.prefix_type = expr.type === ast.node_type.type_expr_vint
				? build_varint(expr, error)
				: build_fixed_int(expr, error);
			return len;
		}

		case ast.node_type.value_expr_path: {
			const len = new LengthField();
			len.ast_node = expr;
			return len;
		}

		default:
			error.type_expr(expr, 'Expected valid field length expr');
			return null;
	}
}

export function build_named_refinement(schema: Schema, expr: ast.TypeExpr_named_refinement, error: BuildErrorFactory) {
	error.type_expr(expr, 'Named type refinements not yet supported');
	return null;
}

export function build_struct_refinement(schema: Schema, expr: ast.TypeExpr_struct_refinement, error: BuildErrorFactory) {
	error.type_expr(expr, 'Struct type refinements not yet supported');
	return null;
}

export function build_switch_refinement(schema: Schema, expr: ast.TypeExpr_switch_refinement, error: BuildErrorFactory) {
	error.type_expr(expr, 'Switch type refinements not yet supported');
	return null;
}

export function build_struct_field_ref(expr: ast.ValueExpr_path, error: BuildErrorFactory) {
	switch (expr.lh_name.text) {
		case '$': {
			const ref = new GlobalFieldRef();
			ref.ast_node = expr;
			return ref;
		}

		case '@': {
			const ref = new LocalFieldRef();
			ref.ast_node = expr;
			return ref;
		}

		default:
			error(expr.lh_name, 'Invalid struct field reference; Must start with either "$" or "@"');
	}
}

export function build_named_param(expr: ast.ValueExpr_path, error: BuildErrorFactory) {
	switch (expr.lh_name.text) {
		case '$': {
			const ref = new GlobalFieldRef();
			ref.ast_node = expr;
			return ref;
		}

		case '@': {
			const ref = new LocalFieldRef();
			ref.ast_node = expr;
			return ref;
		}

		default: {
			const ref = new EnumMemberRef();
			ref.ast_node = expr;
			return ref;
		}
	}
}
