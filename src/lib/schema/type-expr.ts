
import { ValueExpr } from './value-expr';
import { BaseNode, node_type } from './node';
import { ConstInt, ConstString } from './const';
import { Ref } from './schema';

export type TypeExpr
	= TypeExpr_text
	| TypeExpr_fixed_int
	| TypeExpr_varint
	| TypeExpr_float
	| TypeExpr_length
	| TypeExpr_checksum
	| TypeExpr_named
	| TypeExpr_array
	| TypeExpr_struct_refine
	| TypeExpr_switch_refine
	| TypeExpr_named_refine
	;

export class TypeExpr_text extends BaseNode {
	public type: node_type.type_expr_text = node_type.type_expr_text;
	public encoding: TextEncoding;
	public length_type: TextLengthType;
	public static_length?: ConstInt;
	public length_prefix?: TypeExpr_fixed_int | TypeExpr_varint;
	public length_field?: ValueExpr;
}

export enum TextLengthType {
	null_terminated = 'null_terminated',
	take_remaining  = 'take_remaining',
	static_length   = 'static_length',
	length_prefix   = 'length_prefix',
	length_field    = 'length_field',
}

export enum TextEncoding {
	ascii = 'ascii',
	utf8  = 'utf8',
	utf16 = 'utf16',
	utf32 = 'utf32',
}

export class TypeExpr_fixed_int extends BaseNode {
	public type: node_type.type_expr_fixed_int = node_type.type_expr_fixed_int;
	public name: string;
	public signed: boolean;
	public big_endian: boolean;
	public size_bits: number;
}

export class TypeExpr_varint extends BaseNode {
	public type: node_type.type_expr_varint = node_type.type_expr_varint;
	public real_type: TypeExpr_fixed_int;
}

export class TypeExpr_float extends BaseNode {
	public type: node_type.type_expr_float = node_type.type_expr_float;
	public name: string;
	public decimal: boolean;
	public size_bits: number;
}

export class TypeExpr_length extends BaseNode {
	public type: node_type.type_expr_length = node_type.type_expr_length;
	public real_type: TypeExpr_fixed_int | TypeExpr_varint;
}

export class TypeExpr_checksum extends BaseNode {
	public type: node_type.type_expr_checksum = node_type.type_expr_checksum;
	public real_type: TypeExpr;
	public data_expr: ValueExpr;
	public func_name: ConstString;
}

export class TypeExpr_named extends BaseNode {
	public type: node_type.type_expr_named = node_type.type_expr_named;
	public name: Ref;
}

export class TypeExpr_array extends BaseNode {
	public type: node_type.type_expr_array = node_type.type_expr_array;
	public element_type: TypeExpr;
	public length_type: ArrayLengthType;
	public static_length?: ConstInt;
	public length_prefix?: TypeExpr_fixed_int | TypeExpr_varint;
	public length_field?: ValueExpr;
}

export enum ArrayLengthType {
	null_terminated = 'null_terminated',
	take_remaining  = 'take_remaining',
	static_length   = 'static_length',
	length_prefix   = 'length_prefix',
	length_field    = 'length_field',
}

export class TypeExpr_struct_refine extends BaseNode {
	public type: node_type.type_expr_struct_refine = node_type.type_expr_struct_refine;
	// TODO: Struct refine
}

export class TypeExpr_switch_refine extends BaseNode {
	public type: node_type.type_expr_switch_refine = node_type.type_expr_switch_refine;
	// TODO: Switch refine
}

export class TypeExpr_named_refine extends BaseNode {
	public type: node_type.type_expr_named_refine = node_type.type_expr_named_refine;
	public refined_type: TypeExpr_named;
}
