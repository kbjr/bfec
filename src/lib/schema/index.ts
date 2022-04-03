
import assert = require('assert');
import { ast } from '../parser';
import { linker as log } from '../log';
import { Enum, EnumMember, EnumMemberType, is_enum } from './enum';
import { Switch, SwitchCase, switch_case_type } from './switch';
import { Struct, StructExpansion, StructExpansionType, StructField, StructParam } from './struct';
import { ConstInt, ConstString } from './const';
import { Import } from './import';
import { build_comments } from './comment';
import {
	TypeExpr,
	len_type,
	TypeExpr_array,
	TypeExpr_checksum, TypeExpr_length,
	TypeExpr_named, TypeExpr_named_refine,
	TypeExpr_struct_refine,
	TypeExpr_switch_refine,
	TypeExpr_text,
	TypeExpr_varint,
	TypeExpr_fixed_int,
	TypeExpr_float,
	text_enc,
	is_type_expr_named,
} from './type-expr';
import { BoolExpr, bool_expr_op_compare, bool_expr_op_logical, BoolExpr_comparison, BoolExpr_logical } from './bool-expr';
import { builtin_text } from '../parser/ast/tokens';
import { Schema } from './schema';
import { fully_resolve, ImportedRef, is_named_ref, NamedParentRefable, NamedRef, Ref, RootRef, SelfRef } from './ref';
import { BuildError, build_error_factory } from '../error';

export * from './bool-expr';
export * from './comment';
export * from './const';
export * from './enum';
export * from './import';
export * from './node';
export * from './ref';
export * from './schema';
export * from './struct';
export * from './switch';
export * from './type-expr';

export function build_schema_from_ast(file: ast.FileNode, include_source_maps: boolean = false, root_schema?: Schema) : Schema {
	const errors: BuildError[] = [ ];
	const schema = new Schema(file.source, include_source_maps);
	schema.error = build_error_factory(errors, schema);
	schema.map_ast(schema, file);

	const comments: ast.CommentToken[] = [ ];

	for (const node of file.children) {
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
				schema.error(node, `Invalid AST; encountered unexpected ${ast.node_type[(node as ast.ASTNode).type]} node as file node child`);
				break;
		}
	}
	
	return schema;
}



// ===== Struct =====

function build_struct(schema: Schema, node: ast.DeclareStructNode, comments: ast.CommentToken[]) : void {
	const struct = new Struct();
	schema.map_ast(struct, node);
	struct.comments = build_comments(comments);
	struct.name = node.name;
	struct.byte_aligned = node.struct_keyword.text === 'struct';

	if (node.params) {
		struct.params.push(
			...node.params.params.map((param) => build_struct_param(schema, param))
		);
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
				schema.error(child, `Invalid AST; encountered unexpected ${ast.node_type[(child as ast.ASTNode).type]} node as struct body child`);
				break;
		}
	});

	if (schema.map_elem(node.name, struct)) {
		schema.structs.push(struct);
		if (node.name.type === ast.node_type.name_root_schema) {
			schema.root = struct;
		}
	}
}

function build_struct_param(schema: Schema, node: ast.StructParamNode) : StructParam {
	const param = new StructParam();
	schema.map_ast(param, node);
	param.name = node.name;
	param.param_type = build_type_expr(schema, node.param_type);
	return param;
}

