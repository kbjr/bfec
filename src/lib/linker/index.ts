
import { ast } from '../parser';
import { Schema } from '../schema';

export interface SchemaCompilerOptions {
	resolve_import?(from: string, path: string) : Promise<ast.FileNode>;
}

export async function link_ast_to_schema(file: ast.FileNode, opts: SchemaCompilerOptions) : Promise<Schema> {
	// 
	return new Schema();
}
