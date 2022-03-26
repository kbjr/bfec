
import { BoolExpr } from './bool-expr';
import { ASTNode, node_type } from './node';
import {
	CommentToken,
	NameToken_normal,
	NameToken_root_schema,
	PuncToken_close_brace,
	PuncToken_close_paren,
	PuncToken_colon,
	PuncToken_open_brace,
	PuncToken_open_paren,
	PuncToken_terminator,
	OpToken_expansion,
	PuncToken_separator,
	PuncToken_assign,
	Ignored,
	PuncToken_condition,
	KeywordToken_struct,
	KeywordToken_bin
} from './tokens';
import { TypeExpr } from './type-expr';
import { ValueExpr } from './value-expr';

export class DeclareStructNode extends ASTNode {
	public type: node_type.decl_struct = node_type.decl_struct;
	public struct_keyword: KeywordToken_struct | KeywordToken_bin;
	public name: NameToken_normal | NameToken_root_schema;
	public params: StructParamsListNode;
	public body: StructBody;
	public children: Ignored[] = [ ];

	public toJSON() {
		return {
			type: node_type[this.type],
			name: this.name,
			params: this.params,
			body: this.body,
			children: this.children,
		};
	}
}

export class StructBody extends ASTNode {
	public type: node_type.struct_body = node_type.struct_body;
	public open_brace: PuncToken_open_brace;
	public close_brace: PuncToken_close_brace;
	public children: StructElem[] = [ ];

	public toJSON() {
		return {
			type: node_type[this.type],
			open_brace: this.open_brace,
			close_brace: this.close_brace,
			children: this.children
		};
	}
}

export class StructParamsListNode extends ASTNode {
	public type: node_type.struct_params_list = node_type.struct_params_list;
	public open_paren: PuncToken_open_paren;
	public close_paren: PuncToken_close_paren;
	public params: StructParamNode[] = [ ];
	public children: Ignored[] = [ ];

	public toJSON() {
		return {
			type: node_type[this.type],
			open_paren: this.open_paren,
			close_paren: this.close_paren,
			params: this.params,
			children: this.children,
		};
	}
}

export class StructParamNode extends ASTNode {
	public type: node_type.struct_param = node_type.struct_param;
	public name: NameToken_normal;
	public punc_colon: PuncToken_colon;
	public param_type: TypeExpr;
	public separator: PuncToken_separator;
	
	public toJSON() {
		return {
			type: node_type[this.type],
			name: this.name,
			punc_colon: this.punc_colon,
			param_type: this.param_type,
			separator: this.separator,
		};
	}
}

export type StructElem = StructExpansion | StructField | CommentToken ;

export class StructExpansion extends ASTNode {
	public type: node_type.struct_expansion = node_type.struct_expansion;
	public expansion_op: OpToken_expansion;
	public expanded_type: TypeExpr;
	public terminator: PuncToken_terminator;
	public children: Ignored[] = [ ];

	public toJSON(): object {
		return {
			type: node_type[this.type],
			expansion_op: this.expansion_op,
			expanded_type: this.expanded_type,
			terminator: this.terminator,
			children: this.children,
		};
	}
}

export class StructField extends ASTNode {
	public type: node_type.struct_field = node_type.struct_field;
	public field_name: NameToken_normal;
	public optional_condition: StructFieldOptionalCondition;
	public field_type_colon: PuncToken_colon;
	public field_type: TypeExpr;
	public optional_assign: PuncToken_assign;
	public optional_value: ValueExpr;
	public terminator: PuncToken_terminator;
	public children: Ignored[] = [ ];

	public toJSON(): object {
		return {
			type: node_type[this.type],
			field_name: this.field_name,
			optional_condition: this.optional_condition,
			field_type_colon: this.field_type_colon,
			field_type: this.field_type,
			optional_assign: this.optional_assign,
			optional_value: this.optional_value,
			terminator: this.terminator,
			children: this.children
		};
	}
}

export class StructFieldOptionalCondition extends ASTNode {
	public type: node_type.struct_field_optional_condition = node_type.struct_field_optional_condition;
	public question: PuncToken_condition;
	public open_paren: PuncToken_open_paren;
	public close_paren: PuncToken_close_paren;
	public condition: BoolExpr;
	public children: Ignored[] = [ ];

	public toJSON(): object {
		return {
			type: node_type[this.type],
			question: this.question,
			open_paren: this.open_paren,
			close_paren: this.close_paren,
			condition: this.condition,
			children: this.children,
		};
	}
}
