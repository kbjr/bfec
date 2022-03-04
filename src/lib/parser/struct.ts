
import { ParserState } from './state';
import { DeclareStructNode } from './ast';
import { kw_struct, name_normal, name_root_schema } from './tokens';

export function parse_struct(state: ParserState) : DeclareStructNode {
	const branch = state.branch();
	const preceeding_comments = branch.take_comments();
	const struct_keyword = kw_struct.match(branch);

	if (! struct_keyword) {
		return null;
	}

	state.commit_branch(branch);
	state.scan_through_comments_and_whitespace();

	const ast_node = new DeclareStructNode();

	ast_node.comments = preceeding_comments;
	ast_node.name = name_root_schema.match(state) || name_normal.match(state);

	if (! ast_node.name) {
		state.fatal('expected to find struct name following "struct" keyword');
	}
	
	state.scan_through_comments_and_whitespace();

	// TODO: optional struct params
	// TODO:  - open paren
	// TODO:  - params
	// TODO:  - close paren
	// TODO: struct body
	// TODO:  - open brace
	// TODO:  - struct scope
	// TODO:  - close brace

	// TODO: Should we do something with these?
	const extraneous_comments = state.take_comments();

	return ast_node;
}
