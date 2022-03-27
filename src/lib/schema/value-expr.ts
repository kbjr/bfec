
import { BaseNode, node_type } from './node';

export class ValueExpr extends BaseNode {
	public type: node_type.value_expr = node_type.value_expr;
}
