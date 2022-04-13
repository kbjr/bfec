
import { Schema } from './schema';
import { ImportedRef } from './ref';
import { BuildError, BuildErrorFactory, build_error_factory } from '../error';

export function link_imports(schema: Schema, errors: BuildError[]) {
	const error = build_error_factory(errors, schema);
	
	for (const node of schema.imported_refs) {
		link_imported_ref(node, error);
	}
}

function link_imported_ref(node: ImportedRef, error: BuildErrorFactory) {
	if (! node.from || ! node.from.schema) {
		error(node, `Failed to resolve imported symbol "${node.name}"; Schema not found`);
		return;
	}

	const found = node.from.schema.symbols.get(node.source_name);

	if (! found) {
		error(node, `Failed to resolve imported symbol "${node.name}"`);
		return;
	}

	node.points_to = found;
}
