
import { ASTNode, node_type } from './node';
import {
	CommentToken,
	ConstToken_ascii,
	ConstToken_unicode,
	KeywordToken_as,
	NameToken_normal,
	PuncToken_close_brace,
	PuncToken_open_brace,
	PuncToken_separator,
	PuncToken_terminator,
} from './tokens';

export class DeclareFromNode extends ASTNode {
	public type: node_type.decl_from = node_type.decl_from;
	public comments: CommentToken[];
	public extraneous_comments: CommentToken[];
	public source: ConstToken_ascii | ConstToken_unicode;
	public imports: FromImportsListNode;
	public root_import: NameToken_normal;
	public terminator: PuncToken_terminator;
	public toJSON() {
		return {
			type: node_type[this.type],
			comments: this.comments,
			extraneous_comments: this.extraneous_comments,
			source: this.source,
			imports: this.imports,
			root_import: this.root_import,
			terminator: this.terminator,
		};
	}
}

export class FromImportsListNode extends ASTNode {
	public type: node_type.imports_list = node_type.imports_list;
	public open_brace: PuncToken_open_brace;
	public close_brace: PuncToken_close_brace;
	public imports: FromImportNode[] = [ ];
	public toJSON() {
		return {
			type: node_type[this.type],
			open_brace: this.open_brace,
			close_brace: this.close_brace,
			imports: this.imports,
		};
	}
}

export class FromImportNode extends ASTNode {
	public type: node_type.from_import = node_type.from_import;
	public source_name: NameToken_normal;
	public as_keyword: KeywordToken_as;
	public alias_name: NameToken_normal;
	public separator: PuncToken_separator;
	public toJSON() {
		return {
			type: node_type[this.type],
			source_name: this.source_name,
			as_keyword: this.as_keyword,
			alias_name: this.alias_name,
			separator: this.separator,
		};
	}
}
