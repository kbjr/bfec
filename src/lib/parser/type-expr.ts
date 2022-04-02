
import { ParserState } from './state';
import {
	TypeExpr,
	TypeExpr_array,
	TypeExpr_struct_refinement, TypeExpr_switch_refinement, TypeExpr_named_refinement,
	TypeExpr_builtin_checksum, TypeExpr_builtin_len,
	TypeExpr_builtin_text,
	TypeExpr_builtin_vint, TypeExpr_int,
	TypeExpr_named,
	TypeExprParamsList,
	TypeExprParam,
	ValueExpr,
} from './ast';
import {
	name_builtin_bit, name_builtin_sint, name_builtin_uint,
	const_int, const_hex_int, const_ascii,
	punc_open_square_bracket, punc_close_square_bracket,
	name_builtin_vint,
	punc_open_paren, punc_close_paren,
	punc_arrow,
	name_builtin_bin_float, name_builtin_dec_float, name_builtin_text,
	name_normal,
	punc_open_angle_bracket,
	punc_close_angle_bracket,
	name_builtin_len,
	name_builtin_checksum,
	op_expansion,
	punc_separator, Ignored, PuncToken_arrow, const_unicode, kw_null, kw_struct, kw_bin, kw_switch,
} from './ast/tokens';
import { parse_value_expr } from './value-expr';
import { parse_struct_body } from './struct';
import { parse_switch_body } from './switch';

