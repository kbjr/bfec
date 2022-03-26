
import * as schema from './schema';

export abstract class BaseNode {
	public abstract type: node_type;
	
	public toJSON() {
		const json: any = Object.assign({ }, this);
		json.type = node_type[json.type];
		return json;
	}
}

export enum node_type {
	schema,
	symbol,
	import,
	imported_symbol,
	struct,
	struct_field,
	switch,
	switch_case,
	enum,
	enum_member,
	comment,
	const_int,
	const_string,
	type_expr,
	value_expr,
	bool_expr,
}

export type SchemaNode
	= schema.Schema
	| schema.Symbol
	| schema.Import
	| schema.ImportedSymbol
	| schema.Struct
	| schema.StructField
	| schema.Switch
	| schema.SwitchCase
	| schema.Enum
	| schema.EnumMember
	| schema.Comment
	| schema.ConstInt
	| schema.ConstString
	| schema.TypeExpr
	| schema.ValueExpr
	| schema.BoolExpr
	;
