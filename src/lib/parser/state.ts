
import { parser as log } from '../log';
import { CommentToken, meta_line_comment, meta_newline, meta_whitespace, WhitespaceToken } from './tokens';

export class ParserState {
	public raw: string;
	public lines: string[];
	public comments: CommentToken[] = [ ];
	public line: number = 0;
	public char: number = 0;

	constructor(raw: string) {
		this.raw = raw;
		this.lines = raw.split(meta_newline);
	}

	public eof() {
		return this.line >= this.lines.length;
	}

	public pos() {
		return `line=${this.line + 1}, char=${this.char}`;
	}

	public take_comments() {
		return this.comments.splice(0, this.comments.length);
	}

	public branch() {
		const branch = new ParserState(this.raw);

		branch.comments = this.comments.slice();
		branch.line = this.line;
		branch.char = this.char;

		return branch;
	}

	public commit_branch(branch: ParserState) {
		this.comments = branch.comments;
		this.line = branch.line;
		this.char = branch.char;
	}

	public scan_through_comments_and_whitespace() {
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

	public fatal(message: string) : never {
		log.error(`${message} (${this.pos()})`);
		throw new Error(`failed to parse bfec file: ${message} (${this.pos()})`);
	}
}
