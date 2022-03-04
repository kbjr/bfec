
import { Token } from './token';
import { ParserState } from '../state';

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