export function parse_type_expr(state: ParserState) : TypeExpr {
	state.trace('parse_type_expr');

	const ascii = const_ascii.match(state);

	if (ascii) {
		return ascii;
	}

	const fixed_int = parse_type_expr_fixed_int(state);

	if (fixed_int) {
		const lh_expr = parse_optional_arrays(state, fixed_int);
		const refinement = parse_type_expr_refinement(state, lh_expr);

		return refinement || lh_expr;
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

	const varint_keyword = name_builtin_vint.match(state);

	if (! varint_keyword) {
		return null;
	}

	const ast_node = new TypeExpr_builtin_vint();
	ast_node.varint_keyword = varint_keyword;
	
	state.scan_through_comments_and_whitespace(ast_node.children);
	ast_node.open_bracket = punc_open_angle_bracket.match(state);

	if (! ast_node.open_bracket) {
		state.fatal('expected opening bracket "<" to preceed varint real type');
	}
	
	state.scan_through_comments_and_whitespace(ast_node.children);
	ast_node.real_type = parse_type_expr_fixed_int(state);

	if (! ast_node.real_type) {
		state.fatal('expected a fixed int type expr for varint real type');
	}
	
	state.scan_through_comments_and_whitespace(ast_node.children);
	ast_node.close_bracket = punc_close_angle_bracket.match(state);

	if (! ast_node.close_bracket) {
		state.fatal('expected closing bracket ">" after varint real type');
	}

	return null;
}

function parse_type_expr_len(state: ParserState) : TypeExpr_builtin_len {
	state.trace('parse_type_expr_len');

	const len_keyword = name_builtin_len.match(state);

	if (! len_keyword) {
		return null;
	}

	const ast_node = new TypeExpr_builtin_len();
	ast_node.len_keyword = len_keyword;
	
	state.scan_through_comments_and_whitespace(ast_node.children);
	ast_node.open_bracket = punc_open_angle_bracket.match(state);

	if (! ast_node.open_bracket) {
		state.fatal('expected opening bracket "<" to preceed len real type');
	}
	
	state.scan_through_comments_and_whitespace(ast_node.children);
	ast_node.real_type = parse_type_expr_fixed_int(state) || parse_type_expr_varint(state);

	if (! ast_node.real_type) {
		state.fatal('expected a fixed int type expr for len real type');
	}
	
	state.scan_through_comments_and_whitespace(ast_node.children);
	ast_node.close_bracket = punc_close_angle_bracket.match(state);

	if (! ast_node.close_bracket) {
		state.fatal('expected closing bracket ">" after len real type');
	}

	return ast_node;
}

function parse_type_expr_array(state: ParserState, lh_expr: TypeExpr) : TypeExpr_array {
	state.trace('parse_type_expr_array');

	const open_bracket = punc_open_square_bracket.match(state);

	if (! open_bracket) {
		return null;
	}

	const ast_node = new TypeExpr_array();
	ast_node.open_bracket = open_bracket;
	ast_node.elem_type = lh_expr;
	
	state.scan_through_comments_and_whitespace(ast_node.children);
	ast_node.length_type = parse_type_expr_fixed_int(state) || parse_type_expr_varint(state) || op_expansion.match(state) || kw_null.match(state) || parse_value_expr(state);

	if (! ast_node.length_type) {
		state.fatal('expected array length type definition between square brackets "[" / "]"');
	}
	
	state.scan_through_comments_and_whitespace(ast_node.children);
	ast_node.close_bracket = punc_close_square_bracket.match(state);

	if (! ast_node.close_bracket) {
		state.fatal('expected closing square bracket "]" at end of array type expr');
	}

	return ast_node;
}

function parse_type_expr_text(state: ParserState) : TypeExpr_builtin_text {
	state.trace('parse_type_expr_text');

	const text_keyword = name_builtin_text.match(state);

	if (! text_keyword) {
		return null;
	}

	const text = new TypeExpr_builtin_text();

	state.scan_through_comments_and_whitespace(text.children);

	text.open_bracket = punc_open_angle_bracket.match(state);

	if (! text.open_bracket) {
		state.fatal('expected opening angle bracket "<" preceeding length type for text type expression');
	}

	state.scan_through_comments_and_whitespace(text.children);

	text.length_type = parse_type_expr_fixed_int(state) || parse_type_expr_varint(state) || op_expansion.match(state) || kw_null.match(state);

	if (! text.length_type) {
		state.fatal('expected length type for text type expression (fixed int, varint, expansion, or null)');
	}

	state.scan_through_comments_and_whitespace(text.children);

	text.close_bracket = punc_close_angle_bracket.match(state);

	if (! text.close_bracket) {
		state.fatal('expected closing angle bracket ">" following length type for text type expression');
	}

	return text;
}

function parse_type_expr_checksum(state: ParserState) : TypeExpr_builtin_checksum {
	state.trace('parse_type_expr_checksum');

	const checksum_keyword = name_builtin_checksum.match(state);

	if (! checksum_keyword) {
		return null;
	}

	const checksum = new TypeExpr_builtin_checksum();

	checksum.checksum_keyword = checksum_keyword;

	state.scan_through_comments_and_whitespace(checksum.children);

	checksum.open_bracket = punc_open_angle_bracket.match(state);

	if (! checksum.open_bracket) {
		state.fatal('expected opening angle bracket "<" preceeding checksum real type');
	}

	state.scan_through_comments_and_whitespace(checksum.children);

	checksum.real_type = parse_type_expr(state);

	if (! checksum.real_type) {
		state.fatal('expected type expression for checksum real type');
	}

	state.scan_through_comments_and_whitespace(checksum.children);

	checksum.close_bracket = punc_close_angle_bracket.match(state);

	if (! checksum.close_bracket) {
		state.fatal('expected closing angle bracket ">" following checksum real type');
	}

	state.scan_through_comments_and_whitespace(checksum.children);

	checksum.open_paren = punc_open_paren.match(state);

	if (! checksum.open_paren) {
		state.fatal('expected opening paren "(" preceeding checksum params');
	}

	state.scan_through_comments_and_whitespace(checksum.children);

	checksum.data_expr = parse_value_expr(state);

	if (! checksum.data_expr) {
		state.fatal('expected value expression for checksum data source');
	}

	state.scan_through_comments_and_whitespace(checksum.children);

	checksum.param_separator = punc_separator.match(state);

	if (! checksum.param_separator) {
		state.fatal('expected separator "," between checksum params');
	}

	state.scan_through_comments_and_whitespace(checksum.children);

	checksum.checksum_func = const_ascii.match(state) || const_unicode.match(state);

	if (! checksum.checksum_func) {
		state.fatal('expected string literal with checksum function name');
	}

	state.scan_through_comments_and_whitespace(checksum.children);

	checksum.close_paren = punc_close_paren.match(state);

	if (! checksum.close_paren) {
		state.fatal('expected closing paren ")" following checksum params');
	}

	return checksum;
}

function parse_type_expr_named(state: ParserState) : TypeExpr_named {
	state.trace('parse_type_expr_named');

	const name = name_normal.match(state);

	if (! name) {
		return null;
	}
	
	const ast_node = new TypeExpr_named();
	ast_node.name = name;

	const branch = state.branch();
	branch.scan_through_comments_and_whitespace(ast_node.children);

	const open_paren = punc_open_paren.match(branch);

	if (! open_paren) {
		return ast_node;
	}

	state.commit_branch(branch);

	const param_list = new TypeExprParamsList();
	param_list.open_paren = open_paren;

	state.scan_through_comments_and_whitespace(param_list.children);

	let value_expr: ValueExpr;

	while (value_expr = parse_value_expr(state)) {
		const param = new TypeExprParam();
		param_list.params.push(param);
		param.param = value_expr;

		state.scan_through_comments_and_whitespace(param_list.children);

		param.separator = punc_separator.match(state);

		if (! param.separator) {
			break;
		}

		state.scan_through_comments_and_whitespace(param_list.children);
	}

	param_list.close_paren = punc_close_paren.match(state);

	if (! param_list.close_paren) {
		if (param_list.params.length) {
			state.fatal('expected closing paren ")" or a separator "," followed by more params');
		}
		
		state.fatal('expected closing paren ")" or list of params');
	}

	return ast_node;
}

function parse_type_expr_refinement(state: ParserState, lh_expr: TypeExpr) {
	state.trace('parse_type_expr_refinement');

	const branch = state.branch();
	const skipped: Ignored[] = [ ];

	branch.scan_through_comments_and_whitespace(skipped);

	const arrow = punc_arrow.match(branch);

	if (! arrow) {
		return null;
	}

	state.commit_branch(branch);
	state.scan_through_comments_and_whitespace(skipped);

	const refinement
		= parse_type_expr_struct_refinement(state, lh_expr, arrow)
		|| parse_type_expr_switch_refinement(state, lh_expr, arrow)
		|| parse_type_expr_named_refinement(state, lh_expr, arrow)
		;

	if (! refinement) {
		state.fatal('expected a valid refinement target (named type expression or inline struct / switch)');
	}

	refinement.children.unshift(...skipped);

	return refinement;
}

function parse_type_expr_struct_refinement(state: ParserState, lh_expr: TypeExpr, arrow: PuncToken_arrow) : TypeExpr_struct_refinement {
	state.trace('parse_type_expr_struct_refinement');

	const struct_keyword = kw_struct.match(state) || kw_bin.match(state);

	if (! struct_keyword) {
		return null;
	}
	
	const ast_node = new TypeExpr_struct_refinement();

	ast_node.parent_type = lh_expr;
	ast_node.arrow = arrow;
	ast_node.struct_keyword = struct_keyword;

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.body = parse_struct_body(state);

	if (! ast_node) {
		state.fatal('expected struct body beginning with opening brace "{"');
	}
	
	return ast_node;
}

function parse_type_expr_switch_refinement(state: ParserState, lh_expr: TypeExpr, arrow: PuncToken_arrow) : TypeExpr_switch_refinement {
	state.trace('parse_type_expr_switch_refinement');

	const switch_keyword = kw_switch.match(state);

	if (! switch_keyword) {
		return null;
	}
	
	const ast_node = new TypeExpr_switch_refinement();

	ast_node.parent_type = lh_expr;
	ast_node.arrow = arrow;
	ast_node.switch_keyword = switch_keyword;

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.open_bracket = punc_open_angle_bracket.match(state);

	if (! ast_node.open_bracket) {
		state.fatal('expected switch param type, beginning with open angle bracket "<"');
	}

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.value_type = parse_type_expr(state);

	if (! ast_node.value_type) {
		state.fatal('expected switch param type expression');
	}

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.close_bracket = punc_close_angle_bracket.match(state);

	if (! ast_node.close_bracket) {
		state.fatal('expected close angle bracket ">" after switch param type');
	}

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.open_paren = punc_open_paren.match(state);

	if (! ast_node.open_paren) {
		state.fatal('expected switch param value, beginning with open paren "("');
	}

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.value_expr = parse_value_expr(state);

	if (! ast_node.value_expr) {
		state.fatal('expected switch param value expression');
	}

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.close_paren = punc_close_paren.match(state);

	if (! ast_node.close_paren) {
		state.fatal('expected close paren ")" after switch param value');
	}

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.body = parse_switch_body(state);

	if (! ast_node) {
		state.fatal('expected switch body beginning with opening brace "{"');
	}
	
	return ast_node;
}

function parse_type_expr_named_refinement(state: ParserState, lh_expr: TypeExpr, arrow: PuncToken_arrow) : TypeExpr_named_refinement {
	state.trace('parse_type_expr_named_refinement');
	
	const rh_expr = parse_type_expr_named(state);

	if (! rh_expr) {
		return null;
	}
	
	const ast_node = new TypeExpr_named_refinement();

	ast_node.parent_type = lh_expr;
	ast_node.arrow = arrow;
	ast_node.refined_type = rh_expr;
	
	return ast_node;
}

function parse_type_expr_fixed_int(state: ParserState) : TypeExpr_int {
	state.trace('parse_type_expr_fixed_int');
	return const_hex_int.match(state) || const_int.match(state) || name_builtin_uint.match(state) || name_builtin_sint.match(state) || name_builtin_bit.match(state);
}
