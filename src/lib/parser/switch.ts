
import { ParserState } from './state';
import { DeclareSwitchNode, SwitchCase, SwitchDefault, SwitchElem } from './ast';
import { kw_switch, name_normal, name_root_schema, PuncToken_close_brace, punc_close_brace, punc_open_brace } from './tokens';
import { Parser } from './parser';

const switch_scope_parsers: Parser<SwitchElem>[] = [
	parse_switch_case,
	parse_switch_default,
];

export function parse_switch(state: ParserState) : DeclareSwitchNode {
	state.trace('parse_switch');

	const branch = state.branch();
	const preceeding_comments = branch.take_comments();
	const switch_keyword = kw_switch.match(branch);

	if (! switch_keyword) {
		return null;
	}

	state.commit_branch(branch);
	state.scan_through_comments_and_whitespace();

	const ast_node = new DeclareSwitchNode();

	ast_node.comments = preceeding_comments;
	ast_node.name = name_root_schema.match(state) || name_normal.match(state);

	if (! ast_node.name) {
		state.fatal('expected to find switch name following "switch" keyword');
	}
	
	state.scan_through_comments_and_whitespace();

	// TODO: switch param
	// TODO:  - open paren
	// TODO:  - param
	// TODO:  - close paren

	ast_node.open_brace = punc_open_brace.match(state);

	if (! ast_node.open_brace) {
		state.fatal('expected beginning of switch body opening brace "{"');
	}
	
	state.scan_through_comments_and_whitespace();
	
	ast_node.close_brace = parse_switch_scope(state, ast_node.children);

	// TODO: Should we do something with these?
	const extraneous_comments = state.take_comments();

	return ast_node;
}

function parse_switch_scope(state: ParserState, children: SwitchElem[]) : PuncToken_close_brace {
	state.step_down();
	state.trace('parse_switch_scope');

	read_loop:
	while (! state.eof()) {
		if (state.scan_through_comments_and_whitespace()) {
			if (state.eof()) {
				state.fatal('unexpected eof while parsing switch scope');
			}
		}

		const close_brace = punc_close_brace.match(state);

		if (close_brace) {
			state.step_up();
			children.push(...state.take_comments());
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

	// 
	
	state.step_up();
	return null;
}

function parse_switch_default(state: ParserState) : SwitchDefault {
	state.step_down();
	state.trace('parse_switch_default');

	// 
	
	state.step_up();
	return null;
}
