
import { TypeExpr } from './type-expr';
import { BaseNode, node_type } from './node';
import { Comment, Ref, Schema } from './schema';
import { ConstInt, ConstString } from './const';
import { BoolExpr } from './bool-expr';
import { ast } from '../parser';

export type StructElem = StructField | StructExpansion;

export class Struct extends BaseNode {
	public type: node_type.struct = node_type.struct;
	public comments: Comment[] = [ ];
	public name: Ref;
	public byte_aligned: boolean;
	public fields: StructElem[] = [ ];
	public field_map: Map<string, StructField> = new Map();
	
	public add_field(schema: Schema, name_node: ast.NameToken_normal, field: StructField) {
		if (this.field_map.has(name_node.text)) {
			schema.build_error(`Encountered duplicate symbol name "${name_node.text}"`, name_node);
			return false;
		}
	
		this.fields.push(field);
		this.field_map.set(name_node.text, field);
		return true;
	}

	public add_expansion(schema: Schema, expansion: StructExpansion) {
		this.fields.push(expansion);
		return true;
	}
}

export class StructField extends BaseNode {
	public type: node_type.struct_field = node_type.struct_field;
	public comments: Comment[] = [];
	public name: Ref;
	public condition?: BoolExpr;
	public field_type: TypeExpr | ConstInt | ConstString;
}

export class StructExpansion extends BaseNode {
	public type: node_type.struct_expansion = node_type.struct_expansion;
	public comments: Comment[] = [];
	public expanded_type: TypeExpr;
}
