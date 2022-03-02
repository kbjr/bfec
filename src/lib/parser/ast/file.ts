
import { ASTNode, node_type } from './node';

export interface FileNode extends ASTNode {
	type: node_type.file;
	children: ASTNode[];
}

export function file_node() : FileNode {
	return {
		type: node_type.file,
		children: [ ]
	};
}
