
import { NamedRef, RootRef } from './ref';
import { SchemaNode } from './node';
import { EnumMember } from './enum';
import { Struct, StructField } from './struct';
import { Const, ConstInt, ConstString } from './const';
import { Switch } from './switch';

export type TypeExpr_int = TypeExpr_fixed_int | TypeExpr_varint;

export type TypeExpr_primitive = TypeExpr_int | TypeExpr_float | TypeExpr_text | TypeExpr_length;

export class TypeExpr extends SchemaNode {
	public type = 'type_expr';
}

export enum len_type {
	null_terminated = 'null_terminated',
	take_remaining  = 'take_remaining',
	static_length   = 'static_length',
	length_prefix   = 'length_prefix',
	length_field    = 'length_field',
}

export class TypeExpr_text extends TypeExpr {
	public type_type = 'text';
	public encoding: text_enc;
	public length_type: len_type;
	public static_length?: ConstInt;
	public length_prefix?: TypeExpr_fixed_int | TypeExpr_varint;
	public length_field?: NamedRef<StructField<TypeExpr_length>>;
}

export enum text_enc {
	ascii = 'ascii',
	utf8  = 'utf8',
	utf16 = 'utf16',
	utf32 = 'utf32',
}

export class TypeExpr_fixed_int extends TypeExpr {
	public type_type = 'fixed_int';
	public name: string;
	public signed: boolean;
	public big_endian: boolean;
	public size_bits: number;

	public get min() {
		return int_min(this.size_bits, this.signed);
	}

	public get max() {
		return int_max(this.size_bits, this.signed);
	}
}

export class TypeExpr_varint extends TypeExpr {
	public type_type = 'varint';
	public real_type: TypeExpr_fixed_int;

	public get min() {
		return this.real_type.min;
	}

	public get max() {
		return this.real_type.max;
	}
}

export class TypeExpr_float extends TypeExpr {
	public type_type = 'float';
	public name: string;
	public decimal: boolean;
	public size_bits: number;
}

export class TypeExpr_length extends TypeExpr {
	public type_type = 'length';
	public real_type: TypeExpr_fixed_int | TypeExpr_varint;
}

export class TypeExpr_checksum extends TypeExpr {
	public type_type = 'checksum';
	public real_type: TypeExpr;
	public data_expr: NamedRef<StructField>;
	public func_name: ConstString;
}

export type TypeExprNamedParam = NamedRef<StructField | EnumMember> | Const;

export class TypeExpr_named extends TypeExpr {
	public type_type = 'named';
	public name: RootRef | NamedRef;
	public params: TypeExprNamedParam[] = [ ];
}

export class TypeExpr_array extends TypeExpr {
	public type_type = 'array';
	public element_type: TypeExpr;
	public length_type: len_type;
	public static_length?: ConstInt;
	public length_prefix?: TypeExpr_fixed_int | TypeExpr_varint;
	public length_field?: NamedRef<StructField<TypeExpr_length>>;
}

export class TypeExpr_struct_refine extends TypeExpr {
	public type_type = 'struct_refine';
	public parent_type: TypeExpr;
	public refined_type: Struct;
}

export class TypeExpr_switch_refine extends TypeExpr {
	public type_type = 'switch_refine';
	public parent_type: TypeExpr;
	public refined_type: Switch;
}

export class TypeExpr_named_refine extends TypeExpr {
	public type_type = 'named_refine';
	public parent_type: TypeExpr;
	public refined_type: TypeExpr_named;
}

function int_min(size_bits: number, signed: boolean) : bigint {
	if (! signed) {
		return 0n;
	}

	const base = 2n ** BigInt(size_bits);
	return -(base / 2n);
}

function int_max(size_bits: number, signed: boolean) : bigint {
	const base = 2n ** BigInt(size_bits);
	return (signed ? (base / 2n) : base) - 1n;
}

export function is_type_expr_named(node: SchemaNode) : node is TypeExpr_named {
	return node instanceof TypeExpr_named;
}

export function is_type_expr_primitive(node: SchemaNode) : node is TypeExpr_named {
	return is_type_expr_int(node) || is_type_expr_float(node) || is_type_expr_text(node);
}

export function is_type_expr_int(node: SchemaNode) : node is TypeExpr_int {
	return is_type_expr_fixed_int(node) || is_type_expr_varint(node);
}

export function is_type_expr_fixed_int(node: SchemaNode) : node is TypeExpr_fixed_int {
	return node instanceof TypeExpr_fixed_int;
}

export function is_type_expr_varint(node: SchemaNode) : node is TypeExpr_varint {
	return node instanceof TypeExpr_varint;
}

export function is_type_expr_length(node: SchemaNode) : node is TypeExpr_length {
	return node instanceof TypeExpr_length;
}

export function is_type_expr_float(node: SchemaNode) : node is TypeExpr_float {
	return node instanceof TypeExpr_float;
}

export function is_type_expr_text(node: SchemaNode) : node is TypeExpr_text {
	return node instanceof TypeExpr_text;
}

export function is_type_expr_array(node: SchemaNode) : node is TypeExpr_array {
	return node instanceof TypeExpr_array;
}

export function is_type_expr_checksum(node: SchemaNode) : node is TypeExpr_checksum {
	return node instanceof TypeExpr_checksum;
}

export function is_type_expr_named_refine(node: SchemaNode) : node is TypeExpr_named_refine {
	return node instanceof TypeExpr_named_refine;
}

export function is_type_expr_struct_refine(node: SchemaNode) : node is TypeExpr_struct_refine {
	return node instanceof TypeExpr_struct_refine;
}

export function is_type_expr_switch_refine(node: SchemaNode) : node is TypeExpr_switch_refine {
	return node instanceof TypeExpr_switch_refine;
}
