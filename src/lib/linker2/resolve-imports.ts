
import { Schema } from './schema';
import { Import } from './import';
import { link_locals } from './link-locals';
import { LinkerOptions } from './options';
import { linker as log } from '../log';
import { build_schema_from_ast } from './builder';
import { BuildError, build_error_factory } from '../error2';

export async function resolve_imports(from: Schema, root: Schema, opts: LinkerOptions, deps: Map<string, Promise<Schema>>, errors: BuildError[]) {
	const error = build_error_factory(errors, from);
	
	if (from.imports.length && ! opts.resolve_import) {
		error(from.imports[0], 'No import resolution method provided to linker');
		return;
	}

	const promises: Promise<any>[] = [ ];

	for (const imported of from.imports) {
		promises.push(resolve(imported));
	}

	await Promise.all(promises);
	
	async function resolve(imported: Import) {
		const name = imported.source.value;

		if (! deps.has(name)) {
			const promise = opts.resolve_import(name, from).then(
				async (ast_node) => {
					const schema = build_schema_from_ast(ast_node, errors, from);
					await resolve_imports(schema, root, opts, deps, errors);
					link_locals(schema, errors);
					return schema;
				}
			);

			deps.set(name, promise);
		}

		try {
			const resolved_schema = await deps.get(name);
			imported.schema = resolved_schema;
		}

		catch (err) {
			log.debug(err);
			
			const message
				= err instanceof Error ? err.message
				: null;

			error(imported, `Failed to resolve import "${name}"; ${message}`);
		}
	}
}
