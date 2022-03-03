
import { Token, token_type } from './token';
import { SimpleTokenMatcher } from './matcher';

export class OpToken_equal extends Token {
	public type: token_type.op_equal = token_type.op_equal;
	public text: '==' = '==';
}

export class OpToken_not_equal extends Token {
	public type: token_type.op_not_equal = token_type.op_not_equal;
	public text: '!=' = '!=';
}

export class OpToken_and extends Token {
	public type: token_type.op_and = token_type.op_and;
	public text: '&' = '&';
}

export class OpToken_or extends Token {
	public type: token_type.op_or = token_type.op_or;
	public text: '|' = '|';
}

export class OpToken_xor extends Token {
	public type: token_type.op_xor = token_type.op_xor;
	public text: '^' = '^';
}

export class OpToken_not extends Token {
	public type: token_type.op_not = token_type.op_not;
	public text: '!' = '!';
}

export class OpToken_expansion extends Token {
	public type: token_type.op_expansion = token_type.op_expansion;
	public text: '...' = '...';
}

export const op_equal     = new SimpleTokenMatcher(OpToken_equal, /==/y);
export const op_not_equal = new SimpleTokenMatcher(OpToken_not_equal, /!=/y);
export const op_and       = new SimpleTokenMatcher(OpToken_and, /&/y);
export const op_or        = new SimpleTokenMatcher(OpToken_or, /\|/y);
export const op_xor       = new SimpleTokenMatcher(OpToken_xor, /\^/y);
export const op_not       = new SimpleTokenMatcher(OpToken_not, /!/y);
export const op_expansion = new SimpleTokenMatcher(OpToken_expansion, /\.\.\./y);