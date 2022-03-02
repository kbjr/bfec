
import { ast } from '../parser';
import { Schema } from './schema';

export * as schema from './schema';

export interface SchemaCompilerOptions {
	resolve_import?(from: string, path: string) : Promise<ast.FileNode>;
}

export async function compile_ast_to_schema(file: ast.FileNode, opts: SchemaCompilerOptions) : Promise<Schema> {
	// 
	return { };
}
