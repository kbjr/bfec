
import { Token } from './token';
import { node_type } from '../node';
import { SimpleTokenMatcher, TokenMatcher } from './matcher';

export class NameToken_normal extends Token {
	public type: node_type.name_normal = node_type.name_normal;
}

export class NameToken_root_schema extends Token {
	public type: node_type.name_root_schema = node_type.name_root_schema;
	public text: '$' = '$';
}

export enum builtin_uint {
	u8   = 'u8',
	u16  = 'u16',
	u24  = 'u24',
	u32  = 'u32',
	u64  = 'u64',
	u128 = 'u128',
}

export class NameToken_builtin_uint extends Token {
	public type: node_type.name_builtin_uint = node_type.name_builtin_uint;
	public text: builtin_uint;
}

export enum builtin_sint {
	i8   = 'i8',
	i16  = 'i16',
	i24  = 'i24',
	i32  = 'i32',
	i64  = 'i64',
	i128 = 'i128',
}

export class NameToken_builtin_sint extends Token {
	public type: node_type.name_builtin_sint = node_type.name_builtin_sint;
	public text: builtin_sint;
}

export class NameToken_builtin_vint extends Token {
	public type: node_type.name_builtin_vint = node_type.name_builtin_vint;
	public text: 'varint' = 'varint';
}

export enum builtin_bin_float {
	f16 = 'f16',
	f32 = 'f32',
	f64 = 'f64',
}

export class NameToken_builtin_bin_float extends Token {
	public type: node_type.name_builtin_bin_float = node_type.name_builtin_bin_float;
	public text: builtin_bin_float;
}

export enum builtin_dec_float {
	d16 = 'd16',
	d32 = 'd32',
	d64 = 'd64',
}

export class NameToken_builtin_dec_float extends Token {
	public type: node_type.name_builtin_dec_float = node_type.name_builtin_dec_float;
	public text: builtin_dec_float;
}

export enum builtin_bit {
	b1  = 'b1',
	b2  = 'b2',
	b3  = 'b3',
	b4  = 'b4',
	b5  = 'b5',
	b6  = 'b6',
	b7  = 'b7',
	b8  = 'b8',
	b9  = 'b9',
	b10 = 'b10',
	b11 = 'b11',
	b12 = 'b12',
	b13 = 'b13',
	b14 = 'b14',
	b15 = 'b15',
	b16 = 'b16',
	b17 = 'b17',
	b18 = 'b18',
	b19 = 'b19',
	b20 = 'b20',
	b21 = 'b21',
	b22 = 'b22',
	b23 = 'b23',
	b24 = 'b24',
	b25 = 'b25',
	b26 = 'b26',
	b27 = 'b27',
	b28 = 'b28',
	b29 = 'b29',
	b30 = 'b30',
	b31 = 'b31',
	b32 = 'b32',
}

export class NameToken_builtin_bit extends Token {
	public type: node_type.name_builtin_bit = node_type.name_builtin_bit;
	public text: builtin_bit;
}

export enum builtin_text {
	ascii = 'ascii',
	utf8  = 'utf8',
	utf16 = 'utf16',
	utf32 = 'utf32',
}

export class NameToken_builtin_text extends Token {
	public type: node_type.name_builtin_text = node_type.name_builtin_text;
	public text: builtin_text;
}

export const name_normal            = new TokenMatcher(NameToken_normal, /\b(?:[a-zA-Z_][a-zA-Z0-9_]*)\b/y);
export const name_root_schema       = new SimpleTokenMatcher(NameToken_root_schema, /\$/y);
export const name_builtin_uint      = new TokenMatcher(NameToken_builtin_uint, /\b(?:u8|u16|u24|u32|u64|u128)\b/y);
export const name_builtin_sint      = new TokenMatcher(NameToken_builtin_sint, /\b(?:i8|i16|i24|i32|i64|i128)\b/y);
export const name_builtin_vint      = new SimpleTokenMatcher(NameToken_builtin_vint, /\bvarint\b/y);
export const name_builtin_bin_float = new TokenMatcher(NameToken_builtin_bin_float, /\b(?:f16|f32|f64)\b/y);
export const name_builtin_dec_float = new TokenMatcher(NameToken_builtin_dec_float, /\b(?:d16|d32|d64)\b/y);
export const name_builtin_bit       = new TokenMatcher(NameToken_builtin_bit, /\bb(?:1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32)\b/y);
export const name_builtin_text      = new TokenMatcher(NameToken_builtin_text, /\b(?:ascii|utf8|utf16|utf32)\b/y);
