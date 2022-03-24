
import { ParserState } from './state';
import { ASTNode, DeclareEnumNode, EnumElem } from './ast';
import { Parser } from './parser';
import { PuncToken_close_brace, punc_close_brace } from './ast/tokens';

const enum_scope_parsers: Parser<EnumElem>[] = [
	parse_enum_member,
];

export function parse_enum(state: ParserState) : DeclareEnumNode {
	state.trace('parse_enum');

	// TODO: enum keyword
	// TODO: enum name
	// TODO: colon
	// TODO: base type
	// TODO: body

	return null;
}

export function parse_enum_body(state: ParserState) : null {
	state.trace('parse_enum_body');

	// TODO: open brace
	// TODO: enum scope
	// TODO: close brace

	return null;
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

function parse_enum_member(state: ParserState) : ASTNode {
	state.trace('parse_enum_member');

	// 

	return null;
}
