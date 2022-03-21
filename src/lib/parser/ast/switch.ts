
import { ASTNode, node_type } from './node';
import {
	CommentToken,
	WhitespaceToken,
	KeywordToken_invalid,
	KeywordToken_void,
	KeywordToken_case,
	KeywordToken_default,
	NameToken_normal,
	PuncToken_close_angle_bracket,
	PuncToken_close_brace,
	PuncToken_colon,
	PuncToken_open_angle_bracket,
	PuncToken_open_brace,
	PuncToken_terminator,
} from './tokens';
import { TypeExpr } from './type-expr';

export type SwitchElem = SwitchCase | SwitchDefault | CommentToken ;

export class DeclareSwitchNode extends ASTNode {
	public type: node_type.decl_switch = node_type.decl_switch;
	public name: NameToken_normal;
	public param: SwitchParam;
	public body: SwitchBody;
	public children: (CommentToken | WhitespaceToken)[] = [ ];
	
	public toJSON() {
		return {
			type: node_type[this.type],
			name: this.name,
			param: this.param,
			body: this.body,
			children: this.children
		};
	}
}

export class SwitchBody extends ASTNode {
	public type: node_type.switch_body = node_type.switch_body;
	public name: NameToken_normal;
	public param: SwitchParam;
	public open_brace: PuncToken_open_brace;
	public close_brace: PuncToken_close_brace;
	public children: SwitchElem[] = [ ];
	
	public toJSON() {
		return {
			type: node_type[this.type],
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
	public open_bracket: PuncToken_open_angle_bracket;
	public close_bracket: PuncToken_close_angle_bracket;
	public name: NameToken_normal;
	public children: (CommentToken | WhitespaceToken)[] = [ ];
	
	public toJSON() {
		return {
			type: node_type[this.type],
			name: this.name,
			open_bracket: this.open_bracket,
			close_bracket: this.close_bracket,
			children: this.children,
		};
	}
}

export type SwitchSelection = KeywordToken_invalid | KeywordToken_void | TypeExpr ;

export class SwitchCase extends ASTNode {
	public type: node_type.switch_case = node_type.switch_case;
	public case_keyword: KeywordToken_case;
	public condition_name: NameToken_normal;
	public colon: PuncToken_colon;
	public selection: SwitchSelection;
	public terminator: PuncToken_terminator;
	public children: (CommentToken | WhitespaceToken)[] = [ ];

	public toJSON(): object {
		return {
			type: node_type[this.type],
			case_keyword: this.case_keyword,
			condition_name: this.condition_name,
			colon: this.colon,
			selection: this.selection,
			terminator: this.terminator,
			children: this.children,
		};
	}
}

export class SwitchDefault extends ASTNode {
	public type: node_type.switch_default = node_type.switch_default;
	public default_keyword: KeywordToken_default;
	public colon: PuncToken_colon;
	public selection: SwitchSelection;
	public terminator: PuncToken_terminator;
	public children: (CommentToken | WhitespaceToken)[] = [ ];
	
	public toJSON(): object {
		return {
			type: node_type[this.type],
			default_keyword: this.default_keyword,
			colon: this.colon,
			selection: this.selection,
			terminator: this.terminator,
			children: this.children,
		};
	}
}
