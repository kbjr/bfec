
import { ConstExpr, ValueExpr } from './value-expr';
import { ASTNode, node_type } from './node';
import {
	Ignored,
	OpToken_not,
	OpToken_and, OpToken_or, OpToken_xor,
	OpToken_equal, OpToken_not_equal,
	PuncToken_open_paren, PuncToken_close_paren
} from './tokens';

export type BoolExpr
	= BoolExpr_eq
	| BoolExpr_neq
	| BoolExpr_and
	| BoolExpr_or
	| BoolExpr_xor
	| BoolExpr_not
	;

export class BoolExpr_eq extends ASTNode {
	public type: node_type.bool_expr_eq = node_type.bool_expr_eq;
	public lh_expr: ValueExpr | ConstExpr;
	public rh_expr: ValueExpr | ConstExpr;
	public operator: OpToken_equal;
	public open_paren: PuncToken_open_paren;
	public close_paren: PuncToken_close_paren;
	public children: Ignored[] = [ ];
	
	public toJSON() {
		return {
			type: node_type[this.type],
			lh_expr: this.lh_expr,
			rh_expr: this.rh_expr,
			operator: this.operator,
			open_paren: this.open_paren,
			close_paren: this.close_paren,
			children: this.children,
		};
	}

	public pos() : [ line: number, char: number ] {
		return this.lh_expr.pos();
	}
}

export class BoolExpr_neq extends ASTNode {
	public type: node_type.bool_expr_neq = node_type.bool_expr_neq;
	public lh_expr: ValueExpr | ConstExpr;
	public rh_expr: ValueExpr | ConstExpr;
	public operator: OpToken_not_equal;
	public open_paren: PuncToken_open_paren;
	public close_paren: PuncToken_close_paren;
	public children: Ignored[] = [ ];
	
	public toJSON() {
		return {
			type: node_type[this.type],
			lh_expr: this.lh_expr,
			rh_expr: this.rh_expr,
			operator: this.operator,
			open_paren: this.open_paren,
			close_paren: this.close_paren,
			children: this.children,
		};
	}

	public pos() : [ line: number, char: number ] {
		return this.lh_expr.pos();
	}
}

export class BoolExpr_and extends ASTNode {
	public type: node_type.bool_expr_and = node_type.bool_expr_and;
	public lh_expr: BoolExpr;
	public rh_expr: BoolExpr;
	public operator: OpToken_and;
	public open_paren: PuncToken_open_paren;
	public close_paren: PuncToken_close_paren;
	public children: Ignored[] = [ ];
	
	public toJSON() {
		return {
			type: node_type[this.type],
			lh_expr: this.lh_expr,
			rh_expr: this.rh_expr,
			operator: this.operator,
			open_paren: this.open_paren,
			close_paren: this.close_paren,
			children: this.children,
		};
	}

	public pos() : [ line: number, char: number ] {
		return this.lh_expr.pos();
	}
}

export class BoolExpr_or extends ASTNode {
	public type: node_type.bool_expr_or = node_type.bool_expr_or;
	public lh_expr: BoolExpr;
	public rh_expr: BoolExpr;
	public operator: OpToken_or;
	public open_paren: PuncToken_open_paren;
	public close_paren: PuncToken_close_paren;
	public children: Ignored[] = [ ];
	
	public toJSON() {
		return {
			type: node_type[this.type],
			lh_expr: this.lh_expr,
			rh_expr: this.rh_expr,
			operator: this.operator,
			open_paren: this.open_paren,
			close_paren: this.close_paren,
			children: this.children,
		};
	}

	public pos() : [ line: number, char: number ] {
		return this.lh_expr.pos();
	}
}

export class BoolExpr_xor extends ASTNode {
	public type: node_type.bool_expr_xor = node_type.bool_expr_xor;
	public lh_expr: BoolExpr;
	public rh_expr: BoolExpr;
	public operator: OpToken_xor;
	public open_paren: PuncToken_open_paren;
	public close_paren: PuncToken_close_paren;
	public children: Ignored[] = [ ];
	
	public toJSON() {
		return {
			type: node_type[this.type],
			lh_expr: this.lh_expr,
			rh_expr: this.rh_expr,
			operator: this.operator,
			open_paren: this.open_paren,
			close_paren: this.close_paren,
			children: this.children,
		};
	}

	public pos() : [ line: number, char: number ] {
		return this.lh_expr.pos();
	}
}

export class BoolExpr_not extends ASTNode {
	public type: node_type.bool_expr_not = node_type.bool_expr_not;
	public expr: BoolExpr;
	public operator: OpToken_not;
	public open_paren: PuncToken_open_paren;
	public close_paren: PuncToken_close_paren;
	public children: Ignored[] = [ ];
	
	public toJSON() {
		return {
			type: node_type[this.type],
			lh_expr: this.expr,
			operator: this.operator,
			open_paren: this.open_paren,
			close_paren: this.close_paren,
			children: this.children,
		};
	}

	public pos() : [ line: number, char: number ] {
		return this.operator.pos();
	}
}
