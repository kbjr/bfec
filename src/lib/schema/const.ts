
import { BaseNode, node_type } from './node';

export class ConstInt extends BaseNode {
	public type: node_type.const_int = node_type.const_int;
	public value: number;
	public toJSON() {
		return this.value;
	}
}

export class ConstString extends BaseNode {
	public type: node_type.const_string = node_type.const_string;
	public value: string;
	public unicode: boolean;
	public toJSON() {
		return this.value;
	}
}
