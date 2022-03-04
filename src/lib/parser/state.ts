
import { parser as log } from '../log';
import { CommentToken, meta_line_comment, meta_newline, meta_whitespace, WhitespaceToken } from './ast/tokens';

const trace_indent = '  ';

export class ParserState {
	public raw: string;
	public name: string;
	public lines: string[];
	public comments: CommentToken[] = [ ];
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

	public take_comments() {
		return this.comments.splice(0, this.comments.length);
	}

	public branch() {
		this.trace('branch');

		const branch = new ParserState(this.name, this.raw);

		branch.comments = this.comments.slice();
		branch.line = this.line;
		branch.char = this.char;
		branch.step_down();

		return branch;
	}

	public commit_branch(branch: ParserState) {
		this.trace('commit_branch');
		this.comments = branch.comments;
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

	public scan_through_comments_and_whitespace() {
		this.trace('scan_through_comments_and_whitespace');

		const comments: CommentToken[] = [ ];
		const whitespace: WhitespaceToken[] = [ ];
		const start_line = this.line;

		while (true) {
			const match1 = meta_line_comment.match(this);

			if (match1) {
				comments.push(match1);
				continue;
			}

			const match2 = meta_whitespace.match(this);

			if (match2) {
				whitespace.push(match2);
				continue;
			}

			break;
		}

		this.comments.push(...comments);
		return !! (this.line > start_line || comments.length || whitespace.length);
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
