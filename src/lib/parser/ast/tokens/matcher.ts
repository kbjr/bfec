
import { Token } from './token';
import { ParserState } from '../../state';

export class TokenMatcher<T extends Token> {
	constructor(
		public readonly Type: new () => T,
		public readonly pattern: RegExp
	) { }

	public match(state: ParserState) : T {
		state.trace('match', this.pattern);

		if (! advance_state_to_next_non_empty_line(state)) {
			return null;
		}

		this.pattern.lastIndex = state.char;
		
		const line = state.lines[state.line];
		const match = this.pattern.exec(line);
		
		if (match) {
			const token = new this.Type();
			token.line = state.line;
			token.char = state.char;

			token.length = match[0].length;
			state.char += match[0].length;
			
			token.text = match[0];
			
			return token;
		}

		return null;
	}
}

export class SimpleTokenMatcher<T extends Token> {
	constructor(
		public readonly Type: new () => T,
		public readonly pattern: RegExp
	) { }

	public match(state: ParserState) : T {
		state.trace('match', this.pattern);

		if (! advance_state_to_next_non_empty_line(state)) {
			return null;
		}
		
		this.pattern.lastIndex = state.char;
		
		const line = state.lines[state.line];
		const match = this.pattern.exec(line);
		
		if (match) {
			const token = new this.Type();
			token.line = state.line;
			token.char = state.char;

			token.length = match[0].length;
			state.char += match[0].length;
			
			return token;
		}

		return null;
	}
}

export class FencedTokenMatcher<T extends Token> {
	constructor(
		public readonly Type: new () => T,
		public readonly open_pattern: RegExp,
		public readonly close_pattern: RegExp
	) { }

	public match(state: ParserState) : T {
		state.trace('match', this.open_pattern, this.close_pattern);

		if (! advance_state_to_next_non_empty_line(state)) {
			return null;
		}
		
		this.open_pattern.lastIndex = state.char;
		
		let line = state.lines[state.line];
		let match = this.open_pattern.exec(line);
		let done = false;
		
		if (match) {
			const token = new this.Type();
			token.line = state.line;
			token.char = state.char;
			token.text = match[0];
			state.char += match[0].length;

			this.close_pattern.lastIndex = state.char;

			while (state.line < state.lines.length) {
				match = this.close_pattern.exec(line);
				
				if (match) {
					console.log('close', match[0], state.line, state.char);
					const offset = line.indexOf(match[0], state.char);
					const substr = line.slice(state.char, offset) + match[0];

					if (state.line !== token.line) {
						token.text += '\n';
					}

					token.text += substr;
					token.length = token.text.length;
					state.char = offset + match[0].length;

					done = true;
					break;
				}

				token.text += '\n' + line;
				state.line++;
				state.char = 0;
				this.close_pattern.lastIndex = 0;
				line = state.lines[state.line];
			}

			if (! done) {
				state.fatal('unexpected end of input');
			}
			
			return token;
		}

		return null;
	}
}

function advance_state_to_next_non_empty_line(state: ParserState) {
	if (state.line >= state.lines.length) {
		return false;
	}

	while (state.char >= state.lines[state.line].length) {
		state.line++;
		state.char = 0;

		if (! state.lines[state.line]) {
			return false;
		}
	}

	return true;
}
