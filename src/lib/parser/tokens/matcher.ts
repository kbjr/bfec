
import { Token, token_type } from './token';

export class TokenMatcher<T extends token_type, Token2 extends Token & { type: T }> {
	constructor(
		public readonly type: T,
		public readonly pattern: RegExp
	) { }

	public match() : Token2 {
		// TODO: TokenMatcher.match()
		return null;
	}
}

export class SimpleTokenMatcher<T extends Token> {
	constructor(
		public readonly Type: new () => T,
		public readonly pattern: RegExp
	) { }

	public match() : T {
		// TODO: TokenMatcher.match()
		if (false) {
			const token = new this.Type();
			token.line = 0;
			token.char = 0;
			token.offset = 0;
			token.length = 0;
			return token;
		}
		
		return null;
	}
}
