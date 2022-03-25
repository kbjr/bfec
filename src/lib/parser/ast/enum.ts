
import { ASTNode, node_type } from './node';
import {
	Ignored,
} from './tokens';

export type EnumElem = ASTNode;

export class DeclareEnumNode extends ASTNode {
	public type: node_type.decl_enum = node_type.decl_enum;
	public children: Ignored[] = [ ];
	public toJSON() {
		return {
			type: node_type[this.type],
			children: this.children,
		};
	}
}