function build_struct_field(schema: Schema, struct: Struct, node: ast.StructField, comments: ast.CommentToken[]) : void {
	const field = new StructField();
	schema.map_ast(field, node);
	field.comments = build_comments(comments);
	field.name = node.field_name;

	if (node.optional_condition) {
		field.condition = build_bool_expr(schema, node.optional_condition.condition);
	}

	switch (node.field_type.type) {
		case ast.node_type.type_expr_array:
		case ast.node_type.type_expr_checksum:
		case ast.node_type.type_expr_len:
		case ast.node_type.type_expr_named:
		case ast.node_type.type_expr_named_refinement:
		case ast.node_type.type_expr_struct_refinement:
		case ast.node_type.type_expr_switch_refinement:
		case ast.node_type.type_expr_text:
		case ast.node_type.type_expr_vint:
		case ast.node_type.name_builtin_uint:
		case ast.node_type.name_builtin_sint:
		case ast.node_type.name_builtin_bit:
		case ast.node_type.name_builtin_dec_float:
		case ast.node_type.name_builtin_bin_float:
			field.field_type = build_type_expr(schema, node.field_type);
			break;

		case ast.node_type.const_int:
		case ast.node_type.const_hex_int:
			field.field_type = build_int_const(schema, node.field_type);
			break;

		case ast.node_type.const_ascii:
			field.field_type = build_string_const(schema, node.field_type);
			break;

		default:
			schema.error(node.field_type, 'Invalid AST: encounted unexpected node in place of struct field type');
			break;
	}

	if (node.optional_value) {
		field.field_value = build_value_expr_path(node.optional_value) as NamedRef;
	}

	struct.add_field(node.field_name, field);
}

function build_struct_expansion(schema: Schema, struct: Struct, node: ast.StructExpansion, comments: ast.CommentToken[]) : void {
	const expansion = new StructExpansion();
	schema.map_ast(expansion, node);
	expansion.comments = build_comments(comments);
	expansion.expanded_type = build_type_expr(schema, node.expanded_type) as StructExpansionType;
	struct.add_expansion(expansion);
}



// ===== Enum =====

function build_enum(schema: Schema, node: ast.DeclareEnumNode, comments: ast.CommentToken[]) : void {
	const enum_node = new Enum();
	enum_node.parent_schema = schema;
	enum_node.comments = build_comments(comments);
	enum_node.name = node.name;

	const member_type = build_type_expr(schema, node.value_type);

	// TODO: Validate member type must be built-in

	enum_node.member_type = member_type as EnumMemberType;

	const child_comments: ast.CommentToken[] = [ ];

	for (const child of node.body.children) {
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
				log.debug('encountered unexpected node as struct body child', child);
				schema.error(child, 'Invalid AST: encountered unexpected node as struct body child');
				break;
		}
	}

	schema.map_ast(enum_node, node);
	schema.map_elem(node.name, enum_node);
	schema.enums.push(enum_node);
}

function build_enum_member(schema: Schema, enum_node: Enum, node: ast.EnumMember, comments: ast.CommentToken[]) : void {
	const member = new EnumMember();
	schema.map_ast(member, node);
	member.comments = build_comments(comments);
	member.name = node.name;
	member.value = build_const(schema, node.value_expr);
	enum_node.add_member(node.name, member);
}



// ===== Switch =====

function build_switch(schema: Schema, node: ast.DeclareSwitchNode, comments: ast.CommentToken[]) : void {
	const switch_node = new Switch();
	switch_node.comments = build_comments(comments);
	switch_node.name = node.name;

	const arg_type = build_type_expr(schema, node.param.param_type);

	if (is_type_expr_named(arg_type)) {
		if (is_named_ref(arg_type.name)) {
			if (arg_type.params && arg_type.params.length) {
				schema.error(arg_type.params[0], 'Unexpected parameters for enum type expr');
			}

			else {
				switch_node.arg_type = arg_type.name as NamedRef<Enum>;
			}
		}

		else {
			schema.error(arg_type, 'Expected switch arg type to be a named type expr');
		}
	}

	else {
		schema.error(arg_type, 'Expected switch arg type to be a named type expr');
	}

	const child_comments: ast.CommentToken[] = [ ];

	for (const child of node.body.children) {
		switch (child.type) {
			case ast.node_type.whitespace:
				// skip
				break;
	
			case ast.node_type.comment_line:
			case ast.node_type.comment_block:
				child_comments.push(child);
				break;
	
			case ast.node_type.switch_case:
				build_switch_case(schema, switch_node, child, child_comments.splice(0, child_comments.length));
				break;

			case ast.node_type.switch_default:
				build_switch_default(schema, switch_node, child, child_comments.splice(0, child_comments.length));
				break;
	
			default:
				log.debug('encountered unexpected node as switch body child', child);
				schema.error(child, `Invalid AST; encountered unexpected ${ast.node_type[(child as ast.ASTNode).type]} node as struct body child`);
				break;
		}
	}

	schema.map_ast(switch_node, node);
	schema.map_elem(node.name, switch_node);
	schema.switches.push(switch_node);
}

