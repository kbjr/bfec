
import { Parser } from './parser';
import { ParserState } from './state';
import { DeclareSwitchNode, SwitchBody, SwitchCase, SwitchDefault, SwitchElem, SwitchParam, SwitchSelection } from './ast';
import { kw_invalid, kw_void, kw_case, kw_default, kw_switch, name_normal, PuncToken_close_brace, punc_close_brace, punc_colon, punc_open_brace, punc_terminator, punc_open_angle_bracket, punc_close_angle_bracket } from './ast/tokens';
import { parse_type_expr } from './type-expr';

const switch_scope_parsers: Parser<SwitchElem>[] = [
	parse_switch_case,
	parse_switch_default,
];

export function parse_switch(state: ParserState) : DeclareSwitchNode {
	state.trace('parse_switch');

	const switch_keyword = kw_switch.match(state);

	if (! switch_keyword) {
		return null;
	}

	const ast_node = new DeclareSwitchNode();
	ast_node.switch_keyword = switch_keyword;

	state.scan_through_comments_and_whitespace(ast_node.children);
	
	ast_node.name = name_normal.match(state);

	if (! ast_node.name) {
		state.fatal('expected to find switch name following "switch" keyword');
	}
	
	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.param = new SwitchParam();
	ast_node.param.open_bracket = punc_open_angle_bracket.match(state);

	if (! ast_node.param.open_bracket) {
		state.fatal('expected to find switch parameter opening bracket "<"');
	}
	
	state.scan_through_comments_and_whitespace(ast_node.children);
	ast_node.param.param_type = parse_type_expr(state);

	if (! ast_node.param.param_type) {
		state.fatal('expected to find switch parameter type');
	}

	state.scan_through_comments_and_whitespace(ast_node.children);
	ast_node.param.close_bracket = punc_close_angle_bracket.match(state);

	if (! ast_node.param.close_bracket) {
		state.fatal('expected to find switch parameter closing bracket ">"');
	}

	state.scan_through_comments_and_whitespace(ast_node.children);
	ast_node.body = parse_switch_body(state);

	return ast_node;
}

export function parse_switch_body(state: ParserState) : SwitchBody {
	const ast_node = new SwitchBody();

	ast_node.open_brace = punc_open_brace.match(state);

	if (! ast_node.open_brace) {
		state.fatal('expected beginning of switch body opening brace "{"');
	}
	
	state.scan_through_comments_and_whitespace(ast_node.children);
	
	ast_node.close_brace = parse_switch_scope(state, ast_node.children);

	return ast_node;
}

function parse_switch_scope(state: ParserState, children: SwitchElem[]) : PuncToken_close_brace {
	state.step_down();
	state.trace('parse_switch_scope');

	read_loop:
	while (! state.eof()) {
		if (state.scan_through_comments_and_whitespace(children)) {
			if (state.eof()) {
				state.fatal('unexpected eof while parsing switch scope');
			}
		}

		const close_brace = punc_close_brace.match(state);

		if (close_brace) {
			state.step_up();
			return close_brace;
		}

		for (let parser of switch_scope_parsers) {
			const node = parser(state);

			if (node) {
				children.push(node);
				continue read_loop;
			}
		}

		state.fatal('expected end of switch closing brace "}"');
	}
}

function parse_switch_case(state: ParserState) : SwitchCase {
	state.step_down();
	state.trace('parse_switch_case');

	const case_keyword = kw_case.match(state);

	if (! case_keyword) {
		return null;
	}

	const ast_node = new SwitchCase();
	ast_node.case_keyword = case_keyword;

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.condition_name = name_normal.match(state);

	if (! ast_node.condition_name) {
		state.fatal('expected enum member name for switch case condition');
	}

	state.scan_through_comments_and_whitespace(ast_node.children);
	ast_node.colon = punc_colon.match(state);
	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.selection = parse_switch_expr(state);

	if (! ast_node.selection) {
		state.fatal('expected switch case selection type expression');
	}
	
	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.terminator = punc_terminator.match(state);

	if (! ast_node.terminator) {
		state.fatal('expected switch case to be followed by terminator ";"');
	}
	
	state.step_up();
	return ast_node;
}

function parse_switch_default(state: ParserState) : SwitchDefault {
	state.step_down();
	state.trace('parse_switch_default');

	const default_keyword = kw_default.match(state);

	if (! default_keyword) {
		return null;
	}

	const ast_node = new SwitchDefault();
	ast_node.default_keyword = default_keyword;

	state.scan_through_comments_and_whitespace(ast_node.children);
	ast_node.colon = punc_colon.match(state);
	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.selection = parse_switch_expr(state);

	if (! ast_node.selection) {
		state.fatal('expected switch case selection type expression');
	}
	
	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.terminator = punc_terminator.match(state);

	if (! ast_node.terminator) {
		state.fatal('expected switch case to be followed by terminator ";"');
	}
	
	state.step_up();
	return ast_node;
}

function parse_switch_expr(state: ParserState) : SwitchSelection {
	const void_keyword = kw_void.match(state);

	if (void_keyword) {
		return void_keyword;
	}

	const invalid_keyword = kw_invalid.match(state);

	if (invalid_keyword) {
		return invalid_keyword;
	}
	
	return parse_type_expr(state);
}
