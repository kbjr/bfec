
import { Schema } from './schema';
import { Const } from './const';
import { BoolExpr } from './bool-expr';
import { ast } from '../parser';
import { SchemaNode } from './node';
import { Comment } from './comment';
import { NamedRef } from './ref';
import { TypeExpr, TypeExpr_named, TypeExpr_named_refine, TypeExpr_struct_refine, TypeExpr_switch_refine } from './type-expr';

export type StructElem = StructField | StructExpansion;

export class Struct extends SchemaNode {
	public type = 'struct';
	public comments: Comment[] = [ ];
	public name: ast.NameToken_normal | ast.NameToken_root_schema;
	public byte_aligned: boolean;
	public params: StructParam[] = [ ];
	public fields: StructElem[] = [ ];
	public field_map: Map<string, StructField> = new Map();
	public parent_schema: Schema;
	
	public add_field(name_node: ast.NameToken_normal, field: StructField) {
		if (this.field_map.has(name_node.text)) {
			this.parent_schema.error(name_node, `Encountered duplicate symbol name "${name_node.text}"`);
			return false;
		}
	
		this.fields.push(field);
		this.field_map.set(name_node.text, field);
		return true;
	}

	public add_expansion(expansion: StructExpansion) {
		this.fields.push(expansion);
		return true;
	}
}

export class StructParam extends SchemaNode {
	public type = 'struct_param';
	public name: ast.NameToken_normal;
	public param_type: TypeExpr;
}

export type StructFieldType = TypeExpr | Const;

export class StructField<T extends StructFieldType = StructFieldType> extends SchemaNode {
	public type = 'struct_field';
	public comments: Comment[] = [ ];
	public name: ast.NameToken_normal;
	public condition?: BoolExpr;
	public field_type: T;
	public field_value?: NamedRef;
}

export type StructExpansionType = TypeExpr_named | TypeExpr_named_refine | TypeExpr_struct_refine | TypeExpr_switch_refine;

export class StructExpansion extends SchemaNode {
	public type = 'struct_expansion';
	public comments: Comment[] = [ ];
	public expanded_type: StructExpansionType;
}

export function is_struct(node: SchemaNode) : node is Struct {
	return node instanceof Struct;
}

export function is_struct_param(node: SchemaNode) : node is StructParam {
	return node instanceof StructParam;
}

export function is_struct_field(node: SchemaNode) : node is StructField {
	return node instanceof StructField;
}

export function is_struct_expansion(node: SchemaNode) : node is StructExpansion {
	return node instanceof StructExpansion;
}
