
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
