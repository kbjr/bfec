
import { ast } from '../parser';
import { TypeExpr } from './type-expr';
import { BaseNode, node_type } from './node';
import { Comment, Ref, Schema } from './schema';

export class Enum extends BaseNode {
	public type: node_type.enum = node_type.enum;
	public comments: Comment[];
	public name: Ref;
	public member_type: TypeExpr;
	public members: EnumMember[] = [ ];
	public member_map: Map<string, EnumMember> = new Map();

	public add_member(schema: Schema, name_node: ast.NameToken_normal, member: EnumMember) {
		if (this.member_map.has(name_node.text)) {
			schema.build_error(`Encountered duplicate enum member name "${name_node.text}"`, name_node);
			return false;
		}
	
		this.members.push(member);
		this.member_map.set(name_node.text, member);
		return true;
	}
}

export class EnumMember extends BaseNode {
	public type: node_type.enum_member = node_type.enum_member;
	public comments: Comment[];
}
