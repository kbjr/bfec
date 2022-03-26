
import { ast } from '../parser';
import { BuildError, Comment, ConstInt, ConstString, Import, ImportedSymbol, Schema, SchemaElem, Struct, Symbol } from './schema';

export { Schema } from './schema';

export function build_schema_from_ast(file: ast.FileNode) : Schema {
	const schema = new Schema();
	schema.source_map.set(schema, file);

	const comments: ast.CommentToken[] = [ ];

	file.children.forEach((node) => {
		switch (node.type) {
			case ast.node_type.whitespace:
				// skip
				break;
	
			case ast.node_type.comment_line:
			case ast.node_type.comment_block:
				comments.push(node);
				break;
	
			case ast.node_type.decl_struct:
				build_struct(schema, node, comments.splice(0, comments.length));
				break;
	
			case ast.node_type.decl_enum:
				build_enum(schema, node, comments.splice(0, comments.length));
				break;
	
			case ast.node_type.decl_switch:
				build_switch(schema, node, comments.splice(0, comments.length));
				break;
	
			case ast.node_type.decl_from:
				build_from(schema, node, comments.splice(0, comments.length));
				break;
	
			default:
				throw new Error(`Invalid AST; encountered unexpected ${ast.node_type[(node as ast.ASTNode).type]} node as file node child`);
		}
	});
	
	return schema;
}

function build_struct(schema: Schema, node: ast.DeclareStructNode, comments: ast.CommentToken[]) : void {
	const struct = new Struct();
	struct.comments = build_comments(comments);
	struct.name = ref(schema, node.name);
	struct.byte_aligned = node.struct_keyword.text === 'struct';

	// TODO: params
	// TODO: members

	add_elem(schema, node.name, struct);

	if (node.name.text === '$') {
		schema.root = struct;
	}
}

function build_enum(schema: Schema, node: ast.DeclareEnumNode, comments: ast.CommentToken[]) : void {
	// TODO: build_enum
}

function build_switch(schema: Schema, node: ast.DeclareSwitchNode, comments: ast.CommentToken[]) : void {
	// TODO: build_switch
}

function build_from(schema: Schema, node: ast.DeclareFromNode, comments: ast.CommentToken[]) : void {
	const import_node = new Import();
	import_node.comments = build_comments(comments);
	import_node.source_expr = build_string_const(schema, node.source);

	schema.imports.push(import_node);

	if (node.root_import) {
		const imported = new ImportedSymbol();
		imported.from = import_node;
		imported.imported = ref(schema, '$');
		imported.local = ref(schema, node.root_import);
		schema.source_map.set(imported, node.root_import);

		add_elem(schema, node.root_import, imported);
	}

	else if (node.imports) {
		node.imports.imports.forEach((node) => {
			const name_node = node.alias_name || node.source_name;
			const imported = new ImportedSymbol();
			imported.from = import_node;
			imported.imported = ref(schema, node.source_name);
			imported.local = ref(schema, name_node);
			schema.source_map.set(imported, node);
	
			add_elem(schema, name_node, imported);
		});
	}

	else {
		throw new Error(`Invalid AST; encountered from declaration with no imports`);
	}
}

function build_error(schema: Schema, message: string, node: ast.ASTNode) : void {
	const error = new BuildError();
	error.message = message;
	error.node = node;
	// TODO: line, char, text
	schema.errors.push(error);
}

function build_comments(comments: ast.CommentToken[]) : Comment[] {
	// TODO: build_comments
	return [ ];
}

function build_string_const(schema: Schema, node: ast.ConstToken_ascii | ast.ConstToken_unicode) : ConstString {
	const string = new ConstString();
	string.unicode = node.type === ast.node_type.const_unicode;
	string.value = node.text.slice(1, -1);
	// TODO: Parse string for escape sequences
	schema.source_map.set(string, node);
	return string;
}

function build_int_const(schema: Schema, node: ast.ConstToken_int | ast.ConstToken_hex_int) : ConstInt {
	const int = new ConstInt();
	// TODO: Big int handling
	// TODO: Verify if this works in all other cases
	int.value = node.type === ast.node_type.const_int
		? parseInt(node.text, 10)
		: parseInt(node.text.slice(2), 16);
	schema.source_map.set(int, node);
	return int;
}

function add_elem(schema: Schema, name_node: ast.NameToken_normal | ast.NameToken_root_schema | ast.NameToken_this_schema, elem: SchemaElem) {
	if (schema.element_map.has(name_node.text)) {
		return build_error(schema, `Encountered duplicate symbol name "${name_node.text}"`, name_node);
	}

	schema.elements.push(elem);
	schema.element_map.set(name_node.text, elem);
}

function ref(schema: Schema, name: ast.NameToken_normal | ast.NameToken_root_schema | ast.NameToken_this_schema | string) {
	const is_str = typeof name === 'string';
	const symbol = new Symbol(is_str ? name : name.text);
	if (! is_str) {
		schema.source_map.set(symbol, name);
	}
	return symbol;
}