function build_switch_case(schema: Schema, switch_node: Switch, node: ast.SwitchCase, comments: ast.CommentToken[]) : void {
	const case_node = new SwitchCase();
	schema.map_ast(case_node, node);
	case_node.comments = build_comments(comments);
	case_node.case_value = NamedRef.from_name(node.condition_name);
	schema.map_ast(case_node.case_value, node.condition_name);

	switch (node.selection.type) {
		case ast.node_type.kw_invalid:
			case_node.case_type = switch_case_type.invalid;
			break;

		case ast.node_type.kw_void:
			case_node.case_type = switch_case_type.void;
			break;

		default:
			case_node.case_type = switch_case_type.type_expr;
			case_node.case_type_expr = build_type_expr(schema, node.selection);
			break;
	}

	switch_node.cases.push(case_node);
}

function build_switch_default(schema: Schema, switch_node: Switch, node: ast.SwitchDefault, comments: ast.CommentToken[]) : void {
	const case_node = new SwitchCase();
	schema.map_ast(case_node, node);
	case_node.comments = build_comments(comments);

	if (switch_node.default) {
		schema.error(node, 'Encountered more then one `default` case for `switch` declaration');
	}

	switch (node.selection.type) {
		case ast.node_type.kw_invalid:
			case_node.case_type = switch_case_type.invalid;
			break;

		case ast.node_type.kw_void:
			case_node.case_type = switch_case_type.void;
			break;

		default:
			case_node.case_type = switch_case_type.type_expr;
			case_node.case_type_expr = build_type_expr(schema, node.selection);
			break;
	}

	switch_node.default = case_node;
}



// ===== From =====

function build_from(schema: Schema, node: ast.DeclareFromNode, comments: ast.CommentToken[]) : void {
	const import_node = new Import();
	import_node.comments = build_comments(comments);
	import_node.source_expr = build_string_const(schema, node.source);

	schema.imports.push(import_node);

	if (node.root_import) {
		const imported = ImportedRef.from_root_import(import_node, node);
		schema.map_ast(imported, node.root_import);
		schema.imported_refs.push(imported);
		schema.map_elem(node.root_import, imported);
	}

	else {
		assert(node.imports, 'Expected DeclareFromNode to have an import list');

		for (const imported_node of node.imports.imports) {
			const imported = ImportedRef.from_imported(import_node, imported_node);
			schema.map_ast(imported, node);
			schema.imported_refs.push(imported);
			schema.map_elem(imported.local_token, imported);
		}
	}
}



// ===== Type Expressions =====

function build_type_expr(schema: Schema, node: ast.TypeExpr) : TypeExpr {
	switch (node.type) {
		case ast.node_type.type_expr_array: 
			return build_type_expr_array(schema, node);

		case ast.node_type.type_expr_checksum:
			return build_type_expr_checksum(schema, node);

		case ast.node_type.type_expr_len:
			return build_type_expr_len(schema, node);

		case ast.node_type.type_expr_named:
			return build_type_expr_named(schema, node);

		case ast.node_type.type_expr_named_refinement:
			return build_type_expr_named_refinement(schema, node);

		case ast.node_type.type_expr_struct_refinement:
			return build_type_expr_struct_refinement(schema, node);

		case ast.node_type.type_expr_switch_refinement:
			return build_type_expr_switch_refinement(schema, node);

		case ast.node_type.type_expr_text:
			return build_type_expr_text(schema, node);

		case ast.node_type.type_expr_vint:
			return build_type_expr_vint(schema, node);

		case ast.node_type.name_builtin_uint:
		case ast.node_type.name_builtin_sint:
		case ast.node_type.name_builtin_bit:
			return build_type_expr_fixed_int(schema, node);

		case ast.node_type.name_builtin_dec_float:
		case ast.node_type.name_builtin_bin_float:
			return build_type_expr_float(schema, node);
	}

	log.debug('Invalid node passed to build_type_expr', node);
	schema.error(node, `Invalid AST: encountered unexpected node when expecting type expression`);
	return null;
}

