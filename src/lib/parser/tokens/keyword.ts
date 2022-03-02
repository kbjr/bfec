
import { TokenMatcher } from './matcher';
import { Token, token_type } from './token';

export const kw_struct   = new TokenMatcher<token_type.kw_struct, KeywordToken_struct>(token_type.kw_struct, /\bstruct\b/y);
export const kw_switch   = new TokenMatcher<token_type.kw_switch, KeywordToken_switch>(token_type.kw_switch, /\bswitch\b/y);
export const kw_enum     = new TokenMatcher<token_type.kw_enum, KeywordToken_enum>(token_type.kw_enum, /\benum\b/y);
export const kw_bin      = new TokenMatcher<token_type.kw_bin, KeywordToken_bin>(token_type.kw_bin, /\bbin\b/y);
export const kw_$size    = new TokenMatcher<token_type.kw_$size, KeywordToken_$size>(token_type.kw_$size, /\$size\b/y);
export const kw_case     = new TokenMatcher<token_type.kw_case, KeywordToken_case>(token_type.kw_case, /\bcase\b/y);
export const kw_default  = new TokenMatcher<token_type.kw_default, KeywordToken_default>(token_type.kw_default, /\bdefault\b/y);
export const kw_$invalid = new TokenMatcher<token_type.kw_$invalid, KeywordToken_$invalid>(token_type.kw_$invalid, /\$invalid\b/y);
export const kw_from     = new TokenMatcher<token_type.kw_from, KeywordToken_from>(token_type.kw_from, /\bfrom\b/y);
export const kw_as       = new TokenMatcher<token_type.kw_as, KeywordToken_as>(token_type.kw_as, /\bas\b/y);

export interface KeywordToken_struct extends Token {
	type: token_type.kw_struct;
	text: 'struct';
}

export interface KeywordToken_switch extends Token {
	type: token_type.kw_switch;
	text: 'switch';
}

export interface KeywordToken_enum extends Token {
	type: token_type.kw_enum;
	text: 'enum';
}

export interface KeywordToken_bin extends Token {
	type: token_type.kw_bin;
	text: 'bin';
}

export interface KeywordToken_$size extends Token {
	type: token_type.kw_$size;
	text: '$size';
}

export interface KeywordToken_case extends Token {
	type: token_type.kw_case;
	text: 'case';
}

export interface KeywordToken_default extends Token {
	type: token_type.kw_default;
	text: 'default';
}

export interface KeywordToken_$invalid extends Token {
	type: token_type.kw_$invalid;
	text: '$invalid';
}

export interface KeywordToken_from extends Token {
	type: token_type.kw_from;
	text: 'from';
}

export interface KeywordToken_as extends Token {
	type: token_type.kw_as;
	text: 'as';
}

