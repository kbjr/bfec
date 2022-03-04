
export class Token {
	public type: token_type;
	public line: number;
	public char: number;
	public length: number;
	public text: string;

	public toJSON() {
		return {
			type: token_type[this.type],
			line: this.line,
			char: this.char,
			length: this.length,
			text: this.text,
		};
	}
}

export enum token_type {
	meta_whitespace,
	meta_line_comment,

	const_ascii,
	const_unicode,
	const_int,
	const_hex_int,

	name_normal,
	name_root_schema,
	name_builtin_uint,
	name_builtin_sint,
	name_builtin_vint,
	name_builtin_bin_float,
	name_builtin_dec_float,
	name_builtin_bit,
	name_builtin_text,
	
	punc_property_access,
	punc_terminator,
	punc_separator,
	punc_assign,
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
	op_expansion,

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
