
import { ast } from '../parser';
import { Enum } from './enum';
import { Struct } from './struct';
import { Switch } from './switch';
import { ImportedSymbol, Import } from './import';
import { BaseNode, node_type, SchemaNode } from './node';
import { schema_json_schema } from '../constants';
import { BuildError } from './error';

export type SchemaElem = ImportedSymbol | Struct | Switch | Enum;

export class Schema extends BaseNode {
	public type: node_type.schema = node_type.schema;
	public imports: Import[] = [ ];
	public root: Struct;
	public elements: SchemaElem[] = [ ];
	public element_map: Map<string, SchemaElem> = new Map();
	public source_map: Map<SchemaNode, ast.ASTNode>;
	public errors: BuildError[] = [ ];

	constructor(
		public readonly include_source_maps: boolean = false
	) {
		super();

		if (this.include_source_maps) {
			this.source_map = new Map();
		}
	}

	public toJSON() {
		return {
			$schema: schema_json_schema,
			type: node_type[this.type],
			imports: this.imports,
			elements: this.elements,
			errors: this.errors,
		};
	}

	public add_elem(name_node: ast.NameToken_normal | ast.NameToken_root_schema, elem: SchemaElem) {
		if (this.element_map.has(name_node.text)) {
			this.build_error(`Encountered duplicate symbol name "${name_node.text}"`, name_node);
			return false;
		}
	
		this.elements.push(elem);
		this.element_map.set(name_node.text, elem);
		return true;
	}

	public map_ast(node: SchemaNode, ast_node: ast.ASTNode) {
		if (this.include_source_maps) {
			this.source_map.set(node, ast_node);
		}
	}

	public build_error(message: string, node: ast.ASTNode) : void {
		const error = new BuildError(message, node);
		this.errors.push(error);
	}
	
	public ref(name: ast.NameToken_normal | ast.NameToken_root_schema | ast.NameToken_this_schema | string) {
		const is_str = typeof name === 'string';
		const symbol = new Ref(is_str ? name : name.text);

		if (! is_str) {
			this.map_ast(symbol, name);
		}

		return symbol;
	}
}

export class Ref extends BaseNode {
	public type: node_type.symbol = node_type.symbol;
	
	constructor(
		public name: string
	) {
		super();
	}

	public toJSON() {
		return this.name;
	}
}

export class Comment extends BaseNode {
	public type: node_type.comment = node_type.comment;
	public text: string;

	constructor(node: ast.CommentToken) {
		super();
		this.text = node.text;
	}
}