const parse_int_type = /^(u|i|b)([0-9]+)(_be|_le)?/;

function build_type_expr_fixed_int(schema: Schema, node: ast.TypeExpr_builtin_fixed_int) : TypeExpr_fixed_int {
	const expr = new TypeExpr_fixed_int();
	schema.map_ast(expr, node);
	expr.name = node.text;

	const int_info = parse_int_type.exec(node.text);

	if (! int_info) {
		log.debug('Invalid node passed to build_type_expr_fixed_int', node);
		schema.error(node, `Unknown fixed int type`);
	}
	
	else {
		expr.big_endian = int_info[3] === '_be';
		expr.size_bits = parseInt(int_info[2], 10);
		expr.signed = int_info[1] === 'i';
	}

	return expr;
}

const parse_float_type = /^(f|d)([0-9]+)/;

function build_type_expr_float(schema: Schema, node: ast.Type_expr_builtin_float) : TypeExpr_float {
	const expr = new TypeExpr_float();
	schema.map_ast(expr, node);
	expr.name = node.text;

	const float_info = parse_float_type.exec(node.text);

	if (! float_info) {
		log.debug('Invalid node passed to build_type_expr_float', node);
		schema.error(node, `Unknown float type`);
	}

	else {
		expr.size_bits = parseInt(float_info[2], 10);
		expr.decimal = float_info[1] === 'd';
	}

	return null;
}

function build_type_expr_array(schema: Schema, node: ast.TypeExpr_array) : TypeExpr_array {
	const expr = new TypeExpr_array();
	schema.map_ast(expr, node);
	expr.element_type = build_type_expr(schema, node.elem_type);

	switch (node.length_type.type) {
		case ast.node_type.kw_null:
			expr.length_type = len_type.null_terminated;
			break;

		case ast.node_type.op_expansion:
			expr.length_type = len_type.take_remaining;
			break;

		case ast.node_type.const_int:
		case ast.node_type.const_hex_int:
			expr.length_type = len_type.static_length;
			expr.static_length = build_int_const(schema, node.length_type);
			break;

		case ast.node_type.value_expr_path:
			expr.length_type = len_type.length_field;
			expr.length_field = build_value_expr_path(node.length_type) as NamedRef<StructField<TypeExpr_length>>;
			break;

		case ast.node_type.name_builtin_uint:
		case ast.node_type.name_builtin_sint:
		case ast.node_type.name_builtin_bit:
			expr.length_type = len_type.length_prefix;
			expr.length_prefix = build_type_expr_fixed_int(schema, node.length_type);
			break;

		case ast.node_type.type_expr_vint:
			expr.length_type = len_type.length_prefix;
			expr.length_prefix = build_type_expr_vint(schema, node.length_type);
			break;
	}

	return expr;
}

function build_type_expr_checksum(schema: Schema, node: ast.TypeExpr_builtin_checksum) : TypeExpr_checksum {
	const expr = new TypeExpr_checksum();
	schema.map_ast(expr, node);
	expr.real_type = build_type_expr(schema, node.real_type);
	expr.data_expr = build_value_expr_path(node.data_expr) as NamedRef<StructField>;
	expr.func_name = build_string_const(schema, node.checksum_func);
	return expr;
}

function build_type_expr_len(schema: Schema, node: ast.TypeExpr_builtin_len) : TypeExpr_length {
	const expr = new TypeExpr_length();
	schema.map_ast(expr, node);
	const real_type = build_type_expr(schema, node.real_type);

	if (is_non_static_int(real_type)) {
		expr.real_type = real_type;
	}

	else {
		schema.error(real_type, 'Expected `len<real_type>` to have an integer type expr for `real_type`');
	}

	return expr;
}

