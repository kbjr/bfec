
import { Schema } from '../schema';
import { BuildError } from '../error';
import { link_locals } from './link-locals';
import { LinkerOptions } from './opts';
import { resolve_imports } from './resolve-imports';
import { validate_types } from './type-validation';

export * from './opts';

export async function link_schema(schema: Schema, opts: LinkerOptions) : Promise<BuildError[]> {
	const deps = new Map<string, Promise<Schema>>();
	const errors: BuildError[] = [ ];

	await resolve_imports(schema, opts, deps, errors);
	link_locals(schema, errors);
	validate_types(schema, errors);

	// If we've encountered any errors up to this point, stop here
	if (errors.length) {
		return errors;
	}

	// Otherwise, continue on with resolving concrete types
	// 

	return errors;
}
