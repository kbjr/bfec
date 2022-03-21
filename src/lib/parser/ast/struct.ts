
import { ASTNode, node_type } from './node';
import {
	CommentToken,
	NameToken_normal,
	NameToken_root_schema,
	PuncToken_close_brace,
	PuncToken_close_paren,
	PuncToken_colon,
	PuncToken_open_brace,
	PuncToken_open_paren,
	PuncToken_terminator
} from './tokens';
import { TypeExpr } from './type-expr';

export class DeclareStructNode extends ASTNode {
	public type: node_type.decl_struct = node_type.decl_struct;
	public name: NameToken_normal | NameToken_root_schema;
	public params: StructParamsListNode;
	public body: StructBody;
	public children: CommentToken[] = [ ];
	public toJSON() {
		return {
			type: node_type[this.type],
			name: this.name,
			params: this.params,
			body: this.body,
			children: this.children,
		};
	}
}

export class StructBody extends ASTNode {
	public type: node_type.struct_body = node_type.struct_body;
	public open_brace: PuncToken_open_brace;
	public close_brace: PuncToken_close_brace;
	public children: StructElem[] = [ ];
	public toJSON() {
		return {
			type: node_type[this.type],
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
	public children: (StructParamNode | CommentToken)[] = [ ];
	public toJSON() {
		return {
			type: node_type[this.type],
			open_paren: this.open_paren,
			close_paren: this.close_paren,
			children: this.children,
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

export type StructElem = StructExpansion | StructField | CommentToken ;

export class StructExpansion extends ASTNode {
	public type: node_type.struct_expansion = node_type.struct_expansion;
	public toJSON(): object {
		return { };
	}
}

export class StructField extends ASTNode {
	public type: node_type.struct_field = node_type.struct_field;
	public field_name: NameToken_normal;
	public optional_condition: StructFieldOptionalCondition;
	public field_type_colon: PuncToken_colon;
	public field_type: TypeExpr;
	public terminator: PuncToken_terminator;
	public children: CommentToken[] = [ ];
	public toJSON(): object {
		return {
			type: node_type[this.type],
			field_name: this.field_name,
			optional_condition: this.optional_condition,
			field_type_colon: this.field_type_colon,
			field_type: this.field_type,
			terminator: this.terminator,
			children: this.children
		};
	}
}

export class StructFieldOptionalCondition extends ASTNode {
	public type: node_type.struct_field_optional_condition = node_type.struct_field_optional_condition;
	public children: CommentToken[] = [ ];
	public toJSON(): object {
		return {
			type: node_type[this.type],
			children: this.children,
		};
	}
}