function build_type_expr_named(schema: Schema, node: ast.TypeExpr_named) : TypeExpr_named {
	const expr = new TypeExpr_named();
	schema.map_ast(expr, node);
	expr.name = node.name.type === ast.node_type.name_root_schema
		? RootRef.from_name(node.name)
		: NamedRef.from_name(node.name);

	if (node.params) {
		expr.params.push(
			...node.params.params.map((param) => build_value_expr_path(param.param))
		);
	}

	return expr;
}

function build_type_expr_named_refinement(schema: Schema, node: ast.TypeExpr_named_refinement) : TypeExpr_named_refine {
	const expr = new TypeExpr_named_refine();
	schema.map_ast(expr, node);
	expr.parent_type = build_type_expr(schema, node.parent_type);
	expr.refined_type = build_type_expr_named(schema, node.refined_type);
	return expr;
}

function build_type_expr_struct_refinement(schema: Schema, node: ast.TypeExpr_struct_refinement) : TypeExpr_struct_refine {
	const expr = new TypeExpr_struct_refine();
	schema.map_ast(expr, node);
	expr.parent_type = build_type_expr(schema, node.parent_type);
	// TODO:
	// expr.refined_type = build_struct_inline();
	return expr;
}

function build_type_expr_switch_refinement(schema: Schema, node: ast.TypeExpr_switch_refinement) : TypeExpr_switch_refine {
	const expr = new TypeExpr_switch_refine();
	schema.map_ast(expr, node);
	expr.parent_type = build_type_expr(schema, node.parent_type);
	// TODO:
	// expr.refined_type = build_switch_inline();
	return expr;
}

function build_type_expr_text(schema: Schema, node: ast.TypeExpr_builtin_text) : TypeExpr_text {
	const expr = new TypeExpr_text();
	schema.map_ast(expr, node);

	expr.encoding = text_encoding(node);

	switch (node.length_type.type) {
		case ast.node_type.kw_null:
			expr.length_type = len_type.null_terminated;
			break;

		case ast.node_type.op_expansion:
			expr.length_type = len_type.take_remaining;
			break;

		case ast.node_type.const_int:
		case ast.node_type.const_hex_int:
			expr.length_type = len_type.static_length;
			expr.static_length = build_int_const(schema, node.length_type);
			break;

		// case ast.node_type.value_expr_path:
		// 	expr.length_type = LengthType.length_field;
		// 	expr.length_field = build_value_expr_path(node.length_type) as NamedRef<StructField<TypeExpr_length>>;
		// 	break;

		case ast.node_type.name_builtin_uint:
		case ast.node_type.name_builtin_sint:
		case ast.node_type.name_builtin_bit:
			expr.length_type = len_type.length_prefix;
			expr.length_prefix = build_type_expr_fixed_int(schema, node.length_type);
			break;

		case ast.node_type.type_expr_vint:
			expr.length_type = len_type.length_prefix;
			expr.length_prefix = build_type_expr_vint(schema, node.length_type);
			break;
	}

	return expr;
}

function text_encoding(node: ast.TypeExpr_builtin_text) {
	switch (node.text_keyword.text) {
		case builtin_text.ascii: return text_enc.ascii;
		case builtin_text.utf8: return text_enc.utf8;
		case builtin_text.utf16: return text_enc.utf16;
		case builtin_text.utf32: return text_enc.utf32;
	}
}

function build_type_expr_vint(schema: Schema, node: ast.TypeExpr_builtin_vint) : TypeExpr_varint {
	const expr = new TypeExpr_varint();
	schema.map_ast(expr, node);
	const real_type = build_type_expr(schema, node.real_type);

	if (is_fixed_int(real_type)) {
		expr.real_type = real_type;
	}
	
	else {
		schema.error(real_type, 'Expected `len<real_type>` to have an integer type expr for `real_type`');
	}

	return expr;
}

function is_fixed_int(node: TypeExpr) : node is TypeExpr_fixed_int {
	return node instanceof TypeExpr_fixed_int
}

function is_non_static_int(node: TypeExpr) : node is TypeExpr_fixed_int | TypeExpr_varint {
	return node instanceof TypeExpr_fixed_int || node instanceof TypeExpr_varint;
}



// ===== Value Expr =====

