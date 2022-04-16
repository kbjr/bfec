
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-16T07:11:34.211Z
*/


import { $BufferReader, $BufferWriter, $Root } from './utils';

export class $State {
	public stack: $StackFrame<any>[] = [ ];
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

	public step_down<$T>(name: string, node?: $T) {
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

export class $StackFrame<$T> {
	constructor(
		public name: string,
		public node?: $T
	) { }
}
