
import { Token } from './token';
import { SimpleTokenMatcher } from './matcher';
import { node_type } from '../node';

export class PuncToken_property_access extends Token {
	public type: node_type.punc_property_access = node_type.punc_property_access;
	public text: '.' = '.';
}

export class PuncToken_terminator extends Token {
	public type: node_type.punc_terminator = node_type.punc_terminator;
	public text: ';' = ';';
}

export class PuncToken_colon extends Token {
	public type: node_type.punc_colon = node_type.punc_colon;
	public text: ':' = ':';
}

export class PuncToken_separator extends Token {
	public type: node_type.punc_separator = node_type.punc_separator;
	public text: ',' = ',';
}

export class PuncToken_assign extends Token {
	public type: node_type.punc_assign = node_type.punc_assign;
	public text: '=' = '=';
}

export class PuncToken_open_paren extends Token {
	public type: node_type.punc_open_paren = node_type.punc_open_paren;
	public text: '(' = '(';
}

export class PuncToken_close_paren extends Token {
	public type: node_type.punc_close_paren = node_type.punc_close_paren;
	public text: ')' = ')';
}

export class PuncToken_open_brace extends Token {
	public type: node_type.punc_open_brace = node_type.punc_open_brace;
	public text: '{' = '{';
}

export class PuncToken_close_brace extends Token {
	public type: node_type.punc_close_brace = node_type.punc_close_brace;
	public text: '}' = '}';
}

export class PuncToken_open_square_bracket extends Token {
	public type: node_type.punc_open_square_bracket = node_type.punc_open_square_bracket;
	public text: '[' = '[';
}

export class PuncToken_close_square_bracket extends Token {
	public type: node_type.punc_close_square_bracket = node_type.punc_close_square_bracket;
	public text: ']' = ']';
}

export class PuncToken_open_angle_bracket extends Token {
	public type: node_type.punc_open_angle_bracket = node_type.punc_open_angle_bracket;
	public text: '<' = '<';
}

export class PuncToken_close_angle_bracket extends Token {
	public type: node_type.punc_close_angle_bracket = node_type.punc_close_angle_bracket;
	public text: '>' = '>';
}

export class PuncToken_arrow extends Token {
	public type: node_type.punc_arrow = node_type.punc_arrow;
	public text: '->' = '->';
}

export class PuncToken_condition extends Token {
	public type: node_type.punc_condition = node_type.punc_condition;
	public text: '?' = '?';
}

export const punc_property_access      = new SimpleTokenMatcher(PuncToken_property_access, /\./y);
export const punc_terminator           = new SimpleTokenMatcher(PuncToken_terminator, /;/y);
export const punc_colon                = new SimpleTokenMatcher(PuncToken_colon, /:/y);
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
export const punc_condition            = new SimpleTokenMatcher(PuncToken_arrow, /\?/y);
