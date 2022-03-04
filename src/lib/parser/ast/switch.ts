
import { ASTNode, node_type } from './node';
import {
	CommentToken,
	NameToken_normal,
	NameToken_root_schema,
	PuncToken_close_paren,
	PuncToken_open_paren
} from '../tokens';

export class DeclareSwitchNode extends ASTNode {
	public type: node_type.decl_struct = node_type.decl_struct;
	public comments: CommentToken[];
	public name: NameToken_normal | NameToken_root_schema;
	public param: SwitchParam;
	public children: ASTNode[];
	public toJSON() {
		return {
			type: node_type[this.type],
			name: this.name,
			param: this.param,
			children: this.children
		};
	}
}

export class SwitchParam extends ASTNode {
	public type: node_type.switch_param = node_type.switch_param;
	public open_paren: PuncToken_open_paren;
	public close_paren: PuncToken_close_paren;
	public param: NameToken_normal;
	public toJSON() {
		return {
			type: node_type[this.type],
			open_paren: this.open_paren,
			close_paren: this.close_paren,
			param: this.param
		};
	}
}
