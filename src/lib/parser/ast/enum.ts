
import { ASTNode, node_type } from './node';
import {
	Ignored,
	KeywordToken_enum,
	NameToken_normal,
	PuncToken_open_brace, PuncToken_close_brace,
	PuncToken_colon,
	PuncToken_terminator,
	ConstToken_int,
	ConstToken_hex_int,
	ConstToken_ascii,
	ConstToken_unicode,
	PuncToken_assign,
} from './tokens';
import { TypeExpr } from './type-expr';

export type EnumElem = EnumMember | Ignored ;

export class DeclareEnumNode extends ASTNode {
	public type: node_type.decl_enum = node_type.decl_enum;
	public enum_keyword: KeywordToken_enum;
	public name: NameToken_normal;
	public punc_colon: PuncToken_colon;
	public value_type: TypeExpr;
	public body: EnumBody;
	public children: Ignored[] = [ ];

	public toJSON() {
		return {
			type: node_type[this.type],
			enum_keyword: this.enum_keyword,
			name: this.name,
			punc_colon: this.punc_colon,
			value_type: this.value_type,
			body: this.body,
			children: this.children,
		};
	}
}

export class EnumBody extends ASTNode {
	public type: node_type.enum_body = node_type.enum_body;
	public open_brace: PuncToken_open_brace;
	public close_brace: PuncToken_close_brace;
	public children: EnumElem[] = [ ];

	public toJSON() {
		return {
			type: node_type[this.type],
			open_brace: this.open_brace,
			close_brace: this.close_brace,
			children: this.children,
		};
	}
}

export class EnumMember extends ASTNode {
	public type: node_type.enum_member = node_type.enum_member;
	public name: NameToken_normal;
	public assign: PuncToken_assign;
	public value_expr: ConstToken_int | ConstToken_hex_int | ConstToken_ascii | ConstToken_unicode;
	public terminator: PuncToken_terminator;
	public children: EnumElem[] = [ ];

	public toJSON() {
		return {
			type: node_type[this.type],
			name: this.name,
			assign: this.assign,
			value_expr: this.value_expr,
			terminator: this.terminator,
			children: this.children,
		};
	}
}
