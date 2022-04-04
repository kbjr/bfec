
import { ast } from './parser';
import { Schema, SchemaNode } from './schema';

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

export interface BuildErrorFactory {
	(node: SchemaNode | ast.ASTNode, message: string): void;
}

export function build_error_factory(errors: BuildError[], schema: Schema) : BuildErrorFactory {
	return function _build_error(node: SchemaNode | ast.ASTNode, message: string) {
		if (node instanceof SchemaNode) {
			node = schema.include_source_maps
				? schema.source_map.get(node)
				: null;
		}

		errors.push(
			new BuildError(message, schema, node)
		);
	};
}