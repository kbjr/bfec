
import { Token, token_type } from './token';
import { SimpleTokenMatcher } from './matcher';

export class KeywordToken_struct extends Token {
	public type: token_type.kw_struct = token_type.kw_struct;
	public text: 'struct' = 'struct';
}

export class KeywordToken_switch extends Token {
	public type: token_type.kw_switch = token_type.kw_switch;
	public text: 'switch' = 'switch';
}

export class KeywordToken_enum extends Token {
	public type: token_type.kw_enum = token_type.kw_enum;
	public text: 'enum' = 'enum';
}

export class KeywordToken_bin extends Token {
	public type: token_type.kw_bin = token_type.kw_bin;
	public text: 'bin' = 'bin';
}

export class KeywordToken_$size extends Token {
	public type: token_type.kw_$size = token_type.kw_$size;
	public text: '$size' = '$size';
}

export class KeywordToken_case extends Token {
	public type: token_type.kw_case = token_type.kw_case;
	public text: 'case' = 'case';
}

export class KeywordToken_default extends Token {
	public type: token_type.kw_default = token_type.kw_default;
	public text: 'default' = 'default';
}

export class KeywordToken_$invalid extends Token {
	public type: token_type.kw_$invalid = token_type.kw_$invalid;
	public text: '$invalid' = '$invalid';
}

export class KeywordToken_from extends Token {
	public type: token_type.kw_from = token_type.kw_from;
	public text: 'from' = 'from';
}

export class KeywordToken_as extends Token {
	public type: token_type.kw_as = token_type.kw_as;
	public text: 'as' = 'as';
}

export const kw_struct   = new SimpleTokenMatcher(KeywordToken_struct, /\bstruct\b/y);
export const kw_switch   = new SimpleTokenMatcher(KeywordToken_switch, /\bswitch\b/y);
export const kw_enum     = new SimpleTokenMatcher(KeywordToken_enum, /\benum\b/y);
export const kw_bin      = new SimpleTokenMatcher(KeywordToken_bin, /\bbin\b/y);
export const kw_$size    = new SimpleTokenMatcher(KeywordToken_$size, /\$size\b/y);
export const kw_case     = new SimpleTokenMatcher(KeywordToken_case, /\bcase\b/y);
export const kw_default  = new SimpleTokenMatcher(KeywordToken_default, /\bdefault\b/y);
export const kw_$invalid = new SimpleTokenMatcher(KeywordToken_$invalid, /\$invalid\b/y);
export const kw_from     = new SimpleTokenMatcher(KeywordToken_from, /\bfrom\b/y);
export const kw_as       = new SimpleTokenMatcher(KeywordToken_as, /\bas\b/y);
