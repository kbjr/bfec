
import { ast } from '../parser';
import { Schema } from './schema';
import { FixedIntType, TextType, VarIntType } from './base-types';
import { Comment } from './comment';
import { ConstInt, ConstString } from './const';
import { SchemaNode } from './node';
import { pos } from './pos';

export type EnumType = FixedIntType | VarIntType | TextType;

export type EnumMemberValue<T extends EnumType = EnumType>
	= T extends FixedIntType ? ConstInt
	: T extends VarIntType ? ConstInt
	: T extends TextType ? ConstString
	: never;

export class Enum<T extends EnumType = EnumType> implements SchemaNode {
	public type = 'enum' as const;
	public comments: Comment[];
	public ast_node: ast.DeclareEnumNode;
	public symbols = new Map<string, EnumMember<T>>();
	public member_type: T;
	public members: EnumMember<T>[];
	public parent: Schema;

	public get name() {
		return this.name_token.text;
	}

	public get name_token() {
		return this.ast_node.name;
	}

	public get pos() {
		return pos(this.ast_node.enum_keyword, this.ast_node.body.close_brace);
	}

	public toJSON() {
		return {
			type: this.type,
			comments: this.comments,
			member_type: this.member_type,
			members: this.members,
		};
	}
}

export class EnumMember<T extends EnumType = EnumType> implements SchemaNode {
	public type = 'enum_member' as const;
	public comments: Comment[];
	public ast_node: ast.EnumMember;
	public value: EnumMemberValue<T>;
	public parent: Enum;

	public get name() {
		return this.name_token.text;
	}

	public get name_token() {
		return this.ast_node.name;
	}

	public get pos() {
		return null;
	}

	public toJSON() {
		return {
			type: this.type,
			comments: this.comments,
			value: this.value,
		};
	}
}
