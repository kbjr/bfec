
import { ASTNode, node_type } from './node';
import {
	CommentToken,
	NameToken_normal,
	NameToken_root_schema,
	PuncToken_close_paren,
	PuncToken_open_paren
} from '../tokens';

export class DeclareStructNode extends ASTNode {
	public type: node_type.decl_struct = node_type.decl_struct;
	public comments: CommentToken[];
	public name: NameToken_normal | NameToken_root_schema;
	public params: StructParamsListNode;
	public children: ASTNode[];
	public toJSON() {
		return {
			type: node_type[this.type],
			name: this.name,
			params: this.params,
			children: this.children
		};
	}
}

export class StructParamsListNode extends ASTNode {
	public type: node_type.struct_params_list = node_type.struct_params_list;
	public open_paren: PuncToken_open_paren;
	public close_paren: PuncToken_close_paren;
	public params: StructParamNode[] = [ ];
	public toJSON() {
		return {
			type: node_type[this.type],
			open_paren: this.open_paren,
			close_paren: this.close_paren,
			params: this.params,
		};
	}
}

export class StructParamNode extends ASTNode {
	public type: node_type.struct_param = node_type.struct_param;
	// 
	public toJSON() {
		return {
			type: node_type[this.type],
			// name: this.name,
		};
	}
}
