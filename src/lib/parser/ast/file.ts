
import { ASTNode, node_type } from './node';

export class FileNode extends ASTNode {
	public type: node_type.file = node_type.file;
	public children: ASTNode[] = [ ];
	public toJSON() {
		return {
			type: node_type[this.type],
			children: this.children
		};
	}
}
