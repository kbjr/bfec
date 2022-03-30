
import type { TypeExpr } from './type-expr';
import type { Comment, Schema, Ref } from './schema';
import type { Import, ImportedSymbol } from './import';
import type { Struct, StructExpansion, StructField, StructParam } from './struct';
import type { Switch, SwitchCase } from './switch';
import type { Enum, EnumMember } from './enum';
import type { ValueExpr } from './value-expr';
import type { BoolExpr } from './bool-expr';
import type { ConstInt, ConstString } from './const';

export abstract class BaseNode {
	public abstract type: node_type;
	
	public toJSON() {
		const json: any = Object.assign({ }, this);
		json.type = node_type[json.type];
		return json;
	}
}

export type SchemaNode
	= Schema
	| Ref
	| Import
	| ImportedSymbol
	| Struct
	| StructParam
	| StructField
	| StructExpansion
	| Switch
	| SwitchCase
	| Enum
	| EnumMember
	| Comment
	| ConstInt
	| ConstString
	| TypeExpr
	| ValueExpr
	| BoolExpr
	;

export enum node_type {
	schema,
	ref,
	import,
	imported_symbol,
	struct,
	struct_param,
	struct_field,
	struct_expansion,
	switch,
	switch_case,
	enum,
	enum_member,
	comment,
	const_int,
	const_string,

	type_expr_text,
	type_expr_fixed_int,
	type_expr_varint,
	type_expr_float,
	type_expr_length,
	type_expr_checksum,
	type_expr_named,
	type_expr_array,
	type_expr_struct_refine,
	type_expr_switch_refine,
	type_expr_named_refine,
	
	value_expr,
	
	bool_expr,
}
