
import { ast } from '../parser';
import { Comment } from './comment';
import { ConstString } from './const';
import { SchemaNode } from './node';
import { pos } from './pos';
import { Schema } from './schema';

export class Import implements SchemaNode {
	public type = 'import' as const;
	public comments: Comment[];
	public ast_node: ast.DeclareFromNode;
	public source: ConstString;
	public schema: Schema;

	public get pos() {
		return pos(this.source.token);
	}

	public toJSON() {
		return {
			type: this.type,
			comments: this.comments,
			source: this.source,
			schema: this.schema,
		};
	}
}
