
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-19T07:40:18.194Z
*/


import { $BufferReader, $BufferWriter, $Root, $StructType, $SwitchType, $Struct } from './utils';

export class $State {
	public stack: $StackFrame[] = [ ];
	public read_from?: $BufferReader;
	public write_to?: $BufferWriter;

	public clone() {
		const $new_state = new $State();
		$new_state.stack = this.stack.slice();
		return $new_state;
	}

	public here() {
		return this.stack[this.stack.length - 1];
	}

	public step_down<$T extends $Struct>(name: string, node?: $T) {
		this.stack.push(
			new $StackFrame(name, node)
		);
	}

	public step_up() {
		this.stack.pop();
	}

	public fatal(message: string) : never {
		throw new Error(`Error at ${this.stack.join('.')}: ${message}`);
	}
}

export class $StackFrame<$T extends $Struct = $Struct> {
	constructor(
		public name: string,
		public node?: $T
	) { }
}
