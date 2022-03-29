
import { ast } from '../parser';
import { Token } from '../parser/ast/tokens';
import { linker as log } from '../log';

export class BuildError {
	public line: number;
	public char: number;
	public text: string;

	constructor(
		public message: string,
		public node: ast.ASTNode
	) {
		[ this.line, this.char ] = node_pos(node);
	}
}

function node_pos(node: ast.ASTNode) {
	if (node instanceof Token) {
		return [ node.line + 1, node.char + 1 ];
	}

	switch (node.type) {
		// case ast.node_type.file:
		// 	return [0, 0];

		// case ast.node_type.decl_struct:
		// 	return [0, 0];

		// case ast.node_type.decl_enum:
		// 	return [0, 0];

		// case ast.node_type.decl_switch:
		// 	return [0, 0];

		// case ast.node_type.decl_from:
		// 	return [0, 0];

		// case ast.node_type.struct_params_list:
		// 	return [0, 0];

		// case ast.node_type.struct_param:
		// 	return [0, 0];

		// case ast.node_type.struct_expansion:
		// 	return [0, 0];

		// case ast.node_type.struct_body:
		// 	return [0, 0];

		// case ast.node_type.struct_field:
		// 	return [0, 0];

		// case ast.node_type.struct_field_optional_condition:
		// 	return [0, 0];

		// case ast.node_type.enum_body:
		// 	return [0, 0];

		// case ast.node_type.enum_member:
		// 	return [0, 0];

		// case ast.node_type.switch_param:
		// 	return [0, 0];

		// case ast.node_type.switch_body:
		// 	return [0, 0];

		// case ast.node_type.switch_case:
		// 	return [0, 0];

		// case ast.node_type.switch_default:
		// 	return [0, 0];

		// case ast.node_type.imports_list:
		// 	return [0, 0];

		// case ast.node_type.from_import:
		// 	return [0, 0];

		// case ast.node_type.type_expr_vint:
		// 	return [0, 0];

		// case ast.node_type.type_expr_len:
		// 	return [0, 0];

		// case ast.node_type.type_expr_array:
		// 	return [0, 0];

		// case ast.node_type.type_expr_struct_refinement:
		// 	return [0, 0];

		// case ast.node_type.type_expr_switch_refinement:
		// 	return [0, 0];

		// case ast.node_type.type_expr_named_refinement:
		// 	return [0, 0];

		// case ast.node_type.type_expr_named:
		// 	return [0, 0];

		// case ast.node_type.type_expr_text:
		// 	return [0, 0];

		// case ast.node_type.type_expr_checksum:
		// 	return [0, 0];

		// case ast.node_type.type_expr_params_list:
		// 	return [0, 0];

		// case ast.node_type.type_expr_param:
		// 	return [0, 0];

		// case ast.node_type.value_expr_path:
		// 	return [0, 0];

		// case ast.node_type.value_expr_path_access:
		// 	return [0, 0];

		// case ast.node_type.bool_expr_eq:
		// 	return [0, 0];

		// case ast.node_type.bool_expr_neq:
		// 	return [0, 0];

		// case ast.node_type.bool_expr_and:
		// 	return [0, 0];

		// case ast.node_type.bool_expr_or:
		// 	return [0, 0];

		// case ast.node_type.bool_expr_xor:
		// 	return [0, 0];

		// case ast.node_type.bool_expr_not:
		// 	return [0, 0];

		default:
			log.error('BuildError: unknown AST node', node);
			return [0, 0];
	}
}
