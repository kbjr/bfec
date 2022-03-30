
import { ConstString } from './const';
import { BaseNode, node_type } from './node';
import { Comment, Schema, Ref } from './schema';

export class Import extends BaseNode {
	public type: node_type.import = node_type.import;
	public comments: Comment[] = [];
	public source_expr: ConstString;
	public source_schema?: Schema;
}

export class ImportedSymbol extends BaseNode {
	public type: node_type.imported_symbol = node_type.imported_symbol;
	public from: Import;
	public local: Ref;
	public imported: Ref;
}
