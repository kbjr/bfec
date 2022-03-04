
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
}
