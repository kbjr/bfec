
import { Const } from './const';
import { NamedRef } from './ref';
import { SchemaNode } from './node';

export class BoolExpr extends SchemaNode {
	public type = 'bool_expr';
}

export class BoolExpr_logical extends BoolExpr {
	public operator: bool_expr_op_logical;
	public lh_expr: BoolExpr;
	public rh_expr?: BoolExpr;
}

export enum bool_expr_op_logical {
	and = 'and',
	or  = 'or',
	xor = 'xor',
	not = 'not',
}

export class BoolExpr_comparison extends BoolExpr {
	public operator: bool_expr_op_compare;
	public lh_expr: NamedRef | Const;
	public rh_expr: NamedRef | Const;
}

export enum bool_expr_op_compare {
	eq  = 'eq',
	neq = 'neq',
}

export function is_bool_expr_logical(node: SchemaNode) : node is BoolExpr_logical {
	return node instanceof BoolExpr_logical;
}

export function is_bool_expr_comparison(node: SchemaNode) : node is BoolExpr_comparison {
	return node instanceof BoolExpr_comparison;
}
