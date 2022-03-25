
import { Token } from './token';
import { SimpleTokenMatcher } from './matcher';
import { node_type } from '../node';

export class KeywordToken_struct extends Token {
	public type: node_type.kw_struct = node_type.kw_struct;
	public text: 'struct' = 'struct';
}

export class KeywordToken_switch extends Token {
	public type: node_type.kw_switch = node_type.kw_switch;
	public text: 'switch' = 'switch';
}

export class KeywordToken_enum extends Token {
	public type: node_type.kw_enum = node_type.kw_enum;
	public text: 'enum' = 'enum';
}

export class KeywordToken_bin extends Token {
	public type: node_type.kw_bin = node_type.kw_bin;
	public text: 'bin' = 'bin';
}

export class KeywordToken_case extends Token {
	public type: node_type.kw_case = node_type.kw_case;
	public text: 'case' = 'case';
}

export class KeywordToken_default extends Token {
	public type: node_type.kw_default = node_type.kw_default;
	public text: 'default' = 'default';
}

export class KeywordToken_void extends Token {
	public type: node_type.kw_void = node_type.kw_void;
	public text: 'void' = 'void';
}

export class KeywordToken_null extends Token {
	public type: node_type.kw_null = node_type.kw_null;
	public text: 'null' = 'null';
}

export class KeywordToken_invalid extends Token {
	public type: node_type.kw_invalid = node_type.kw_invalid;
	public text: 'invalid' = 'invalid';
}

export class KeywordToken_from extends Token {
	public type: node_type.kw_from = node_type.kw_from;
	public text: 'from' = 'from';
}

export class KeywordToken_as extends Token {
	public type: node_type.kw_as = node_type.kw_as;
	public text: 'as' = 'as';
}

export const kw_struct   = new SimpleTokenMatcher(KeywordToken_struct, /\bstruct\b/y);
export const kw_switch   = new SimpleTokenMatcher(KeywordToken_switch, /\bswitch\b/y);
export const kw_enum     = new SimpleTokenMatcher(KeywordToken_enum, /\benum\b/y);
export const kw_bin      = new SimpleTokenMatcher(KeywordToken_bin, /\bbin\b/y);
export const kw_case     = new SimpleTokenMatcher(KeywordToken_case, /\bcase\b/y);
export const kw_default  = new SimpleTokenMatcher(KeywordToken_default, /\bdefault\b/y);
export const kw_void     = new SimpleTokenMatcher(KeywordToken_void, /\bvoid\b/y);
export const kw_null     = new SimpleTokenMatcher(KeywordToken_null, /\bnull\b/y);
export const kw_invalid  = new SimpleTokenMatcher(KeywordToken_invalid, /\binvalid\b/y);
export const kw_from     = new SimpleTokenMatcher(KeywordToken_from, /\bfrom\b/y);
export const kw_as       = new SimpleTokenMatcher(KeywordToken_as, /\bas\b/y);
