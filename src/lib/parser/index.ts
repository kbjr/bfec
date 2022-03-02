
import { FileNode } from './ast';
import { file_node } from './ast/file';

export * as ast from './ast';

export function parse_bfec_schema(contents: string) : FileNode {
	const ast_node = file_node();

	// 

	return ast_node;
}
