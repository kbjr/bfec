
import { ast } from '../parser';
import { Schema } from './schema';
import { build_comment, Comment } from './comment';
import { NamedStruct, Struct, StructExpansion, StructField } from './struct';
import { build_error_factory, BuildError, BuildErrorFactory } from '../error';
import { NamedSwitch, Switch, SwitchCase, SwitchDefault } from './switch';
import { Enum, EnumMember } from './enum';
import { Import } from './import';
import { ImportedRef } from './ref';
import { ConstInt, ConstString } from './const';
import { build_enum_type } from './field-type';

export function build_schema_from_ast(file: ast.FileNode, errors: BuildError[], root_schema?: Schema) {
	const schema = new Schema();
	const error = build_error_factory(errors, schema);
	schema.source = file;
	schema.root_schema = root_schema;
	
	const comments: Comment[] = [ ];
	const take_comments = () => comments.splice(0, comments.length);

	for (const node of file.children) {
		switch (node.type) {
			case ast.node_type.whitespace:
				// skip
				break;
	
			case ast.node_type.comment_line:
			case ast.node_type.comment_block:
				comments.push(build_comment(node));
				break;
	
			case ast.node_type.decl_struct: {
				const struct_node = build_struct(schema, node, take_comments(), error);
				schema.structs.push(struct_node);
				
				if (schema.symbols.has(struct_node.name)) {
					const duplicate = schema.symbols.get(struct_node.name);
					error(struct_node.name_token, `Duplicate identifier name "${struct_node.name}"`, duplicate.name_token);
					break;
				}

				schema.symbols.set(struct_node.name, struct_node);
				break;
			};
	
			case ast.node_type.decl_enum: {
				const enum_node = build_enum(schema, node, take_comments(), error);
				schema.enums.push(enum_node);
				
				if (schema.symbols.has(enum_node.name)) {
					const duplicate = schema.symbols.get(enum_node.name);
					error(enum_node.name_token, `Duplicate identifier name "${enum_node.name}"`, duplicate.name_token);
					break;
				}

				schema.symbols.set(enum_node.name, enum_node);
				break;
			}
	
			case ast.node_type.decl_switch: {
				const switch_node = build_switch(schema, node, take_comments(), error);
				schema.switches.push(switch_node);
				
				if (schema.symbols.has(switch_node.name)) {
					const duplicate = schema.symbols.get(switch_node.name);
					error(switch_node.name_token, `Duplicate identifier name "${switch_node.name}"`, duplicate.name_token);
					break;
				}

				schema.symbols.set(switch_node.name, switch_node);
				break;
			}
	
			case ast.node_type.decl_from: {
				const [ from, refs ] = build_from(node, take_comments(), error);
				schema.imports.push(from);
				schema.imported_refs.push(...refs);

				for (const ref of refs) {
					if (schema.symbols.has(ref.name)) {
						const duplicate = schema.symbols.get(ref.name);
						error(ref.name_token, `Duplicate identifier name "${ref.name}"`, duplicate.name_token);
						break;
					}
	
					schema.symbols.set(ref.name, ref);
				}
				break;
			}
	
			default:
				throw new Error(`Invalid AST; encountered unexpected ${ast.node_type[(node as ast.ASTNode).type]} node as file node child`);
		}
	}
	
	return schema;
}



// ===== Struct =====

function build_struct(schema: Schema, ast_node: ast.DeclareStructNode, comments: Comment[], error: BuildErrorFactory) {
	const node = new NamedStruct();
	node.ast_node = ast_node;
	node.comments = comments;
	node.parent = schema;

	build_struct_contents(node, ast_node.body, error);

	return node;
}

function build_struct_contents(node: Struct, ast_node: ast.StructBody, error: BuildErrorFactory) {
	node.fields = [ ];

	const child_comments: Comment[] = [ ];
	const take_comments = () => child_comments.splice(0, child_comments.length);

	for (const elem of ast_node.children) {
		switch (elem.type) {
			case ast.node_type.whitespace:
				// skip
				break;
	
			case ast.node_type.comment_line:
			case ast.node_type.comment_block:
				child_comments.push(build_comment(elem));
				break;

			case ast.node_type.struct_field: {
				const field_node = build_struct_field(node, elem, take_comments(), error);
				node.fields.push(field_node);
				
				if (node.symbols.has(field_node.name)) {
					const duplicate = node.symbols.get(field_node.name);
					error(field_node.name_token, `Duplicate field name "${field_node.name}"`, duplicate.name_token);
					break;
				}

				node.symbols.set(field_node.name, field_node);
				break;
			}

			case ast.node_type.struct_expansion: {
				const expansion_node = build_struct_expansion(node, elem, take_comments(), error);
				node.fields.push(expansion_node);
				break;
			}
	
			default:
				throw new Error(`Invalid AST; encountered unexpected ${ast.node_type[(elem as ast.ASTNode).type]} node as struct node child`);
		}
	}
}

function build_struct_field(struct: Struct, ast_node: ast.StructField, comments: Comment[], error: BuildErrorFactory) {
	const node = new StructField();
	node.ast_node = ast_node;
	node.comments = comments;
	node.parent = struct;

	return node;
}

