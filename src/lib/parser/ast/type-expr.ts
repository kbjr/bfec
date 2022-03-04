
import { ASTNode, node_type } from './node';
import {
	NameToken_builtin_uint, NameToken_builtin_sint, NameToken_builtin_vint,
	NameToken_builtin_bin_float, NameToken_builtin_dec_float,
	NameToken_builtin_bit,
	NameToken_builtin_text,
	PuncToken_open_paren, PuncToken_close_paren, CommentToken,
} from './tokens';

export type TypeExpr
	= NameToken_builtin_uint
	| NameToken_builtin_sint
	| TypeExpr_builtin_vint
	| NameToken_builtin_bin_float
	| NameToken_builtin_dec_float
	| NameToken_builtin_bit
	| NameToken_builtin_text
	;

export class TypeExpr_builtin_vint extends ASTNode {
	public type: node_type.type_expr_vint = node_type.type_expr_vint;
	public extraneous_comments: CommentToken[];
	public varint_keyword: NameToken_builtin_vint;
	public open_paren: PuncToken_open_paren;
	public close_paren: PuncToken_close_paren;
	public real_type: TypeExpr;

	public toJSON(): object {
		return {
			type: node_type[this.type],
			extraneous_comments: this.extraneous_comments,
			varint_keyword: this.varint_keyword,
			open_paren: this.open_paren,
			close_paren: this.close_paren,
			real_type: this.real_type,
		};
	}
}
