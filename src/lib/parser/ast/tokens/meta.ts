
import { Token } from './token';
import { TokenMatcher } from './matcher';
import { node_type } from '../node';

export class WhitespaceToken extends Token {
	public type: node_type.meta_whitespace = node_type.meta_whitespace;
}

export class CommentToken extends Token {
	public type: node_type.meta_line_comment = node_type.meta_line_comment;
}

export const meta_newline = /(?:\r\n|\r|\n|\u202b|\u2029)+/g;
export const meta_whitespace = new TokenMatcher(WhitespaceToken, /[\u0009|\u000b|\u000c|\u0020|\u00a0|\ufeff|\u1680|\u2000|\u2001|\u2002|\u2003|\u2004|\u2005|\u2006|\u2007|\u2008|\u2009|\u200a|\u202f|\u205f|\u3000]+/y);
export const meta_line_comment = new TokenMatcher(CommentToken, /#.*/y);
