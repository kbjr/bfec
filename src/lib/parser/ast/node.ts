
export abstract class ASTNode {
	public abstract type: node_type;
	public abstract toJSON() : object;
}

export enum node_type {
	file,
	whitespace,
	comment_line,

	decl_struct,
	decl_enum,
	decl_switch,
	decl_from,
	
	struct_params_list,
	struct_param,
	struct_expansion,
	struct_size_prefix,
	struct_field,
	
	switch_param,
	switch_case,
	switch_default,

	imports_list,
	from_import,

	type_expr_vint,

	// ===== Tokens =====
	
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
	punc_colon,

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
	kw_$void,
	kw_from,
	kw_as,
}
