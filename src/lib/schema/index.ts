
import { ast } from '../parser';
import { Enum, EnumMember } from './enum';
import { Switch } from './switch';
import { Struct, StructExpansion, StructField } from './struct';
import { ConstInt, ConstString } from './const';
import { Import, ImportedSymbol } from './import';
import { Comment, Schema, SchemaElem } from './schema';
import { TypeExpr, TypeExpr_array, TypeExpr_checksum, TypeExpr_named } from './type-expr';

export * from './bool-expr';
export * from './const';
export * from './enum';
export * from './import';
export * from './node';
export * from './schema';
export * from './struct';
export * from './switch';
export * from './type-expr';
export * from './value-expr';

export function build_schema_from_ast(file: ast.FileNode) : Schema {
	const schema = new Schema();
	schema.map_ast(schema, file);

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



// ===== Struct =====

function build_struct(schema: Schema, node: ast.DeclareStructNode, comments: ast.CommentToken[]) : void {
	const struct = new Struct();
	schema.map_ast(struct, node);
	struct.comments = build_comments(comments);
	struct.name = schema.ref(node.name);
	struct.byte_aligned = node.struct_keyword.text === 'struct';

	if (node.params) {
		// TODO: params
	}

	const child_comments: ast.CommentToken[] = [ ];

	node.body.children.forEach((child) => {
		switch (child.type) {
			case ast.node_type.whitespace:
				// skip
				break;
	
			case ast.node_type.comment_line:
			case ast.node_type.comment_block:
				child_comments.push(child);
				break;
	
			case ast.node_type.struct_field:
				build_struct_field(schema, struct, child, child_comments.splice(0, child_comments.length));
				break;

			case ast.node_type.struct_expansion:
				build_struct_expansion(schema, struct, child, child_comments.splice(0, child_comments.length));
				break;
	
			default:
				throw new Error(`Invalid AST; encountered unexpected ${ast.node_type[(child as ast.ASTNode).type]} node as struct body child`);
		}
	});

	if (schema.add_elem(node.name, struct)) {
		if (node.name.text === '$') {
			schema.root = struct;
		}
	}
}

function build_struct_field(schema: Schema, struct: Struct, node: ast.StructField, comments: ast.CommentToken[]) : void {
	const field = new StructField();
	schema.map_ast(field, node);
	field.comments = build_comments(comments);
	field.name = schema.ref(node.field_name);

	if (node.optional_condition) {
		// TODO: condition
	}

	field.field_type = build_type_expr(schema, node.field_type);

	struct.add_field(schema, node.field_name, field);
}

function build_struct_expansion(schema: Schema, struct: Struct, node: ast.StructExpansion, comments: ast.CommentToken[]) : void {
	const expansion = new StructExpansion();
	schema.map_ast(expansion, node);
	expansion.comments = build_comments(comments);

	// TODO: expansion type

	struct.add_expansion(schema, expansion);
}



// ===== Enum =====

function build_enum(schema: Schema, node: ast.DeclareEnumNode, comments: ast.CommentToken[]) : void {
	const enum_node = new Enum();
	enum_node.comments = build_comments(comments);
	enum_node.name = schema.ref(node.name);
	enum_node.member_type = build_type_expr(schema, node.value_type);

	const child_comments: ast.CommentToken[] = [ ];

	node.body.children.forEach((child) => {
		switch (child.type) {
			case ast.node_type.whitespace:
				// skip
				break;
	
			case ast.node_type.comment_line:
			case ast.node_type.comment_block:
				child_comments.push(child);
				break;
	
			case ast.node_type.enum_member:
				build_enum_member(schema, enum_node, child, child_comments.splice(0, child_comments.length));
				break;
	
			default:
				throw new Error(`Invalid AST; encountered unexpected ${ast.node_type[(child as ast.ASTNode).type]} node as struct body child`);
		}
	});

	schema.add_elem(node.name, enum_node);
}

function build_enum_member(schema: Schema, enum_node: Enum, node: ast.EnumMember, comments: ast.CommentToken[]) : void {
	const member = new EnumMember();
	schema.map_ast(member, node);
	member.comments = build_comments(comments);

	// TODO: member value

	enum_node.add_member(schema, node.name, member);
}



// ===== Switch =====

function build_switch(schema: Schema, node: ast.DeclareSwitchNode, comments: ast.CommentToken[]) : void {
	const switch_node = new Switch();
	switch_node.comments = build_comments(comments);
	switch_node.name = schema.ref(node.name);

	// TODO: type
	// TODO: cases
	// TODO: default

	schema.add_elem(node.name, switch_node);
}



// ===== From =====

function build_from(schema: Schema, node: ast.DeclareFromNode, comments: ast.CommentToken[]) : void {
	const import_node = new Import();
	import_node.comments = build_comments(comments);
	import_node.source_expr = build_string_const(schema, node.source);

	schema.imports.push(import_node);

	if (node.root_import) {
		const imported = new ImportedSymbol();
		imported.from = import_node;
		imported.imported = schema.ref('$');
		imported.local = schema.ref(node.root_import);
		schema.map_ast(imported, node.root_import);

		schema.add_elem(node.root_import, imported);
	}

	else if (node.imports) {
		node.imports.imports.forEach((node) => {
			const name_node = node.alias_name || node.source_name;
			const imported = new ImportedSymbol();
			imported.from = import_node;
			imported.imported = schema.ref(node.source_name);
			imported.local = schema.ref(name_node);
			schema.map_ast(imported, node);
	
			schema.add_elem(name_node, imported);
		});
	}

	else {
		throw new Error(`Invalid AST; encountered from declaration with no imports`);
	}
}



// ===== Type Expressions =====

function build_type_expr(schema: Schema, node: ast.TypeExpr) : TypeExpr {
	switch (node.type) {
		case ast.node_type.type_expr_array: {
			const expr = new TypeExpr_array();
			expr.element_type = build_type_expr(schema, node.elem_type);
			// TODO: length type
			return expr;
		};

		case ast.node_type.type_expr_checksum: {
			const expr = new TypeExpr_checksum();
			// TODO: checksum....
			return expr;
		};

		case ast.node_type.type_expr_len: {
			// TODO: len...
			return null;
		};

		case ast.node_type.type_expr_named: {
			const expr = new TypeExpr_named();
			expr.name = schema.ref(node.name);
			// TODO: params
			return expr;
		};

		case ast.node_type.type_expr_named_refinement: {
			// 
			return null;
		};

		case ast.node_type.type_expr_struct_refinement: {
			// 
			return null;
		};

		case ast.node_type.type_expr_switch_refinement: {
			// 
			return null;
		};

		case ast.node_type.type_expr_text: {
			// 
			return null;
		};

		case ast.node_type.type_expr_vint: {
			// 
			return null;
		};
	}

	// 
	return null;
}



// ===== Other =====

function build_comments(comments: ast.CommentToken[]) : Comment[] {
	// TODO: build_comments
	return [ ];
}

function build_string_const(schema: Schema, node: ast.ConstToken_ascii | ast.ConstToken_unicode) : ConstString {
	const string = new ConstString();
	string.unicode = node.type === ast.node_type.const_unicode;
	string.value = node.text.slice(1, -1);

	const ascii_escape = /\\(?:\\|n|r|t|b|0|x[0-9a-fA-F]{2})/g;
	const unicode_escape = /\\(?:\\|n|r|t|b|0|x[0-9a-fA-F]{2}|u\{[0-9a-fA-F]{2,5}\})/g;

	if (string.unicode) {
		string.value = string.value.replace(unicode_escape, (match: string) : string => {
			switch (match[1]) {
				case '\\': return '\\';
				case 'n': return '\n';
				case 'r': return '\r';
				case 't': return '\t';
				case 'b': return '\b';
				case '0': return '\0';
				case 'x': {
					const byte = parseInt(match.slice(2), 16);
					return String.fromCharCode(byte);
				};
				case 'u': {
					const code_point = parseInt(match.slice(3, -1), 16);
					return String.fromCodePoint(code_point);
				};
			}
		});
	}

	else {
		string.value = string.value.replace(ascii_escape, (match: string) : string => {
			switch (match[1]) {
				case '\\': return '\\';
				case 'n': return '\n';
				case 'r': return '\r';
				case 't': return '\t';
				case 'b': return '\b';
				case '0': return '\0';
				case 'x': {
					const byte = parseInt(match.slice(2), 16);
					return String.fromCharCode(byte);
				};
			}
		});
	}

	schema.map_ast(string, node);
	return string;
}

function build_int_const(schema: Schema, node: ast.ConstToken_int | ast.ConstToken_hex_int) : ConstInt {
	const int = new ConstInt();
	// TODO: Big int handling
	// TODO: Verify if this works in all other cases
	int.value = node.type === ast.node_type.const_int
		? parseInt(node.text, 10)
		: parseInt(node.text.slice(2), 16);
	schema.map_ast(int, node);
	return int;
}
