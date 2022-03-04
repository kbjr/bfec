
import { ParserState } from './state';
import { DeclareSwitchNode } from './ast';
import { kw_switch, name_normal, name_root_schema } from './tokens';

export function parse_switch(state: ParserState) : DeclareSwitchNode {
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
	// TODO: switch body
	// TODO:  - open brace
	// TODO:  - switch scope
	// TODO:  - close brace

	// TODO: Should we do something with these?
	const extraneous_comments = state.take_comments();

	return ast_node;
}
