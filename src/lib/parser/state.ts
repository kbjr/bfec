
import { parser as log } from '../log';
import { ASTNode } from './ast';
import { meta_block_comment, meta_line_comment, meta_newline, meta_whitespace } from './ast/tokens';

const trace_indent = '  ';

export class ParserState {
	public raw: string;
	public name: string;
	public lines: string[];
	public line: number = 0;
	public char: number = 0;
	private trace_depth: number = 0;
	private trace_indent: string = '';

	constructor(name: string, raw: string) {
		this.raw = raw;
		this.name = name;
		this.lines = raw.split(meta_newline);
	}

	public eof() {
		return this.line >= this.lines.length;
	}

	public pos() {
		return `file=${this.name}, line=${this.line + 1}, char=${this.char + 1}`;
	}

	public branch() {
		this.trace('branch');

		const branch = new ParserState(this.name, this.raw);

		branch.line = this.line;
		branch.char = this.char;
		branch.step_down();

		return branch;
	}

	public commit_branch(branch: ParserState) {
		this.trace('commit_branch');
		this.line = branch.line;
		this.char = branch.char;
	}

	public step_down() {
		this.trace_depth++;
		this.trace_indent = trace_indent.repeat(this.trace_depth);
	}

	public step_up() {
		this.trace_depth--;
		this.trace_indent = trace_indent.repeat(this.trace_depth);
	}

	public scan_through_comments_and_whitespace(write_to: ASTNode[]) {
		this.trace('scan_through_comments_and_whitespace');

		let found_nodes = false;
		const start_line = this.line;

		while (true) {
			const match1 = meta_block_comment.match(this);

			if (match1) {
				found_nodes = true;
				write_to.push(match1);
				continue;
			}

			const match2 = meta_line_comment.match(this);

			if (match2) {
				found_nodes = true;
				write_to.push(match2);
				continue;
			}

			const match3 = meta_whitespace.match(this);

			if (match3) {
				found_nodes = true;
				write_to.push(match3);
				continue;
			}

			break;
		}

		return this.line > start_line || found_nodes;
	}

	public trace(func_name: string, ...other: any[]) {
		log.silly(`${this.trace_indent}${func_name}(${this.pos()})`, ...other);
	}

	public fatal(message: string) : never {
		log.error(`\nFatal: ${message} (${this.pos()})`);
		log.error(`\n  ${this.lines[this.line].replace(/\t/g, ' ')}`);
		log.error(`  ${' '.repeat(this.char)}^`);
		throw new Error(`failed to parse bfec file: ${message} (${this.pos()})`);
	}
}
