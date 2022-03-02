
export interface ASTNode {
	type: node_type;
}

export enum node_type {
	file,
	decl_struct,
	decl_enum,
	decl_switch,
	decl_from,
	// 
}
