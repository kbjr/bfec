
import { Parser } from './parser';
import { ParserState } from './state';
import { DeclareStructNode, StructElem, StructExpansion, StructField, StructSizePrefix } from './ast';
import { kw_struct, name_normal, name_root_schema, PuncToken_close_brace, punc_close_brace, punc_open_brace } from './tokens';

const struct_scope_parsers: Parser<StructElem>[] = [
	parse_struct_field,
	parse_struct_expansion,
	parse_struct_size_prefix,
];

export function parse_struct(state: ParserState) : DeclareStructNode {
	state.trace('parse_struct');

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

	ast_node.open_brace = punc_open_brace.match(state);

	if (! ast_node.open_brace) {
		state.fatal('expected beginning of struct body opening brace "{"');
	}
	
	state.scan_through_comments_and_whitespace();

	ast_node.close_brace = parse_struct_scope(state, ast_node.children);

	// TODO: Should we do something with these?
	const extraneous_comments = state.take_comments();

	return ast_node;
}

function parse_struct_scope(state: ParserState, children: StructElem[]) : PuncToken_close_brace {
	state.step_down();
	state.trace('parse_struct_scope');

	read_loop:
	while (! state.eof()) {
		if (state.scan_through_comments_and_whitespace()) {
			if (state.eof()) {
				state.fatal('unexpected eof while parsing struct scope');
			}
		}

		const close_brace = punc_close_brace.match(state);

		if (close_brace) {
			state.step_up();
			children.push(...state.take_comments());
			return close_brace;
		}

		for (let parser of struct_scope_parsers) {
			const node = parser(state);

			if (node) {
				children.push(node);
				continue read_loop;
			}
		}

		state.fatal('expected end of struct closing brace "}"');
	}
}

function parse_struct_field(state: ParserState) : StructField {
	state.step_down();
	state.trace('parse_struct_field');

	// 
	
	state.step_up();
	return null;
}

function parse_struct_expansion(state: ParserState) : StructExpansion {
	state.step_down();
	state.trace('parse_struct_expansion');

	// 

	state.step_up();
	return null;
}

function parse_struct_size_prefix(state: ParserState) : StructSizePrefix {
	state.step_down();
	state.trace('parse_struct_size_prefix');

	// 
	
	state.step_up();
	return null;
}
