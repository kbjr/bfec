
import { Ref } from './schema';
import { BaseNode, node_type } from './node';
import { TypeExpr } from './type-expr';

export class ValueExpr<T extends TypeExpr = TypeExpr> extends BaseNode {
	public type: node_type.value_expr = node_type.value_expr;
	public root_type: ValueExprRootType;
	public names: Ref[] = [ ];
	public value_type: T;
}

export enum ValueExprRootType {
	root_schema = 'root_schema',
	this_schema = 'this_schema',
	named       = 'named',
}
