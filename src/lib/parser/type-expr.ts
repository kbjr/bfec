
import { ParserState } from './state';
import { TypeExpr, TypeExpr_array, TypeExpr_bin, TypeExpr_builtin_checksum, TypeExpr_builtin_len, TypeExpr_builtin_text, TypeExpr_builtin_vint, TypeExpr_int, TypeExpr_named } from './ast';
import {
	name_builtin_bit, name_builtin_sint, name_builtin_uint,
	const_int, const_hex_int, const_ascii,
	punc_open_square_bracket, punc_close_square_bracket,
	name_builtin_vint,
	punc_open_paren, punc_close_paren,
	name_builtin_bin_float, name_builtin_dec_float, name_builtin_text,
	name_normal,
	punc_open_angle_bracket,
	punc_close_angle_bracket,
	name_builtin_len,
	name_builtin_checksum,
	op_expansion,
	NameToken_normal
} from './ast/tokens';

export function parse_type_expr(state: ParserState) : TypeExpr {
	state.trace('parse_type_expr');

	const ascii = const_ascii.match(state);

	if (ascii) {
		return ascii;
	}

	const fixed_int = parse_type_expr_fixed_int(state);

	if (fixed_int) {
		let lh_expr = parse_optional_arrays(state, fixed_int);

		// TODO: optional struct/bin/switch/named refinement

		return lh_expr;
	}

	const varint = parse_type_expr_varint(state);

	if (varint) {
		return parse_optional_arrays(state, varint);
	}

	const len = parse_type_expr_len(state);

	if (len) {
		return len;
	}

	const text = parse_type_expr_text(state);
	
	if (text) {
		return parse_optional_arrays(state, text);
	}

	const float = name_builtin_bin_float.match(state) || name_builtin_dec_float.match(state);

	if (float) {
		return parse_optional_arrays(state, float);
	}

	const checksum = parse_type_expr_checksum(state);

	if (checksum) {
		return checksum;
	}

	const other_named = parse_type_expr_named(state);

	if (other_named) {
		return parse_optional_arrays(state, other_named);
	}

	return null;
}

function parse_optional_arrays(state: ParserState, lh_expr: TypeExpr) : TypeExpr {
	while (true) {
		const array = parse_type_expr_array(state, lh_expr);

		if (! array) {
			return lh_expr;
		}

		lh_expr = array;
	}
}

function parse_type_expr_varint(state: ParserState) : TypeExpr_builtin_vint {
	state.trace('parse_type_expr_varint');
	state.scan_through_comments_and_whitespace();

	const varint_keyword = name_builtin_vint.match(state);

	if (! varint_keyword) {
		return null;
	}

	const ast_node = new TypeExpr_builtin_vint();
	ast_node.varint_keyword = varint_keyword;
	
	state.scan_through_comments_and_whitespace();
	ast_node.open_bracket = punc_open_angle_bracket.match(state);

	if (! ast_node.open_bracket) {
		state.fatal('expected opening bracket "<" to preceed varint real type');
	}
	
	state.scan_through_comments_and_whitespace();
	ast_node.real_type = parse_type_expr_fixed_int(state);

	if (! ast_node.real_type) {
		state.fatal('expected a fixed int type expr for varint real type');
	}
	
	state.scan_through_comments_and_whitespace();
	ast_node.close_bracket = punc_close_angle_bracket.match(state);

	if (! ast_node.close_bracket) {
		state.fatal('expected closing bracket ">" after varint real type');
	}

	return null;
}

function parse_type_expr_len(state: ParserState) : TypeExpr_builtin_len {
	state.trace('parse_type_expr_len');
	state.scan_through_comments_and_whitespace();

	const len_keyword = name_builtin_len.match(state);

	if (! len_keyword) {
		return null;
	}

	const ast_node = new TypeExpr_builtin_len();
	ast_node.len_keyword = len_keyword;
	
	state.scan_through_comments_and_whitespace();
	ast_node.open_bracket = punc_open_angle_bracket.match(state);

	if (! ast_node.open_bracket) {
		state.fatal('expected opening bracket "<" to preceed len real type');
	}
	
	state.scan_through_comments_and_whitespace();
	ast_node.real_type = parse_type_expr_fixed_int(state) || parse_type_expr_varint(state);

	if (! ast_node.real_type) {
		state.fatal('expected a fixed int type expr for len real type');
	}
	
	state.scan_through_comments_and_whitespace();
	ast_node.close_bracket = punc_close_angle_bracket.match(state);

	if (! ast_node.close_bracket) {
		state.fatal('expected closing bracket ">" after len real type');
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
	ast_node.length_type = parse_type_expr_fixed_int(state) || parse_type_expr_varint(state) || op_expansion.match(state);

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

function parse_type_expr_text(state: ParserState) : TypeExpr_builtin_text {
	state.trace('parse_type_expr_text');
	state.scan_through_comments_and_whitespace();

	const text_keyword = name_builtin_text.match(state);

	if (! text_keyword) {
		return null;
	}

	const text = new TypeExpr_builtin_text();

	// TODO: text length

	return text;
}

function parse_type_expr_checksum(state: ParserState) : TypeExpr_builtin_checksum {
	state.trace('parse_type_expr_checksum');
	state.scan_through_comments_and_whitespace();

	const checksum_keyword = name_builtin_checksum.match(state);

	if (! checksum_keyword) {
		return null;
	}

	const checksum = new TypeExpr_builtin_checksum();

	// TODO: real type
	// TODO: data source expr
	// TODO: checksum function

	return checksum;
}

function parse_type_expr_named(state: ParserState) : TypeExpr {
	state.trace('parse_type_expr_named');
	state.scan_through_comments_and_whitespace();

	const name = name_normal.match(state);

	if (! name) {
		return null;
	}
	
	const ast_node: TypeExpr = new TypeExpr_named();
	ast_node.name = name;

	// TODO: optional params

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
