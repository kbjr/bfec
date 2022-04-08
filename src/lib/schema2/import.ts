
import { ast } from '../parser';
import { Comment } from './comment';
import { SchemaNode } from './node';

export class Import implements SchemaNode {
	public type = 'import' as const;
	public comments: Comment[];
	public ast_node: ast.DeclareFromNode;
	public source: string;
	public source_token: ast.ConstToken_ascii | ast.ConstToken_unicode;

	public get pos() {
		return null;
	}
}
