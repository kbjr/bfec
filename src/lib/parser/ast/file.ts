
import { CommentToken } from './tokens';
import { ASTNode, node_type } from './node';

export type FileNodeElem = ASTNode | CommentToken;

export class FileNode extends ASTNode {
	public type: node_type.file = node_type.file;
	public children: FileNodeElem[] = [ ];
	public extraneous_comments: CommentToken[];
	public toJSON() {
		return {
			type: node_type[this.type],
			children: this.children
		};
	}
}
