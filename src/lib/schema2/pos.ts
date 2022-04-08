
import { ast } from '../parser';

export interface Position {
	line: number;
	char: number;
}

export interface PositionRange {
	start: Position;
	end: Position;
}

export function pos(start: ast.Token, end: ast.Token = start) : PositionRange {
	return {
		start: {
			line: start.line,
			char: start.char
		},
		end: {
			line: end.line,
			char: end.char + end.length
		}
	};
}

export function pos_for_value_expr(expr: ast.ValueExpr_path) {
	if (expr.rh_names.length) {
		return pos(expr.lh_name, expr.rh_names[expr.rh_names.length - 1].field_name);
	}

	return pos(expr.lh_name);
}

export function pos_for_type_expr(expr: ast.TypeExpr) {
	switch (expr.type) {
		case ast.node_type.const_int:
		case ast.node_type.const_hex_int:
		case ast.node_type.const_ascii:
		case ast.node_type.const_unicode:
		case ast.node_type.name_builtin_bit:
		case ast.node_type.name_builtin_uint:
		case ast.node_type.name_builtin_sint:
		case ast.node_type.name_builtin_bin_float:
		case ast.node_type.name_builtin_dec_float:
			return pos(expr);

		case ast.node_type.type_expr_vint:
			return pos(expr.varint_keyword, expr.close_bracket);

		case ast.node_type.type_expr_len:
			return pos(expr.len_keyword, expr.close_bracket);
			
		case ast.node_type.type_expr_text:
			return pos(expr.text_keyword, expr.close_bracket);
			
		case ast.node_type.type_expr_checksum:
			return pos(expr.checksum_keyword, expr.close_bracket);
			
		case ast.node_type.type_expr_named:
			return pos(expr.name, expr.params ? expr.params.close_paren : expr.name);
			
		case ast.node_type.type_expr_array: {
			const start = pos_for_type_expr(expr.elem_type).start as any as ast.Token;
			return pos(start, expr.close_bracket);
		};
			
		case ast.node_type.type_expr_named_refinement: {
			const start = pos_for_type_expr(expr.parent_type).start as any as ast.Token;
			return pos(start, expr.refined_type.params ? expr.refined_type.params.close_paren : expr.refined_type.name);
		};
			
		case ast.node_type.type_expr_struct_refinement:{
			const start = pos_for_type_expr(expr.parent_type).start as any as ast.Token;
			return pos(start, expr.body.close_brace);
		};
			
		case ast.node_type.type_expr_switch_refinement:{
			const start = pos_for_type_expr(expr.parent_type).start as any as ast.Token;
			return pos(start, expr.body.close_brace);
		};
	}
}
