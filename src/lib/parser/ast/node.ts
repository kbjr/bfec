
export abstract class ASTNode {
	public abstract type: node_type;
	
	public toJSON() {
		const json: any = Object.assign({ }, this);
		json.type = node_type[json.type];
		return json;
	}

	public abstract pos() : [line: number, char: number];
}

export enum node_type {
	file,
	whitespace,
	comment_line,
	comment_block,

	decl_struct,
	decl_enum,
	decl_switch,
	decl_from,
	
	struct_params_list,
	struct_param,
	struct_expansion,
	struct_body,
	struct_field,
	struct_field_optional_condition,

	enum_body,
	enum_member,
	
	switch_param,
	switch_body,
	switch_case,
	switch_default,

	imports_list,
	from_import,

	type_expr_vint,
	type_expr_len,
	type_expr_array,
	type_expr_struct_refinement,
	type_expr_switch_refinement,
	type_expr_named_refinement,
	type_expr_named,
	type_expr_text,
	type_expr_checksum,
	type_expr_params_list,
	type_expr_param,

	value_expr_path,
	value_expr_path_access,

	bool_expr_eq,
	bool_expr_neq,
	bool_expr_and,
	bool_expr_or,
	bool_expr_xor,
	// bool_expr_gt,
	// bool_expr_gte,
	// bool_expr_lt,
	// bool_expr_lte,
	bool_expr_not,

	// ===== Tokens =====

	const_ascii,
	const_unicode,
	const_int,
	const_hex_int,

	name_normal,
	name_root_schema,
	name_this_schema,
	name_builtin_uint,
	name_builtin_sint,
	name_builtin_vint,
	name_builtin_len,
	name_builtin_bin_float,
	name_builtin_dec_float,
	name_builtin_bit,
	name_builtin_text,
	name_builtin_checksum,
	
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
	punc_condition,

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
	kw_case,
	kw_default,
	kw_invalid,
	kw_void,
	kw_null,
	kw_from,
	kw_as,
}
