
import { import_utils } from './import';

export const state_template = () => `
${import_utils('state', '{ $BufferReader, $BufferWriter, $Root, $encode, $decode }')}

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
		throw new Error(\`Error at \${this.stack.join('.')}: \${message}\`);
	}
}

export class $StackFrame<$T> {
	constructor(
		public name: string,
		public node?: $T
	) { }
}
`;
