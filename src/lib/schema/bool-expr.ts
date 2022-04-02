
import { ConstExpr } from './const';
import { ValueExpr } from './value-expr';
import { BaseNode, node_type } from './node';

export type BoolExpr
	= BoolExpr_logical
	| BoolExpr_comparison
	;

export class BoolExpr_logical extends BaseNode {
	public type: node_type.bool_expr_logical = node_type.bool_expr_logical;
	public operator: BoolExprLogicalOperator;
	public lh_expr: BoolExpr;
	public rh_expr?: BoolExpr;
}

export enum BoolExprLogicalOperator {
	and = 'and',
	or  = 'or',
	xor = 'xor',
	not = 'not',
}

export class BoolExpr_comparison extends BaseNode {
	public type: node_type.bool_expr_comparison = node_type.bool_expr_comparison;
	public operator: BoolExprComparisonOperator;
	public lh_expr: ValueExpr | ConstExpr;
	public rh_expr: ValueExpr | ConstExpr;
}

export enum BoolExprComparisonOperator {
	eq  = 'eq',
	neq = 'neq',
}
