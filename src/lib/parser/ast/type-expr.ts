
import { ValueExpr } from './value-expr';
import { ASTNode, node_type } from './node';
import {
	NameToken_builtin_uint, NameToken_builtin_sint, NameToken_builtin_vint,
	NameToken_builtin_bin_float, NameToken_builtin_dec_float,
	NameToken_builtin_bit,
	NameToken_builtin_text,
	NameToken_normal, NameToken_root_schema,
	NameToken_builtin_len,
	NameToken_builtin_checksum,
	CommentToken, WhitespaceToken,
	KeywordToken_bin, KeywordToken_struct, KeywordToken_switch,
	ConstToken_int, ConstToken_hex_int, ConstToken_ascii, ConstToken_unicode,
	PuncToken_open_paren, PuncToken_close_paren,
	PuncToken_open_square_bracket, PuncToken_close_square_bracket,
	PuncToken_open_angle_bracket, PuncToken_close_angle_bracket,
	PuncToken_arrow,
	PuncToken_separator,
	OpToken_expansion,
	Ignored,
	KeywordToken_null,
} from './tokens';
import { StructBody } from './struct';
import { SwitchBody } from './switch';

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
	| TypeExpr_named_refinement
	| TypeExpr_struct_refinement
	| TypeExpr_switch_refinement
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
	public varint_keyword: NameToken_builtin_vint;
	public open_bracket: PuncToken_open_angle_bracket;
	public close_bracket: PuncToken_close_angle_bracket;
	public real_type: TypeExpr;
	public children: Ignored[] = [ ];

	public toJSON(): object {
		return {
			type: node_type[this.type],
			varint_keyword: this.varint_keyword,
			open_bracket: this.open_bracket,
			close_bracket: this.close_bracket,
			real_type: this.real_type,
			children: this.children,
		};
	}
}

export class TypeExpr_builtin_len extends ASTNode {
	public type: node_type.type_expr_len = node_type.type_expr_len;
	public len_keyword: NameToken_builtin_len;
	public open_bracket: PuncToken_open_angle_bracket;
	public close_bracket: PuncToken_close_angle_bracket;
	public real_type: TypeExpr;
	public children: Ignored[] = [ ];

	public toJSON(): object {
		return {
			type: node_type[this.type],
			len_keyword: this.len_keyword,
			open_bracket: this.open_bracket,
			close_bracket: this.close_bracket,
			real_type: this.real_type,
			children: this.children,
		};
	}
}

export class TypeExpr_array extends ASTNode {
	public type: node_type.type_expr_array = node_type.type_expr_array;
	public elem_type: TypeExpr;
	public open_bracket: PuncToken_open_square_bracket;
	public close_bracket: PuncToken_close_square_bracket;
	public length_type: TypeExpr | OpToken_expansion | ValueExpr | KeywordToken_null;
	public children: Ignored[] = [ ];

	public toJSON(): object {
		return {
			type: node_type[this.type],
			elem_type: this.elem_type,
			open_bracket: this.open_bracket,
			close_bracket: this.close_bracket,
			length_type: this.length_type,
			children: this.children,
		};
	}
}

export class TypeExpr_struct_refinement extends ASTNode {
	public type: node_type.type_expr_struct_refinement = node_type.type_expr_struct_refinement;
	public parent_type: TypeExpr;
	public arrow: PuncToken_arrow;
	public struct_keyword: KeywordToken_bin | KeywordToken_struct;
	public body: StructBody;
	public children: Ignored[] = [ ];

	public toJSON(): object {
		return {
			type: node_type[this.type],
			parent_type: this.parent_type,
			arrow: this.arrow,
			struct_keyword: this.struct_keyword,
			body: this.body,
			children: this.children,
		};
	}
}

export class TypeExpr_switch_refinement extends ASTNode {
	public type: node_type.type_expr_struct_refinement = node_type.type_expr_struct_refinement;
	public parent_type: TypeExpr;
	public arrow: PuncToken_arrow;
	public switch_keyword: KeywordToken_switch;
	public open_bracket: PuncToken_open_angle_bracket;
	public close_bracket: PuncToken_close_angle_bracket;
	public value_type: TypeExpr;
	public open_paren: PuncToken_open_paren;
	public close_paren: PuncToken_close_paren;
	public value_expr: ValueExpr;
	public body: SwitchBody;
	public children: Ignored[] = [ ];

