
import { Schema } from '../schema';
import { BuildError } from '../error';
import { link_locals } from './link-locals';
import { LinkerOptions } from './opts';
import { resolve_imports } from './resolve-imports';

export * from './opts';

export async function link_schema(schema: Schema, opts: LinkerOptions) : Promise<BuildError[]> {
	const deps = new Map<string, Promise<Schema>>();
	const errors: BuildError[] = [ ];

	await resolve_imports(schema, opts, deps, errors);
	link_locals(schema, errors);
	// TODO: Validate types / param signatures

	return errors;
}
