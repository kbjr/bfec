
import { ConstInt, ConstString } from './const';
import { Enum, EnumMember } from './enum';
import { SchemaNode } from './node';
import { Struct, StructField } from './struct';
import { TypeExpr_array, TypeExpr_checksum, TypeExpr_primitive, TypeExpr_struct_refine } from './type-expr';

export class ConcreteStruct extends SchemaNode {
	public type = 'concrete_struct';
	public source: Struct;
	
	public name: string;
	public fields: ConcreteStructField[] = [ ];
	public field_map = new Map<string, ConcreteStructField>();
}

export type ConcreteTypeExpr
	= TypeExpr_primitive
	| TypeExpr_checksum
	// | TypeExpr_named
	| TypeExpr_array<ConcreteTypeExpr>
	| TypeExpr_struct_refine
	// | TypeExpr_switch_refine
	// | TypeExpr_named_refine
	;

export type ConcreteFieldType
	= Struct
	| ConstInt
	| ConstString
	| Enum
	| EnumMember
	| ConcreteTypeExpr
	;

export class ConcreteStructField extends SchemaNode {
	public type = 'concrete_struct_field';
	public source: StructField;
	
	public name: string;
	public field_type: ConcreteFieldType;
}

export class VariantSet extends SchemaNode {
	// 
}
