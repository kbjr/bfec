
import { Token } from './token';

export class TokenMatcher<T extends Token> {
	constructor(
		public readonly Type: new () => T,
		public readonly pattern: RegExp
	) { }

	public match() : T {
		// TODO: TokenMatcher.match()

		const match = '';
		
		if (false) {
			const token = new this.Type();
			token.line = 0;
			token.char = 0;
			token.offset = 0;
			token.length = match.length;
			token.text = match;
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

	public match() : T {
		// TODO: SimpleTokenMatcher.match()
		
		const match = '';
		
		if (false) {
			const token = new this.Type();
			token.line = 0;
			token.char = 0;
			token.offset = 0;
			token.length = match.length;
			return token;
		}

		return null;
	}
}