function build_value_expr_path(ast_node: ast.ValueExpr_path) : NamedRef | RootRef | SelfRef {
	let ref: NamedRef | RootRef | SelfRef;

	switch (ast_node.lh_name.type) {
		case ast.node_type.name_root_schema:
			ref = RootRef.from_name(ast_node.lh_name);
			break;

		case ast.node_type.name_this_schema:
			ref = SelfRef.from_name(ast_node.lh_name);
			break;

		case ast.node_type.name_normal:
			ref = NamedRef.from_name(ast_node.lh_name);
			break;
	}

	for (const access of ast_node.rh_names) {
		ref = NamedRef.from_name(access.field_name, ref as any as Ref<NamedParentRefable>);
	}

	return ref;
}



// ===== Bool Expr =====

function build_bool_expr(schema: Schema, ast_node: ast.BoolExpr) : BoolExpr {
	let is_not = false;
	let logical_op: bool_expr_op_logical;
	let comparison_op: bool_expr_op_compare;

	switch (ast_node.type) {
		case ast.node_type.bool_expr_not:
			is_not = true;
			logical_op = bool_expr_op_logical.not;
			break;

		case ast.node_type.bool_expr_and:
			logical_op = bool_expr_op_logical.not;
			break;

		case ast.node_type.bool_expr_or:
			logical_op = bool_expr_op_logical.or;
			break;

		case ast.node_type.bool_expr_xor:
			logical_op = bool_expr_op_logical.xor;
			break;

		case ast.node_type.bool_expr_eq:
			comparison_op = bool_expr_op_compare.eq;
			break;
			
		case ast.node_type.bool_expr_neq:
			comparison_op = bool_expr_op_compare.neq;
			break;

		default:
			log.debug('Invalid node passed to build_bool_expr', ast_node);
			schema.error(ast_node, `Invalid AST: encountered unexpected node when expecting bool expression`);
			return null;
	}

	if (logical_op) {
		const expr = new BoolExpr_logical();
		schema.map_ast(expr, ast_node);
		expr.operator = logical_op;

		if (is_not) {
			const node_ = ast_node as ast.BoolExpr_not;
			expr.lh_expr = build_bool_expr(schema, node_.expr);
			return expr;
		}
		
		const node = ast_node as ast.BoolExpr_and | ast.BoolExpr_or | ast.BoolExpr_xor;
		expr.lh_expr = build_bool_expr(schema, node.lh_expr);
		return expr;
	}

	const node = ast_node as ast.BoolExpr_eq | ast.BoolExpr_neq;
	const expr = new BoolExpr_comparison();
	schema.map_ast(expr, ast_node);
	expr.operator = comparison_op;
	expr.lh_expr = node.lh_expr.type === ast.node_type.value_expr_path
		? build_value_expr_path(node.lh_expr)
		: build_const(schema, node.lh_expr);
	expr.rh_expr = node.rh_expr.type === ast.node_type.value_expr_path
		? build_value_expr_path(node.rh_expr)
		: build_const(schema, node.rh_expr);
}




// ===== Other =====

function build_const(schema: Schema, node: ast.ConstToken_ascii | ast.ConstToken_unicode | ast.ConstToken_int | ast.ConstToken_hex_int) : ConstInt | ConstString {
	switch (node.type) {
		case ast.node_type.const_int:
		case ast.node_type.const_hex_int:
			return build_int_const(schema, node);

		case ast.node_type.const_ascii:
		case ast.node_type.const_unicode:
			return build_string_const(schema, node);

		default:
			log.debug('Invalid node passed to build_const', node);
			schema.error(node, `Invalid AST: encountered unexpected node when expecting const literal`);
	}
}

function build_string_const(schema: Schema, node: ast.ConstToken_ascii | ast.ConstToken_unicode) : ConstString {
	const string = ConstString.from_ast(node);
	schema.map_ast(string, node);
	return string;
}

function build_int_const(schema: Schema, node: ast.ConstToken_int | ast.ConstToken_hex_int) : ConstInt {
	const int = ConstInt.from_ast(node);
	schema.map_ast(int, node);
	return int;
}
