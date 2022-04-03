
import { ast } from '../parser';
import { Enum } from './enum';
import { Struct } from './struct';
import { Switch } from './switch';
import { Import } from './import';
import { SchemaNode } from './node';
import { BuildErrorFactory } from '../error';
import { schema_json_schema } from '../constants';
import { ImportedRef, NamedRef, RootRef, SelfRef } from './ref';

export type SchemaElem = ImportedRef | Struct | Switch | Enum;

export class Schema extends SchemaNode {
	public $schema = schema_json_schema;
	public type = 'schema';

	public root: Struct;
	public imports: Import[] = [ ];

	public imported_refs: ImportedRef[] = [ ];
	public structs: Struct[] = [ ];
	public switches: Switch[] = [ ];
	public enums: Enum[] = [ ];

	public element_map: Map<string, SchemaElem> = new Map();
	public source_map: Map<SchemaNode, ast.ASTNode>;
	
	public is_external: boolean = false;
	public is_remote: boolean = false;

	public error: BuildErrorFactory;

	constructor(
		/** The source / file path representing where this schema came from */
		public readonly source: string,
		/**
		 * Controls whether or not the schema should preserve mappings back to the AST source tokens
		 * for debugging purposes.
		 */
		public readonly include_source_maps: boolean = false
	) {
		super();

		if (this.include_source_maps) {
			this.source_map = new Map();
		}
	}

	public map_elem(name_node: ast.NameToken_normal | ast.NameToken_root_schema, elem: SchemaElem) {
		if (this.element_map.has(name_node.text)) {
			this.error(name_node, `Encountered duplicate symbol name "${name_node.text}"`);
			return false;
		}
	
		this.element_map.set(name_node.text, elem);
		return true;
	}

	public map_ast(node: SchemaNode, ast_node: ast.ASTNode) {
		if (this.include_source_maps) {
			this.source_map.set(node, ast_node);
		}
	}
	
	public ref(name: ast.NameToken_normal | ast.NameToken_root_schema | ast.NameToken_this_schema) {
		switch (name.type) {
			case ast.node_type.name_normal: {
				const ref = NamedRef.from_name(name);
				this.map_ast(ref, name);
				return ref;
			};
			
			case ast.node_type.name_root_schema: {
				const ref = RootRef.from_name(name);
				this.map_ast(ref, name);
				return ref;
			};
			
			case ast.node_type.name_this_schema: {
				const ref = SelfRef.from_name(name);
				this.map_ast(ref, name);
				return ref;
			};
		}
	}
}
