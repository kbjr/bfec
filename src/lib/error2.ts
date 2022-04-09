
import { ast } from './parser';
import * as sch from './linker2';
import { red, blue, yellow, green, grey, cyan } from 'chalk';
import { PositionRange, pos_for_type_expr } from './linker2';

const ref_text_indent = '  ';

export class BuildError {
	constructor(
		public readonly message: string,
		public readonly source: sch.Schema,
		public readonly pos: sch.PositionRange,
		public readonly pos_secondary?: sch.PositionRange
	) { }

	public get pos_text() {
		return `${cyan(this.source.source.source)}:${yellow(this.pos.start.line + 1)}:${yellow(this.pos.start.char + 1)}`;
	}

	public get pos_text_secondary() {
		if (! this.pos_secondary) {
			return grey('(no secondary pos)');
		}

		return `${cyan(this.source.source.source)}:${yellow(this.pos_secondary.start.line + 1)}:${yellow(this.pos_secondary.start.char + 1)}`;
	}

	public get reference_text() {
		let text = build_reference_text(this.source.source.source_contents, this.pos, ref_text_indent);

		if (this.pos_secondary) {
			text += `\n\n${ref_text_indent.repeat(2)}(${this.pos_text_secondary}):`;
			text += `\n\n${build_reference_text(this.source.source.source_contents, this.pos_secondary, ref_text_indent.repeat(2))}`;
		}

		return text;
	}
}

export interface BuildErrorFactory {
	(node: sch.SchemaNode | ast.Token, message: string, secondary?: sch.SchemaNode | ast.Token): void;
	type_expr(node: ast.TypeExpr, message: string): void;
}

export function build_error_factory(errors: BuildError[], schema: sch.Schema) : BuildErrorFactory {
	function _build_error(node: sch.SchemaNode | ast.Token, message: string, secondary?: sch.SchemaNode | ast.Token) {
		const position1 = node instanceof ast.Token ? sch.pos(node) : node.pos;
		const position2 = secondary ? (secondary instanceof ast.Token ? sch.pos(secondary) : secondary.pos) : null;
		
		errors.push(
			new BuildError(message, schema, position1, position2)
		);
	}

	_build_error.type_expr = function(node: ast.TypeExpr, message: string) {
		errors.push(
			new BuildError(message, schema, pos_for_type_expr(node))
		);
	};

	return _build_error;
}

function build_reference_text(lines: string[], pos: sch.PositionRange, indent: string) {
	let line = lines[pos.start.line].replace(/\t/g, ' ');
	const orig_length = line.length;
	
	line = line.trimStart();
	const length_diff = orig_length - line.length;

	line = line.trimEnd();
	const start_char = pos.start.char - length_diff;

	// If the provided node takes more than one line, we'll only show the
	// portion belonging to the first line
	const underline_length = pos.start.line !== pos.end.line
		? line.length - start_char
		: pos.end.char - start_char - length_diff;

	return `${indent}${line}\n${indent}${' '.repeat(start_char)}${red('~'.repeat(underline_length))}`;
}
