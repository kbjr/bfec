
import { Token } from './token';
import { TokenMatcher } from './matcher';
import { node_type } from '../node';

export class ConstToken_ascii extends Token {
	public type: node_type.const_ascii = node_type.const_ascii;
	public text: `"${string}"`;
}

export class ConstToken_unicode extends Token {
	public type: node_type.const_unicode = node_type.const_unicode;
	public text: `'${string}'`;
}

export class ConstToken_int extends Token {
	public type: node_type.const_int = node_type.const_int;
}

export class ConstToken_hex_int extends Token {
	public type: node_type.const_hex_int = node_type.const_hex_int;
}

export const const_ascii   = new TokenMatcher(ConstToken_ascii, /"(?:[^"\\]|\\[nrtb0"]|\\x[0-9a-fA-F]{2})*"/y);
export const const_unicode = new TokenMatcher(ConstToken_unicode, /'(?:[^'\\]|\\[nrtb0']|\\x[0-9a-fA-F]{2}|\\u\{[0-9a-fA-F]{2,5}\})*'/y);
export const const_int     = new TokenMatcher(ConstToken_int, /(?:-?0|[1-9][0-9]*)/y);
export const const_hex_int = new TokenMatcher(ConstToken_hex_int, /(?:0x[0-9a-fA-F_]+)/y);
