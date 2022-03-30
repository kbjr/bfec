
import { BuildError } from '../error';
import { Schema, Import } from '../schema';

export interface LinkerOptions {
	resolve_import?(path: string, from: Schema) : Promise<Schema>;
}

export interface LinkerResults {
	schema: Schema;
	errors: BuildError[];
}

export async function link_schema(schema: Schema, opts: LinkerOptions) : Promise<LinkerResults> {
	const deps = new Map<string, Promise<Schema>>();
	const errors: BuildError[] = [ ];
	const results: LinkerResults = { errors, schema, };

	// First, we'll attempt to resolve any and all imports
	await resolve_imports(schema, opts, deps, errors);

	// Next, we'll link any local symbol references to the objects they refer to
	link_locals(schema, errors);

	// 

	return results;
}

async function resolve_imports(from: Schema, opts: LinkerOptions, deps: Map<string, Promise<Schema>>, errors: BuildError[]) {
	// Propagate any errors that occured from building the schema up to the
	// "project level" error list
	for (const error of from.errors) {
		errors.push(error);
	}

	if (from.imports.length && ! opts.resolve_import) {
		const node = from.include_source_maps
			? from.source_map.get(from.imports[0])
			: null;

		errors.push(
			new BuildError(`ImportError: No import resolution method provided to linker`, from, node)
		);

		return;
	}

	const promises: Promise<any>[] = [ ];

	for (const imported of from.imports) {
		promises.push(resolve(imported));
	}

	await Promise.all(promises);
	
	async function resolve(imported: Import) {
		const name = imported.source_expr.value;

		if (! deps.has(name)) {
			const promise = opts.resolve_import(name, from).then(
				async (schema) => {
					await resolve_imports(schema, opts, deps, errors);
					link_locals(schema, errors);
					return schema;
				}
			);

			deps.set(name, promise);
		}

		try {
			const resolved_schema = await deps.get(name);
			imported.source_schema = resolved_schema;
		}

		catch (error) {
			const node = from.include_source_maps
				? from.source_map.get(imported.source_expr)
				: null;

			const message
				= error instanceof Error ? error.message
				: error instanceof BuildError ? error.message
				: null;

			errors.push(
				new BuildError(`ImportError: Failed to resolve import "${name}"; ${message}`, from, node)
			);
		}
	}
}

function link_locals(schema: Schema, errors: BuildError[]) : void {
	// TODO: link_locals
	console.log('link_locals not yet implemented');
}
