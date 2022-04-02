
import { ast } from './parser';
import { Schema } from './schema/schema';

export class BuildError {
	public line: number;
	public char: number;
	public text: string;

	constructor(
		public message: string,
		public source: Schema,
		public node?: ast.ASTNode
	) {
		if (node) {
			[ this.line, this.char ] = node.pos();
		}
	}
}
