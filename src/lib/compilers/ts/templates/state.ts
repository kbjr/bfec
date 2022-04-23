
import { import_utils } from './import';

export const state_template = () => `
${import_utils('state', '{ $BufferReader, $BufferWriter }')}

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

	public assert_u8_array_match<T>(actual: Uint8Array, expected: Uint8Array, successful?: T) : T | never {
		if (actual.length !== expected.length) {
			this.fatal('Expected to find constant value');
		}

		for (let i = 0; i < actual.length; i++) {
			if (actual[i] !== expected[i]) {
				this.fatal('Expected to find constant value');
			}
		}

		return successful;
	}

	public assert_match<E, T>(actual: E, expected: E, successful?: T) : T | never {
		if (actual !== expected) {
			this.fatal('Expected to find constant value');
		}

		return successful;
	}
}

export class $StackFrame<$T = any> {
	constructor(
		public name: string,
		public node?: $T
	) { }
}
`;
