
import * as lnk from '../../linker';
import * as tmpl from './templates';
import { CompilerState } from './state';

export class Struct {
	constructor(
		public out_dir: string,
		public class_name: string,
		public struct_node: lnk.Struct,
		public state: CompilerState
	) { }

	public get file_path() {
		return `${this.out_dir}/${this.class_name}`;
	}

	public emit() {
		const imports: tmpl.ImportTemplateOpts[] = [ ];
		const generator_comment = tmpl.generator_comment_template(this.state.opts.no_generator_comment);

		const type_ts
			= generator_comment
			+ tmpl.struct_template({
				file_path: this.file_path,
				struct_name: this.class_name,
				struct_comments: this.struct_node.comments.map((comment) => comment.content),
				struct_fields: [ ],
				struct_encode_body: [ ],
				struct_decode_body: [ ],
				struct_imports: imports,
				root_struct_type: this.state.root_class_name,
			});

		return this.state.opts.out_dir.write_file(`${this.file_path}.ts`, type_ts);
	}
}

export class Enum {
	constructor(
		public out_dir: string,
		public class_name: string,
		public switch_node: lnk.Enum,
		public state: CompilerState
	) { }

	public get file_path() {
		return `${this.out_dir}/${this.class_name}`;
	}

	public emit() {
		return Promise.resolve();
	}
}

export class Switch {
	constructor(
		public out_dir: string,
		public class_name: string,
		public switch_node: lnk.Switch,
		public state: CompilerState
	) { }

	public get file_path() {
		return `${this.out_dir}/${this.class_name}`;
	}

	public emit() {
		const imports: tmpl.ImportTemplateOpts[] = [ ];
		const generator_comment = tmpl.generator_comment_template(this.state.opts.no_generator_comment);

		const enum_type = this.switch_node.arg_type.points_to;

		const type_ts
			= generator_comment
			+ tmpl.switch_template({
				file_path: this.file_path,
				switch_name: this.class_name,
				switch_comments: this.switch_node.comments.map((comment) => comment.content),
				enum_name: enum_type.name,
				enum_file_path: '',
				branches: [ ],
				default: { is_void: false, is_invalid: true },
			});

		return this.state.opts.out_dir.write_file(`${this.file_path}.ts`, type_ts);
	}
}
