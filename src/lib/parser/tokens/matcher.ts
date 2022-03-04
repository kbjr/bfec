
import { Token } from './token';
import { ParserState } from '../state';

export class TokenMatcher<T extends Token> {
	constructor(
		public readonly Type: new () => T,
		public readonly pattern: RegExp
	) { }

	public match(state: ParserState) : T {
		if (state.line >= state.lines.length) {
			return null;
		}

		const line = state.lines[state.line];

		if (state.char >= line.length) {
			state.line++;
			state.char = 0;
		}
		
		this.pattern.lastIndex = state.char;
		const match = this.pattern.exec(line);
		
		if (match) {
			const token = new this.Type();
			token.line = state.line;
			token.char = state.char;

			token.length = match.length;
			state.char += match.length;
			
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
		if (state.line >= state.lines.length) {
			return null;
		}

		const line = state.lines[state.line];

		if (state.char >= line.length) {
			state.line++;
			state.char = 0;
		}
		
		this.pattern.lastIndex = state.char;
		const match = this.pattern.exec(line);
		
		if (match) {
			const token = new this.Type();
			token.line = state.line;
			token.char = state.char;

			token.length = match.length;
			state.char += match.length;
			
			return token;
		}

		return null;
	}
}
