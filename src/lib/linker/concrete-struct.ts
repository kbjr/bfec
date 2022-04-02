
import { ConstInt, ConstString, Enum, EnumMember, Struct, StructField, StructParam, TypeExpr_int, TypeExpr_text } from '../schema';

export class GenericStruct {
	public node: Struct;
	public params: ConcreteStructParam[] = [ ];
	public implementations: (GenericStruct | ConcreteStruct)[] = [ ];
}

export class GenericStructParam {
	public node: StructParam;
	public name: string;
	public type: ConcreteStructParamType;
}

export class ConcreteStruct {
	public node: Struct;
	public name: string;
	public fields: ConcreteStructField[] = [ ];
}

export class ConcreteStructParam {
	public node: StructParam;
	public name: string;
	public value: ConstString | ConstInt;
}

export class ConcreteStructField {
	public node: StructField;
	public name: string;
}

export type ConcreteStructParamType
	= TypeExpr_int
	| TypeExpr_text
	| Enum
	;

export type ConcreteStructFieldType
	= ConstString
	| ConstInt
	| EnumMember
	| Enum
	| Struct
	;

export class StructFieldType<T> {
	// 
}
