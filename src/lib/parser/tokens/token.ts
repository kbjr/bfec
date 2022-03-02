
export class Token {
	public type: token_type;
	public line: number;
	public char: number;
	public offset: number;
	public length: number;
	public text: string;

	public toJSON() {
		return {
			type: token_type[this.type],
			line: this.line,
			char: this.char,
			offset: this.offset,
			length: this.length,
			text: this.text,
		};
	}
}

export enum token_type {
	meta_whitespace,
	meta_line_comment,

	name_normal,
	name_root_schema,
	name_builtin,
	
	punc_property_access,
	punc_terminator,
	punc_separator,
	punc_open_paren,
	punc_close_paren,
	punc_open_brace,
	punc_close_brace,
	punc_open_square_bracket,
	punc_close_square_bracket,
	punc_open_angle_bracket,
	punc_close_angle_bracket,
	punc_arrow,

	op_equal,
	op_not_equal,
	op_and,
	op_or,
	op_xor,
	op_not,

	kw_struct,
	kw_switch,
	kw_enum,
	kw_bin,
	kw_$size,
	kw_case,
	kw_default,
	kw_$invalid,
	kw_from,
	kw_as,

}
