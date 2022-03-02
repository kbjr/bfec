
export abstract class ASTNode {
	public abstract type: node_type;
	public abstract toJSON() : object;
}

export enum node_type {
	file,
	decl_struct,
	decl_enum,
	decl_switch,
	decl_from,
	// 
}
