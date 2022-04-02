
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
	(node: SchemaNode, message: string): void;
}

export function build_error_factory(errors: BuildError[], schema: Schema) : BuildErrorFactory {
	return function _build_error(schema_node: SchemaNode, message: string) {
		const node = schema.include_source_maps
			? schema.source_map.get(schema_node)
			: null;

		errors.push(
			new BuildError(message, schema, node)
		);
	};
}
