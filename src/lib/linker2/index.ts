
import { BuildError } from '../error2';
import { ast } from '../parser';
import { build_schema_from_ast } from './builder';
import { link_fields } from './link-fields';
import { link_imports } from './link-imports';
import { link_types } from './link-types';
import { LinkerOptions } from './options';
import { resolve_imports } from './resolve-imports';
import { Schema } from './schema';

export { build_schema_from_ast } from './builder';

export * from './base-types';
export * from './comment';
export * from './const';
export * from './enum';
export * from './import';
export * from './node';
export * from './pos';
export * from './ref';
export * from './schema';
export * from './struct';
export * from './switch';

export async function link_schema(entrypoint_ast: ast.FileNode, opts: LinkerOptions) {
	const errors: BuildError[] = [ ];
	const schema = build_schema_from_ast(entrypoint_ast, errors);

	const deps = new Map<string, Promise<Schema>>();
	await resolve_imports(schema, schema, opts, deps, errors);

	link_imports(schema, errors);
	link_types(schema, errors);
	link_fields(schema, errors);

	// TODO: struct expansion?
	// TODO: type validation

	return { schema, errors };
}
