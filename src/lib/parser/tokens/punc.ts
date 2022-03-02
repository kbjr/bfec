
import { Token, token_type } from './token';
import { SimpleTokenMatcher } from './matcher';

export class PuncToken_property_access extends Token {
	public type: token_type.punc_property_access = token_type.punc_property_access;
	public text: '.' = '.';
}

export class PuncToken_terminator extends Token {
	public type: token_type.punc_terminator = token_type.punc_terminator;
	public text: ';' = ';';
}

export class PuncToken_separator extends Token {
	public type: token_type.punc_separator = token_type.punc_separator;
	public text: ',' = ',';
}

export class PuncToken_assign extends Token {
	public type: token_type.punc_assign = token_type.punc_assign;
	public text: '=' = '=';
}

export class PuncToken_open_paren extends Token {
	public type: token_type.punc_open_paren = token_type.punc_open_paren;
	public text: '(' = '(';
}

export class PuncToken_close_paren extends Token {
	public type: token_type.punc_close_paren = token_type.punc_close_paren;
	public text: ')' = ')';
}

export class PuncToken_open_brace extends Token {
	public type: token_type.punc_open_brace = token_type.punc_open_brace;
	public text: '{' = '{';
}

export class PuncToken_close_brace extends Token {
	public type: token_type.punc_close_brace = token_type.punc_close_brace;
	public text: '}' = '}';
}

export class PuncToken_open_square_bracket extends Token {
	public type: token_type.punc_open_square_bracket = token_type.punc_open_square_bracket;
	public text: '[' = '[';
}

export class PuncToken_close_square_bracket extends Token {
	public type: token_type.punc_close_square_bracket = token_type.punc_close_square_bracket;
	public text: ']' = ']';
}

export class PuncToken_open_angle_bracket extends Token {
	public type: token_type.punc_open_angle_bracket = token_type.punc_open_angle_bracket;
	public text: '<' = '<';
}

export class PuncToken_close_angle_bracket extends Token {
	public type: token_type.punc_close_angle_bracket = token_type.punc_close_angle_bracket;
	public text: '>' = '>';
}

export class PuncToken_arrow extends Token {
	public type: token_type.punc_arrow = token_type.punc_arrow;
	public text: '->' = '->';
}

export const punc_property_access      = new SimpleTokenMatcher(PuncToken_property_access, /\./y);
export const punc_terminator           = new SimpleTokenMatcher(PuncToken_terminator, /;/y);
export const punc_separator            = new SimpleTokenMatcher(PuncToken_separator, /,/y);
export const punc_assign               = new SimpleTokenMatcher(PuncToken_assign, /=/y);
export const punc_open_paren           = new SimpleTokenMatcher(PuncToken_open_paren, /\(/y);
export const punc_close_paren          = new SimpleTokenMatcher(PuncToken_close_paren, /\)/y);
export const punc_open_brace           = new SimpleTokenMatcher(PuncToken_open_brace, /\{/y);
export const punc_close_brace          = new SimpleTokenMatcher(PuncToken_close_brace, /\}/y);
export const punc_open_square_bracket  = new SimpleTokenMatcher(PuncToken_open_square_bracket, /\[/y);
export const punc_close_square_bracket = new SimpleTokenMatcher(PuncToken_close_square_bracket, /\]/y);
export const punc_open_angle_bracket   = new SimpleTokenMatcher(PuncToken_open_angle_bracket, /\</y);
export const punc_close_angle_bracket  = new SimpleTokenMatcher(PuncToken_close_angle_bracket, /\>/y);
export const punc_arrow                = new SimpleTokenMatcher(PuncToken_arrow, /-\>/y);