	public toJSON(): object {
		return {
			type: node_type[this.type],
			parent_type: this.parent_type,
			arrow: this.arrow,
			switch_keyword: this.switch_keyword,
			open_bracket: this.open_bracket,
			close_bracket: this.close_bracket,
			value_type: this.value_type,
			open_paren: this.open_paren,
			close_paren: this.close_paren,
			value_expr: this.value_expr,
			body: this.body,
			children: this.children,
		};
	}
}

export class TypeExpr_named_refinement extends ASTNode {
	public type: node_type.type_expr_struct_refinement = node_type.type_expr_struct_refinement;
	public parent_type: TypeExpr;
	public arrow: PuncToken_arrow;
	public refined_type: TypeExpr;
	public children: Ignored[] = [ ];

	public toJSON(): object {
		return {
			type: node_type[this.type],
			parent_type: this.parent_type,
			arrow: this.arrow,
			refined_type: this.refined_type,
			children: this.children,
		};
	}
}

export class TypeExpr_named extends ASTNode {
	public type: node_type.type_expr_named = node_type.type_expr_named;
	public name: NameToken_normal | NameToken_root_schema;
	public params: TypeExprParamsList;
	public children: Ignored[] = [ ];

	public toJSON(): object {
		return {
			type: node_type[this.type],
			name: this.name,
			params: this.params,
			children: this.children,
		};
	}
}

export class TypeExprParamsList extends ASTNode {
	public type: node_type.type_expr_params_list = node_type.type_expr_params_list;
	public open_paren: PuncToken_open_paren;
	public close_paren: PuncToken_close_paren;
	public params: TypeExprParam[] = [ ];
	public children: Ignored[] = [ ];

	public toJSON(): object {
		return {
			type: node_type[this.type],
			open_paren: this.open_paren,
			close_paren: this.close_paren,
			params: this.params,
			children: this.children,
		};
	}
}

export class TypeExprParam extends ASTNode {
	public type: node_type.type_expr_param = node_type.type_expr_param;
	public param: ValueExpr;
	public separator: PuncToken_separator;

	public toJSON(): object {
		return {
			type: node_type[this.type],
			param: this.param,
			separator: this.separator,
		};
	}
}

export class TypeExpr_builtin_text extends ASTNode {
	public type: node_type.type_expr_text = node_type.type_expr_text;
	public text_keyword: NameToken_builtin_text;
	public open_bracket: PuncToken_open_angle_bracket;
	public close_bracket: PuncToken_close_angle_bracket;
	public length_type: TypeExpr | OpToken_expansion | KeywordToken_null;
	public children: Ignored[] = [ ];

	public toJSON(): object {
		return {
			type: node_type[this.type],
			text_keyword: this.text_keyword,
			open_bracket: this.open_bracket,
			close_bracket: this.close_bracket,
			length_type: this.length_type,
			children: this.children,
		};
	}
}

export class TypeExpr_builtin_checksum extends ASTNode {
	public type: node_type.type_expr_checksum = node_type.type_expr_checksum;
	public checksum_keyword: NameToken_builtin_checksum;
	public open_bracket: PuncToken_open_angle_bracket;
	public close_bracket: PuncToken_close_angle_bracket;
	public real_type: TypeExpr;
	public open_paren: PuncToken_open_paren;
	public close_paren: PuncToken_close_paren;
	public data_expr: ValueExpr;
	public param_separator: PuncToken_separator;
	public checksum_func: ConstToken_ascii | ConstToken_unicode;
	public children: Ignored[] = [ ];

	public toJSON(): object {
		return {
			type: node_type[this.type],
			children: this.children,
			checksum_keyword: this.checksum_keyword,
			open_bracket: this.open_bracket,
			close_bracket: this.close_bracket,
			real_type: this.real_type,
			param_separator: this.param_separator,
			checksum_func: this.checksum_func,
		};
	}
}