function build_struct_expansion(struct: Struct, ast_node: ast.StructExpansion, comments: Comment[], error: BuildErrorFactory) {
	const node = new StructExpansion();
	node.ast_node = ast_node;
	node.comments = comments;
	node.parent = struct;

	return node;
}



// ===== Switch =====

function build_switch(schema: Schema, ast_node: ast.DeclareSwitchNode, comments: Comment[], error: BuildErrorFactory) {
	const node = new NamedSwitch();
	node.ast_node = ast_node;
	node.comments = comments;
	node.parent = schema;

	build_switch_contents(node, ast_node.body, error);

	return node;
}

function build_switch_contents(node: Switch, ast_node: ast.SwitchBody, error: BuildErrorFactory) {
	node.cases = [ ];

	const child_comments: Comment[] = [ ];
	const take_comments = () => child_comments.splice(0, child_comments.length);

	for (const elem of ast_node.children) {
		switch (elem.type) {
			case ast.node_type.whitespace:
				// skip
				break;
	
			case ast.node_type.comment_line:
			case ast.node_type.comment_block:
				child_comments.push(build_comment(elem));
				break;

			case ast.node_type.switch_case: {
				const case_node = build_switch_case(node, elem, take_comments(), error);
				node.cases.push(case_node);
				
				if (node.case_map.has(case_node.case_name)) {
					const duplicate = node.case_map.get(case_node.case_name);
					error(case_node.case_name_token, `Duplicate switch case for "${case_node.case_name}"`, duplicate.case_name_token);
					break;
				}

				node.case_map.set(case_node.case_name, case_node);
				break;
			}

			case ast.node_type.switch_default: {
				const default_node = build_switch_default(node, elem, take_comments(), error);

				if (node.default) {
					error(default_node, `Multiple default cases provided for switch`, node.default);
					break;
				}

				node.default = default_node;
				break;
			}
		}
	}
}

function build_switch_case(switch_node: Switch, ast_node: ast.SwitchCase, comments: Comment[], error: BuildErrorFactory) {
	const node = new SwitchCase();
	node.ast_node = ast_node;
	node.comments = comments;
	node.parent = switch_node;
	return node;
}

function build_switch_default(switch_node: Switch, ast_node: ast.SwitchDefault, comments: Comment[], error: BuildErrorFactory) {
	const node = new SwitchDefault();
	node.ast_node = ast_node;
	node.comments = comments;
	node.parent = switch_node;
	return node;
}



// ===== Enum =====

function build_enum(schema: Schema, ast_node: ast.DeclareEnumNode, comments: Comment[], error: BuildErrorFactory) {
	const node = new Enum();
	node.ast_node = ast_node;
	node.comments = comments;
	node.parent = schema;
	node.member_type = build_enum_type(ast_node.value_type, error);

	build_enum_contents(node, ast_node.body, error);

	return node;
}

function build_enum_contents(node: Enum, ast_node: ast.EnumBody, error: BuildErrorFactory) {
	node.members = [ ];

	const child_comments: Comment[] = [ ];
	const take_comments = () => child_comments.splice(0, child_comments.length);

	for (const elem of ast_node.children) {
		switch (elem.type) {
			case ast.node_type.whitespace:
				// skip
				break;
	
			case ast.node_type.comment_line:
			case ast.node_type.comment_block:
				child_comments.push(build_comment(elem));
				break;

			case ast.node_type.enum_member: {
				const member_node = build_enum_member(node, elem, take_comments(), error);
				node.members.push(member_node);
				
				if (node.symbols.has(member_node.name)) {
					const duplicate = node.symbols.get(member_node.name);
					error(member_node.name_token, `Duplicate enum member name "${member_node.name}"`, duplicate.name_token);
					break;
				}

				node.symbols.set(member_node.name, member_node);
				break;
			}
		}
	}
}

function build_enum_member(enum_node: Enum, ast_node: ast.EnumMember, comments: Comment[], error: BuildErrorFactory) {
	const node = new EnumMember();
	node.ast_node = ast_node;
	node.comments = comments;
	node.parent = enum_node;
	node.value = build_const(ast_node.value_expr);
	return node;
}



// ===== From =====

function build_from(ast_node: ast.DeclareFromNode, comments: Comment[], error: BuildErrorFactory) : [ Import, ImportedRef[] ] {
	const import_node = new Import();
	import_node.ast_node = ast_node;
	import_node.comments = comments;
	import_node.source = ConstString.from_ast(ast_node.source);

	const imported: ImportedRef[] = [ ];

	if (ast_node.root_import) {
		error(import_node, 'Root imports not implemented');
	}

	else {
		for (const node of ast_node.imports.imports) {
			const ref = new ImportedRef();
			ref.ast_node = node;
			ref.from = import_node;
			imported.push(ref);
		}
	}

	return [ import_node, imported ];
}



// ===== Const Expr =====

function build_const(expr: ast.ConstExpr) {
	switch (expr.type) {
		case ast.node_type.const_ascii:
		case ast.node_type.const_unicode:
			return ConstString.from_ast(expr);
			
		case ast.node_type.const_int:
		case ast.node_type.const_hex_int:
			return ConstInt.from_ast(expr);
	}
}

