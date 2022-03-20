
import { StructElem } from './struct';
import { ValueExpr } from './value-expr';
import { ASTNode, node_type } from './node';
import {
	NameToken_builtin_uint, NameToken_builtin_sint, NameToken_builtin_vint,
	NameToken_builtin_bin_float, NameToken_builtin_dec_float,
	NameToken_builtin_bit,
	NameToken_builtin_text,
	PuncToken_open_paren, PuncToken_close_paren,
	CommentToken,
	ConstToken_int, ConstToken_hex_int, ConstToken_ascii,
	PuncToken_open_square_bracket, PuncToken_close_square_bracket,
	PuncToken_arrow,
	PuncToken_close_brace, PuncToken_open_brace,
	NameToken_normal, NameToken_root_schema,
	PuncToken_separator,
	PuncToken_open_angle_bracket, PuncToken_close_angle_bracket, NameToken_builtin_len, NameToken_builtin_checksum, ConstToken_unicode, OpToken_expansion,
} from './tokens';

export type TypeExpr
	= ConstToken_int
	| ConstToken_hex_int
	| ConstToken_ascii
	| NameToken_builtin_uint
	| NameToken_builtin_sint
	| TypeExpr_builtin_vint
	| TypeExpr_builtin_len
	| NameToken_builtin_bin_float
	| NameToken_builtin_dec_float
	| NameToken_builtin_bit
	| TypeExpr_builtin_text
	| TypeExpr_builtin_checksum
	| TypeExpr_named
	| TypeExpr_array
	;

export type TypeExpr_int
	= ConstToken_int
	| ConstToken_hex_int
	| NameToken_builtin_uint
	| NameToken_builtin_sint
	| TypeExpr_builtin_vint
	| NameToken_builtin_bit
	;

export class TypeExpr_builtin_vint extends ASTNode {
	public type: node_type.type_expr_vint = node_type.type_expr_vint;
	public extraneous_comments: CommentToken[];
	public varint_keyword: NameToken_builtin_vint;
	public open_bracket: PuncToken_open_angle_bracket;
	public close_bracket: PuncToken_close_angle_bracket;
	public real_type: TypeExpr;

	public toJSON(): object {
		return {
			type: node_type[this.type],
			extraneous_comments: this.extraneous_comments,
			varint_keyword: this.varint_keyword,
			open_bracket: this.open_bracket,
			close_bracket: this.close_bracket,
			real_type: this.real_type,
		};
	}
}

export class TypeExpr_builtin_len extends ASTNode {
	public type: node_type.type_expr_len = node_type.type_expr_len;
	public extraneous_comments: CommentToken[];
	public len_keyword: NameToken_builtin_len;
	public open_bracket: PuncToken_open_angle_bracket;
	public close_bracket: PuncToken_close_angle_bracket;
	public real_type: TypeExpr;

	public toJSON(): object {
		return {
			type: node_type[this.type],
			extraneous_comments: this.extraneous_comments,
			len_keyword: this.len_keyword,
			open_bracket: this.open_bracket,
			close_bracket: this.close_bracket,
			real_type: this.real_type,
		};
	}
}

export class TypeExpr_array extends ASTNode {
	public type: node_type.type_expr_array = node_type.type_expr_array;
	public extraneous_comments: CommentToken[];
	public elem_type: TypeExpr;
	public open_bracket: PuncToken_open_square_bracket;
	public close_bracket: PuncToken_close_square_bracket;
	public length_type: TypeExpr | OpToken_expansion;

	public toJSON(): object {
		return {
			type: node_type[this.type],
			extraneous_comments: this.extraneous_comments,
			elem_type: this.elem_type,
			open_bracket: this.open_bracket,
			close_bracket: this.close_bracket,
			length_type: this.length_type,
		};
	}
}

export class TypeExpr_bin extends ASTNode {
	public type: node_type.type_expr_bin = node_type.type_expr_bin;
	public extraneous_comments: CommentToken[];
	public parent_type: TypeExpr;
	public arrow: PuncToken_arrow;
	public open_brace: PuncToken_open_brace;
	public close_brace: PuncToken_close_brace;
	public children: StructElem[];

	public toJSON(): object {
		return {
			type: node_type[this.type],
			extraneous_comments: this.extraneous_comments,
			parent_type: this.parent_type,
			arrow: this.arrow,
			open_brace: this.open_brace,
			close_brace: this.close_brace,
			children: this.children,
		};
	}
}

export class TypeExpr_named extends ASTNode {
	public type: node_type.type_expr_named = node_type.type_expr_named;
	public extraneous_comments: CommentToken[];
	public name: NameToken_normal | NameToken_root_schema;
	public params: TypeExprParamsList;

	public toJSON(): object {
		return {
			type: node_type[this.type],
			extraneous_comments: this.extraneous_comments,
			name: this.name,
			params: this.params,
		};
	}
}

export class TypeExprParamsList extends ASTNode {
	public type: node_type.type_expr_params_list = node_type.type_expr_params_list;
	public extraneous_comments: CommentToken[];
	public open_paren: PuncToken_open_paren;
	public close_paren: PuncToken_close_paren;
	public params: TypeExprParam[];

	public toJSON(): object {
		return {
			type: node_type[this.type],
			extraneous_comments: this.extraneous_comments,
			open_paren: this.open_paren,
			close_paren: this.close_paren,
			params: this.params,
		};
	}
}

export class TypeExprParam extends ASTNode {
	public type: node_type.type_expr_param = node_type.type_expr_param;
	public extraneous_comments: CommentToken[];
	public param: ValueExpr;
	public separator: PuncToken_separator;

	public toJSON(): object {
		return {
			type: node_type[this.type],
			extraneous_comments: this.extraneous_comments,
			param: this.param,
			separator: this.separator,
		};
	}
}

export class TypeExpr_builtin_text extends ASTNode {
	public type: node_type.type_expr_text = node_type.type_expr_text;
	public extraneous_comments: CommentToken[];
	public text_keyword: NameToken_builtin_text;
	public open_bracket: PuncToken_open_angle_bracket;
	public close_bracket: PuncToken_close_angle_bracket;
	public length_type: TypeExpr;

	public toJSON(): object {
		return {
			type: node_type[this.type],
			extraneous_comments: this.extraneous_comments,
			text_keyword: this.text_keyword,
			open_bracket: this.open_bracket,
			close_bracket: this.close_bracket,
			length_type: this.length_type,
		};
	}
}

export class TypeExpr_builtin_checksum extends ASTNode {
	public type: node_type.type_expr_checksum = node_type.type_expr_checksum;
	public extraneous_comments: CommentToken[];
	public checksum_keyword: NameToken_builtin_checksum;
	public open_bracket: PuncToken_open_angle_bracket;
	public close_bracket: PuncToken_close_angle_bracket;
	public real_type: TypeExpr;
	public open_paren: PuncToken_open_paren;
	public close_paren: PuncToken_close_paren;
	public data_expr: ValueExpr;
	public checksum_func: ConstToken_ascii | ConstToken_unicode;

	public toJSON(): object {
		return {
			type: node_type[this.type],
			extraneous_comments: this.extraneous_comments,
			checksum_keyword: this.checksum_keyword,
			open_bracket: this.open_bracket,
			close_bracket: this.close_bracket,
			real_type: this.real_type,
			checksum_func: this.checksum_func,
		};
	}
}
