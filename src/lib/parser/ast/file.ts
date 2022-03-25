
import { Ignored } from './tokens';
import { ASTNode, node_type } from './node';
import { DeclareSwitchNode } from './switch';
import { DeclareEnumNode } from './enum';
import { DeclareFromNode } from './from';
import { DeclareStructNode } from './struct';

export type FileNodeElem
	= DeclareSwitchNode
	| DeclareEnumNode
	| DeclareFromNode
	| DeclareStructNode
	| Ignored
	;

export class FileNode extends ASTNode {
	public type: node_type.file = node_type.file;
	public children: FileNodeElem[] = [ ];
	public toJSON() {
		return {
			type: node_type[this.type],
			children: this.children
		};
	}
}
