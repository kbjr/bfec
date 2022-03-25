
import { Parser } from './parser';
import { ParserState } from './state';
import { DeclareEnumNode, EnumBody, EnumElem, EnumMember } from './ast';
import { kw_enum, name_normal, PuncToken_close_brace, punc_assign, punc_close_brace, punc_colon, punc_open_brace, punc_terminator } from './ast/tokens';
import { parse_type_expr } from './type-expr';
import { parse_const_value_expr } from './value-expr';

const enum_scope_parsers: Parser<EnumElem>[] = [
	parse_enum_member,
];

export function parse_enum(state: ParserState) : DeclareEnumNode {
	state.trace('parse_enum');

	const enum_keyword = kw_enum.match(state);

	if (! enum_keyword) {
		return null;
	}

	const ast_node = new DeclareEnumNode();
	ast_node.enum_keyword = enum_keyword;

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.name = name_normal.match(state);

	if (! ast_node.name) {
		state.fatal('expected enum name');
	}

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.punc_colon = punc_colon.match(state);

	if (! ast_node.punc_colon) {
		state.fatal('expected colon ":" following enum name to preceed value type expression');
	}

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.value_type = parse_type_expr(state);

	if (! ast_node.value_type) {
		state.fatal('expected enum value type expression');
	}

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.body = parse_enum_body(state);

	if (! ast_node.body) {
		state.fatal('expected enum body, beginning with opening brace "{"');
	}

	return ast_node;
}

export function parse_enum_body(state: ParserState) : EnumBody {
	state.trace('parse_enum_body');

	const ast_node = new EnumBody();

	ast_node.open_brace = punc_open_brace.match(state);

	if (! ast_node.open_brace) {
		return null;
	}

	ast_node.close_brace = parse_enum_scope(state, ast_node.children);

	return ast_node;
}

function parse_enum_scope(state: ParserState, children: EnumElem[]) : PuncToken_close_brace {
	state.step_down();
	state.trace('parse_enum_scope');

	read_loop:
	while (! state.eof()) {
		if (state.scan_through_comments_and_whitespace(children)) {
			if (state.eof()) {
				state.fatal('unexpected eof while parsing enum scope');
			}
		}

		const close_brace = punc_close_brace.match(state);

		if (close_brace) {
			state.step_up();
			return close_brace;
		}

		for (let parser of enum_scope_parsers) {
			const node = parser(state);

			if (node) {
				children.push(node);
				continue read_loop;
			}
		}

		state.fatal('expected end of enum closing brace "}"');
	}
}

function parse_enum_member(state: ParserState) : EnumMember {
	state.trace('parse_enum_member');

	const name = name_normal.match(state);

	if (! name) {
		return null;
	}

	const ast_node = new EnumMember();
	ast_node.name = name;

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.assign = punc_assign.match(state);

	if (! ast_node.assign) {
		state.fatal('expected assignment op "=" after enum member name');
	}

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.value_expr = parse_const_value_expr(state);

	if (! ast_node.value_expr) {
		state.fatal('expected const value expression for enum member');
	}

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.terminator = punc_terminator.match(state);

	if (! ast_node.terminator) {
		state.fatal('expected terminator ";" after enum member');
	}

	return ast_node;
}
