
import { ast } from '../parser';
import { Schema } from './schema';

export interface LinkerOptions {
	resolve_import?(path: string, from: Schema) : Promise<ast.FileNode>;
}
