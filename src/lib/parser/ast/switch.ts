
import { ASTNode, node_type } from './node';
import {
	CommentToken,
	KeywordToken_$invalid,
	KeywordToken_$void,
	KeywordToken_case,
	KeywordToken_default,
	NameToken_normal,
	PuncToken_close_brace,
	PuncToken_close_paren,
	PuncToken_colon,
	PuncToken_open_brace,
	PuncToken_open_paren,
	PuncToken_terminator
} from './tokens';
import { TypeExpr } from './type-expr';

export type SwitchElem = SwitchCase | SwitchDefault | CommentToken ;

export class DeclareSwitchNode extends ASTNode {
	public type: node_type.decl_switch = node_type.decl_switch;
	public comments: CommentToken[];
	public extraneous_comments: CommentToken[];
	public name: NameToken_normal;
	public param: SwitchParam;
	public open_brace: PuncToken_open_brace;
	public close_brace: PuncToken_close_brace;
	public children: SwitchElem[];
	public toJSON() {
		return {
			type: node_type[this.type],
			comments: this.comments,
			extraneous_comments: this.extraneous_comments,
			name: this.name,
			param: this.param,
			open_brace: this.open_brace,
			close_brace: this.close_brace,
			children: this.children
		};
	}
}

export class SwitchParam extends ASTNode {
	public type: node_type.switch_param = node_type.switch_param;
	public comments: CommentToken[];
	public extraneous_comments: CommentToken[];
	public open_paren: PuncToken_open_paren;
	public close_paren: PuncToken_close_paren;
	public name: NameToken_normal;
	public toJSON() {
		return {
			type: node_type[this.type],
			name: this.name,
			comments: this.comments,
			extraneous_comments: this.extraneous_comments,
			open_paren: this.open_paren,
			close_paren: this.close_paren,
		};
	}
}

export type SwitchSelection = KeywordToken_$invalid | KeywordToken_$void | TypeExpr ;

export class SwitchCase extends ASTNode {
	public type: node_type.switch_case = node_type.switch_case;
	public comments: CommentToken[];
	public extraneous_comments: CommentToken[];
	public case_keyword: KeywordToken_case;
	public condition_name: NameToken_normal;
	public colon: PuncToken_colon;
	public selection: SwitchSelection;
	public terminator: PuncToken_terminator;
	public toJSON(): object {
		return {
			type: node_type[this.type],
			comments: this.comments,
			extraneous_comments: this.extraneous_comments,
			case_keyword: this.case_keyword,
			condition_name: this.condition_name,
			colon: this.colon,
			selection: this.selection,
			terminator: this.terminator,
		};
	}
}

export class SwitchDefault extends ASTNode {
	public type: node_type.switch_default = node_type.switch_default;
	public comments: CommentToken[];
	public extraneous_comments: CommentToken[];
	public default_keyword: KeywordToken_default;
	public colon: PuncToken_colon;
	public selection: SwitchSelection;
	public terminator: PuncToken_terminator;
	public toJSON(): object {
		return {
			type: node_type[this.type],
			comments: this.comments,
			extraneous_comments: this.extraneous_comments,
			default_keyword: this.default_keyword,
			colon: this.colon,
			selection: this.selection,
			terminator: this.terminator,
		};
	}
}
