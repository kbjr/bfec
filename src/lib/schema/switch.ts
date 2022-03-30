import { BaseNode, node_type } from './node';
import { TypeExpr } from './type-expr';
import { Comment, Ref } from './schema';


export class Switch extends BaseNode {
	public type: node_type.switch = node_type.switch;
	public comments: Comment[];
	public name: Ref;
	public arg_type: TypeExpr;
	public cases: SwitchCase[] = [ ];
	public default: SwitchCase;
}

export class SwitchCase extends BaseNode {
	public type: node_type.switch_case = node_type.switch_case;
	public comments: Comment[];
	public case_value?: Ref;
	public case_type: SwitchCaseType;
	public case_type_expr?: TypeExpr;
}

export enum SwitchCaseType {
	type_expr = 'type_expr',
	void = 'void',
	invalid = 'invalid'
}
