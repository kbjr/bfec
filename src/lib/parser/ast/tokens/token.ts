
import { ASTNode, node_type } from '../node';

export abstract class Token extends ASTNode {
	public line: number;
	public char: number;
	public length: number;
	public text: string;

	public toJSON() {
		return {
			type: node_type[this.type],
			line: this.line,
			char: this.char,
			length: this.length,
			text: this.text,
		};
	}
}
