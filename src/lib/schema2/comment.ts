
import { ast } from '../parser';
import { SchemaNode } from './node';
import { pos } from './pos';

export class Comment implements SchemaNode {
	public type = 'comment' as const;
	public ast_node: ast.CommentToken;
	public content: string;
	public is_block: boolean;

	public get pos() {
		return pos(this.ast_node);
	}
}

export function build_comment(ast_node: ast.CommentToken) {
	const comment = new Comment();
	comment.ast_node = ast_node;
	comment.is_block = ast_node.type === ast.node_type.comment_block;
	comment.content = comment.is_block ? ast_node.text.slice(3, -3) : ast_node.text.slice(1);
	return comment;
}
