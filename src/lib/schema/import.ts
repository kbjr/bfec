
import { ConstString } from './const';
import { Schema } from './schema';
import { Comment } from './comment';
import { SchemaNode } from './node';

export class Import extends SchemaNode {
	public type = 'import';
	public comments: Comment[] = [];
	public source_expr: ConstString;
	public source_schema?: Schema;
}
