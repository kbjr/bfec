
import { Parser } from './parser';
import { ParserState } from './state';
import { parser as log } from '../log';
import { parse_struct } from './struct';
import { parse_switch } from './switch';
import { parse_from } from './from';
import { parse_enum } from './enum';
import { FileNode, FileNodeElem } from './ast';

export * as ast from './ast';

const parsers: Parser<FileNodeElem>[] = [
	parse_struct,
	parse_switch,
	parse_enum,
	parse_from,
];

export function parse_src_to_ast(name: string, contents: string) : FileNode {
	const ast_node = new FileNode();
	const state = new ParserState(name, contents);
	
	state.trace('parse_src_to_ast', ast_node);

	try {
		read_loop:
		while (! state.eof()) {
			if (state.scan_through_comments_and_whitespace(ast_node.children)) {
				if (state.eof()) {
					break read_loop;
				}
			}
	
			for (let parser of parsers) {
				const node = parser(state);
	
				if (node) {
					ast_node.children.push(node);
					continue read_loop;
				}
			}
	
			state.fatal('encountered unexpected/unknown token');
		}
	}

	catch (error) {
		log_error(error);
		return null;
	}

	return ast_node;
}

function log_error(error: unknown) {
	if (error instanceof Error) {
		if (! error.message.startsWith('failed to parse bfec file')) {
			log.error(error);
		}
	}

	else {
		log.error(error);
	}
}
