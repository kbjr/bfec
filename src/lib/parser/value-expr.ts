
import { LeftHandName, ValueExpr, ValueExpr_path, ValueExpr_path_access } from './ast';
import { const_ascii, const_hex_int, const_int, const_unicode, name_normal, name_root_schema, name_this_schema, punc_property_access } from './ast/tokens';
import { ParserState } from './state';

export function parse_value_expr(state: ParserState) : ValueExpr {
	state.trace('parse_value_expr');

	const lh_name = name_root_schema.match(state) || name_this_schema.match(state) || name_normal.match(state);

	if (lh_name) {
		return parse_value_expr_path(state, lh_name);
	}

	// TODO: Other value expression types

	return null;
}

export function parse_const_value_expr(state: ParserState) {
	return const_int.match(state) || const_hex_int.match(state) || const_ascii.match(state) || const_unicode.match(state);
}

function parse_value_expr_path(state: ParserState, lh_name: LeftHandName) : ValueExpr_path {
	state.trace('parse_value_expr_path');

	const path = new ValueExpr_path();
	path.lh_name = lh_name;

	while (true) {
		state.scan_through_comments_and_whitespace(path.children);

		const access_punc = punc_property_access.match(state);

		if (! access_punc) {
			break;
		}

		const access = new ValueExpr_path_access();
		access.access_punc = access_punc;

		state.scan_through_comments_and_whitespace(path.children);

		access.field_name = name_normal.match(state);

		if (! access.field_name) {
			state.fatal('expected accessed field name following access operator "."');
		}
	}

	return path;
}
