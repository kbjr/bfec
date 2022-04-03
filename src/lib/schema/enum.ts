
import { ast } from '../parser';
import { Const } from './const';
import { Schema } from './schema';
import { Comment } from './comment';
import { SchemaNode } from './node';
import { is_type_expr_int, is_type_expr_text, TypeExpr_int, TypeExpr_text } from './type-expr';

export type EnumMemberType = TypeExpr_int | TypeExpr_text;

export class Enum extends SchemaNode {
	public type = 'enum';
	public comments: Comment[];
	public name: ast.NameToken_normal;
	public member_type: EnumMemberType;
	public members: EnumMember[] = [ ];
	public member_map: Map<string, EnumMember> = new Map();
	public parent_schema: Schema;

	public add_member(name_node: ast.NameToken_normal, member: EnumMember) {
		if (this.member_map.has(name_node.text)) {
			this.parent_schema.error(name_node, `Encountered duplicate enum member name "${name_node.text}"`);
			return false;
		}
	
		this.members.push(member);
		this.member_map.set(name_node.text, member);
		return true;
	}
}

export class EnumMember extends SchemaNode {
	public type = 'enum_member';
	public comments: Comment[];
	public name: ast.NameToken_normal;
	public value: Const;
}

export function is_enum(node: SchemaNode) : node is Enum {
	return node instanceof Enum;
}

export function is_enum_member(node: SchemaNode) : node is EnumMember {
	return node instanceof EnumMember;
}

export function is_enum_member_type(node: SchemaNode) : node is EnumMemberType {
	return is_type_expr_int(node) || is_type_expr_text(node);
}
