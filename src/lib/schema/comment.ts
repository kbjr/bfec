
import { ast } from '../parser';
import { SchemaNode } from './node';

export class Comment extends SchemaNode {
	public type = 'comment';
	public text: string;

	public static from_ast(node: ast.CommentToken) {
		const comment = new Comment();
		comment.text = node.text;
		return comment;
	}
}

export function build_comments(nodes: ast.CommentToken[]) {
	return nodes.map((node) => Comment.from_ast(node));
}
