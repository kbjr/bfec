
import { Token } from './token';
import { FencedTokenMatcher, TokenMatcher } from './matcher';
import { node_type } from '../node';

export type Ignored = WhitespaceToken | CommentToken ;

export class WhitespaceToken extends Token {
	public type: node_type.whitespace = node_type.whitespace;
}

export type CommentToken = LineCommentToken | BlockCommentToken ;

export class LineCommentToken extends Token {
	public type: node_type.comment_line = node_type.comment_line;
}

export class BlockCommentToken extends Token {
	public type: node_type.comment_block = node_type.comment_block;
}

export const meta_newline = /(?:\r\n|\r|\n|\u202b|\u2029)/g;
export const meta_whitespace = new TokenMatcher(WhitespaceToken, /[\u0009|\u000b|\u000c|\u0020|\u00a0|\ufeff|\u1680|\u2000|\u2001|\u2002|\u2003|\u2004|\u2005|\u2006|\u2007|\u2008|\u2009|\u200a|\u202f|\u205f|\u3000]+/y, 'whitespace');
export const meta_line_comment = new TokenMatcher(LineCommentToken, /#.*/y);
export const meta_block_comment = new FencedTokenMatcher(BlockCommentToken, /#--/y, /#--/g);
