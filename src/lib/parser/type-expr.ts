
import { ParserState } from './state';
import { TypeExpr, TypeExpr_array, TypeExpr_bin, TypeExpr_builtin_vint, TypeExpr_int, TypeExpr_named } from './ast';
import {
	name_builtin_bit, name_builtin_sint, name_builtin_uint,
	const_int, const_hex_int, const_ascii,
	punc_open_square_bracket, punc_close_square_bracket,
	name_builtin_vint,
	punc_open_paren, punc_close_paren,
	name_builtin_bin_float, name_builtin_dec_float, name_builtin_text,
	name_normal
} from './ast/tokens';

export function parse_type_expr(state: ParserState) : TypeExpr {
	state.trace('parse_type_expr');

	const ascii = const_ascii.match(state);

	if (ascii) {
		return ascii;
	}

	const fixed_int = parse_type_expr_fixed_int(state);

	if (fixed_int) {
		// TODO: optional bin expansion
		// TODO: optional array(s)

		return fixed_int;
	}

	const varint = parse_type_expr_varint(state);

	if (varint) {
		// TODO: optional array(s)

		return varint;
	}

	const other_builtin = name_builtin_bin_float.match(state) || name_builtin_dec_float.match(state) || name_builtin_text.match(state);

	if (other_builtin) {
		// TODO: optional array(s)

		return other_builtin;
	}

	const other_named = name_normal.match(state);

	if (other_named) {
		const ast_node = new TypeExpr_named();
		ast_node.name = other_named;

		// TODO: optional params
		// TODO: optional array(s)

		return ast_node;
	}

	return null;
}

function parse_type_expr_varint(state: ParserState) : TypeExpr_builtin_vint {
	state.trace('parse_type_expr_array');
	state.scan_through_comments_and_whitespace();

	const varint_keyword = name_builtin_vint.match(state);

	if (! varint_keyword) {
		return null;
	}

	const ast_node = new TypeExpr_builtin_vint();
	ast_node.varint_keyword = varint_keyword;
	
	state.scan_through_comments_and_whitespace();
	ast_node.open_paren = punc_open_paren.match(state);

	if (! ast_node.open_paren) {
		state.fatal('expected opening paren "(" to preceed varint real type');
	}
	
	state.scan_through_comments_and_whitespace();
	ast_node.real_type = parse_type_expr_fixed_int(state);

	if (! ast_node.real_type) {
		state.fatal('expected a fixed int type expr for varint real type');
	}
	
	state.scan_through_comments_and_whitespace();
	ast_node.close_paren = punc_close_paren.match(state);

	if (! ast_node.close_paren) {
		state.fatal('expected closing paren ")" after varint real type');
	}

	return null;
}

function parse_type_expr_array(state: ParserState, lh_expr: TypeExpr) : TypeExpr_array {
	state.trace('parse_type_expr_array');
	state.scan_through_comments_and_whitespace();

	const open_bracket = punc_open_square_bracket.match(state);

	if (! open_bracket) {
		return null;
	}

	const ast_node = new TypeExpr_array();
	ast_node.open_bracket = open_bracket;
	ast_node.elem_type = lh_expr;
	
	state.scan_through_comments_and_whitespace();
	ast_node.length_type = parse_type_expr_fixed_int(state) || parse_type_expr_varint(state);

	if (! ast_node.length_type) {
		state.fatal('expected array length type definition between square brackets "[" / "]"');
	}
	
	state.scan_through_comments_and_whitespace();
	ast_node.close_bracket = punc_close_square_bracket.match(state);

	if (! ast_node.close_bracket) {
		state.fatal('expected closing square bracket "]" at end of array type expr');
	}

	ast_node.extraneous_comments = state.take_comments();
	return ast_node;
}

function parse_type_expr_bin(state: ParserState, lh_expr: TypeExpr) : TypeExpr_bin {
	state.trace('parse_type_expr_bin');
	// TODO: parse_type_expr_bin
	return null;
}

function parse_type_expr_fixed_int(state: ParserState) : TypeExpr_int {
	state.trace('parse_type_expr_fixed_int');
	return const_hex_int.match(state) || const_int.match(state) || name_builtin_uint.match(state) || name_builtin_sint.match(state) || name_builtin_bit.match(state);
}
