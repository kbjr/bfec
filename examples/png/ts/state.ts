
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-16T05:30:10.739Z
*/


import { $BufferReader, $BufferWriter, $Root, $encode, $decode } from './utils';

export class $State {
	public stack: string[];
	public read_from?: $BufferReader;
	public write_to?: $BufferWriter;

	constructor(
		public root: $Root
	) {
		this.step_down('$', root);
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
