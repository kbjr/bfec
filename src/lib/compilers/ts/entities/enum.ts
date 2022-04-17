
import * as lnk from '../../../linker';
import * as tmpl from '../templates';
import { CompilerState } from '../state';

export class Enum {
	constructor(
		public out_dir: string,
		public name: string,
		public node: lnk.Enum,
		public state: CompilerState
	) { }

	public get file_path() {
		return `${this.out_dir}/${this.name}`;
	}

	public get imports() : tmpl.ImportTemplateOpts[] {
		return [ ];
	}

	public get comments() {
		const { comments } = this.node;

		return comments && comments.length
			? tmpl.doc_comments_template(comments.map((comment) => comment.content))
			: '';
	}

	public get members() {
		return this.node.members.map((member) : tmpl.EnumMemberTemplateOpts => {
			const { comments } = member;
			return {
				comments: comments && comments.length
					? tmpl.doc_comments_template(comments.map((comment) => comment.content), '\t')
					: '',
				name: member.name,
				// FIXME: Properly convert this to a JS safe value
				value: member.value.token.text
			};
		});
	}

	public emit() {
		const generator_comment = tmpl.generator_comment_template(this.state.opts.no_generator_comment);

		const type_ts
			= generator_comment
			+ tmpl.enum_template({
				ts_enum: this,
			});

		return this.state.opts.out_dir.write_file(`${this.file_path}.ts`, type_ts);
	}
}
