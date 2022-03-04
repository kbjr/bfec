
import { ASTNode, node_type } from './node';
import {
	CommentToken,
	NameToken_normal,
	NameToken_root_schema,
	PuncToken_close_brace,
	PuncToken_close_paren,
	PuncToken_open_brace,
	PuncToken_open_paren
} from './tokens';

export class DeclareStructNode extends ASTNode {
	public type: node_type.decl_struct = node_type.decl_struct;
	public comments: CommentToken[];
	public extraneous_comments: CommentToken[];
	public name: NameToken_normal | NameToken_root_schema;
	public params: StructParamsListNode;
	public open_brace: PuncToken_open_brace;
	public close_brace: PuncToken_close_brace;
	public children: StructElem[];
	public toJSON() {
		return {
			type: node_type[this.type],
			comments: this.comments,
			extraneous_comments: this.extraneous_comments,
			name: this.name,
			params: this.params,
			open_brace: this.open_brace,
			close_brace: this.close_brace,
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

export type StructElem = StructExpansion | StructSizePrefix | StructField | CommentToken ;

export class StructExpansion extends ASTNode {
	public type: node_type.struct_expansion = node_type.struct_expansion;
	public toJSON(): object {
		return { };
	}
}

export class StructSizePrefix extends ASTNode {
	public type: node_type.struct_size_prefix = node_type.struct_size_prefix;
	public toJSON(): object {
		return { };
	}
}

export class StructField extends ASTNode {
	public type: node_type.struct_field = node_type.struct_field;
	public toJSON(): object {
		return { };
	}
}
