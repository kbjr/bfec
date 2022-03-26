
import { ast } from '../parser';
import { ASTNode } from '../parser/ast';
import { BaseNode, node_type, SchemaNode } from './node';

export type SchemaElem = ImportedSymbol | Struct | Switch | Enum;

export class Schema extends BaseNode {
	public type: node_type.schema = node_type.schema;
	public imports: Import[] = [ ];
	public root: Struct;
	public elements: SchemaElem[] = [ ];
	public element_map: Map<string, SchemaElem> = new Map();
	public source_map: Map<SchemaNode, ast.ASTNode> = new Map();
	public errors: BuildError[] = [ ];

	public toJSON() {
		return {
			type: node_type[this.type],
			imports: this.imports,
			elements: this.elements,
			errors: this.errors,
		};
	}
}

export class BuildError {
	public message: string;
	public line: number;
	public char: number;
	public text: string;
	public node: ASTNode;
}

export class Symbol extends BaseNode {
	public type: node_type.symbol = node_type.symbol;
	constructor(
		public name: string
	) {
		super();
	}
}

export class Import extends BaseNode {
	public type: node_type.import = node_type.import;
	public comments: Comment[] = [ ];
	public source_expr: ConstString;
	public source_schema: Schema;
}

export class ImportedSymbol extends BaseNode {
	public type: node_type.imported_symbol = node_type.imported_symbol;
	public from: Import;
	public local: Symbol;
	public imported: Symbol;
}

export class Struct extends BaseNode {
	public type: node_type.struct = node_type.struct;
	public comments: Comment[] = [ ];
	public name: Symbol;
	public byte_aligned: boolean;
	public fields: StructField[] = [ ];
}

export class StructField extends BaseNode {
	public type: node_type.struct_field = node_type.struct_field;
	public comments: Comment[] = [ ];
	public name: Symbol;
}

export class Switch extends BaseNode {
	public type: node_type.switch = node_type.switch;
	public comments: Comment[];
	public cases: SwitchCase[];
	public default: SwitchCase;
}

export class SwitchCase extends BaseNode {
	public type: node_type.switch_case = node_type.switch_case;
	public comments: Comment[];
	public case_value?: Symbol;
	public case_type: 'type_expr' | 'void' | 'invalid';
	public case_type_expr?: TypeExpr;
}

export class Enum extends BaseNode {
	public type: node_type.enum = node_type.enum;
	public comments: Comment[];
	public members: EnumMember[];
}

export class EnumMember extends BaseNode {
	public type: node_type.enum_member = node_type.enum_member;
	public comments: Comment[];
}

export class Comment extends BaseNode {
	public type: node_type.comment = node_type.comment;
	public text: string;
}

export class ConstInt extends BaseNode {
	public type: node_type.const_int = node_type.const_int;
	public value: number;
}

export class ConstString extends BaseNode {
	public type: node_type.const_string = node_type.const_string;
	public value: string;
	public unicode: boolean;
}

export class TypeExpr extends BaseNode {
	public type: node_type.type_expr = node_type.type_expr;
}

export class ValueExpr extends BaseNode {
	public type: node_type.value_expr = node_type.value_expr;
}

export class BoolExpr extends BaseNode {
	public type: node_type.bool_expr = node_type.bool_expr;
}
