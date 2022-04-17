
import * as lnk from '../../../linker';
import * as tmpl from '../templates';
import { CompilerState } from '../state';

export class Struct {
	constructor(
		public out_dir: string,
		public name: string,
		public node: lnk.Struct,
		public state: CompilerState
	) { }

	public get is_root() {
		return this.node.name === '$';
	}

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

	public get fields() {
		return [ ];
	}

	public get encode_body() {
		return [ ];
	}

	public get decode_body() {
		return [ ];
	}

	public emit() {
		const generator_comment = tmpl.generator_comment_template(this.state.opts.no_generator_comment);

		const type_ts
			= generator_comment
			+ tmpl.struct_template({
				ts_struct: this,
				root_struct_type: this.state.root_class_name,
			});

		return this.state.opts.out_dir.write_file(`${this.file_path}.ts`, type_ts);
	}
}
