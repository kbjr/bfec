
import { ParserState } from './state';
import { DeclareFromNode, FromImportNode, FromImportsListNode } from './ast';
import { const_ascii, const_unicode, kw_as, kw_from, name_normal, punc_close_brace, punc_open_brace, punc_separator, punc_terminator } from './ast/tokens';

export function parse_from(state: ParserState) : DeclareFromNode {
	state.trace('parse_from');

	const branch = state.branch();
	const preceeding_comments = branch.take_comments();
	const from_keyword = kw_from.match(branch);

	if (! from_keyword) {
		return null;
	}

	state.commit_branch(branch);
	state.scan_through_comments_and_whitespace();

	const ast_node = new DeclareFromNode();

	ast_node.comments = preceeding_comments;
	ast_node.source = const_ascii.match(state) || const_unicode.match(state);

	if (! ast_node.source) {
		state.fatal('expected to find from source following "from" keyword');
	}
	
	state.scan_through_comments_and_whitespace();

	ast_node.root_import = name_normal.match(state);
	ast_node.extraneous_comments = state.take_comments();

	if (! ast_node.root_import) {
		ast_node.imports = new FromImportsListNode();
		ast_node.imports.open_brace = punc_open_brace.match(state);

		if (! ast_node.imports.open_brace) {
			state.fatal('expected import name or list opening brace "{"');
		}
	
		state.scan_through_comments_and_whitespace();

		while (true) {
			const imported = new FromImportNode();

			imported.source_name = name_normal.match(state);

			if (! imported.source_name) {
				break;
			}

			state.scan_through_comments_and_whitespace();

			imported.as_keyword = kw_as.match(state);

			if (imported.as_keyword) {
				state.scan_through_comments_and_whitespace();
				imported.alias_name = name_normal.match(state);

				if (! imported.alias_name) {
					state.fatal('expected import alias name after "as" keyword');
				}

				state.scan_through_comments_and_whitespace();
			}

			imported.separator = punc_separator.match(state);

			ast_node.imports.imports.push(imported);

			if (! imported.separator) {
				break;
			}

			state.scan_through_comments_and_whitespace();
		}

		ast_node.imports.close_brace = punc_close_brace.match(state);

		if (! ast_node.imports.close_brace) {
			state.fatal('expected end of list closing brace "}"');
		}
	}
	
	state.scan_through_comments_and_whitespace();

	ast_node.terminator = punc_terminator.match(state);

	if (! ast_node.terminator) {
		state.fatal('expected statement terminator ";"');
	}
	
	ast_node.extraneous_comments.push(...state.take_comments());
	return ast_node;
}
