
import { Ignored } from './tokens';
import { ASTNode, node_type } from './node';
import { DeclareSwitchNode } from './switch';
import { DeclareEnumNode } from './enum';
import { DeclareFromNode } from './from';
import { DeclareStructNode } from './struct';
import { ast_json_schema } from '../../constants';

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

	constructor(
		/** The source / file path representing where this file came from */
		public source: string
	) {
		super();
	}

	public toJSON() {
		return {
			$schema: ast_json_schema,
			type: node_type[this.type],
			source: this.source,
			children: this.children
		};
	}

	public pos() : [ line: number, char: number ] {
		return [ 1, 1 ];
	}
}
