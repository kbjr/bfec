
import * as lnk from '../../linker';
import * as tmpl from './templates';
import { CompilerState } from './state';

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

	public emit() {
		const imports: tmpl.ImportTemplateOpts[] = [ ];
		const generator_comment = tmpl.generator_comment_template(this.state.opts.no_generator_comment);

		const type_ts
			= generator_comment
			+ tmpl.struct_template({
				ts_struct: this,
				struct_comments: this.node.comments.map((comment) => comment.content),
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
		public name: string,
		public node: lnk.Enum,
		public state: CompilerState
	) { }

	public get file_path() {
		return `${this.out_dir}/${this.name}`;
	}

	public emit() {
		return Promise.resolve();
	}
}

export class Switch {
	constructor(
		public out_dir: string,
		public name: string,
		public node: lnk.Switch,
		public state: CompilerState
	) { }

	public get file_path() {
		return `${this.out_dir}/${this.name}`;
	}

	public emit() {
		const imports: tmpl.ImportTemplateOpts[] = [ ];
		const generator_comment = tmpl.generator_comment_template(this.state.opts.no_generator_comment);

		const enum_type = this.node.arg_type.points_to;
		const ts_enum = this.state.ts_enums.get(enum_type);
		const branches_opts = this.node.cases.map((branch) : tmpl.SwitchBranchOpts => {
			if (branch.is_void) {
				return {
					enum_member: branch.case_name,
					branch_type: 'void',
				};
			}
			
			if (branch.is_invalid) {
				return {
					enum_member: branch.case_name,
					branch_type: 'invalid'
				};
			}

			switch (branch.case_type.type) {
				case 'enum_ref':
					const enum_node = branch.case_type.points_to;
					const ts_enum = this.state.ts_enums.get(enum_node);

					return {
						enum_member: branch.case_name,
						branch_type: 'enum',
						file: ts_enum.file_path,
						type: ts_enum.name
					};
					
				case 'struct_ref':
					// 
					break;
					
				case 'switch_ref':
					// 
					break;

				case 'const_int':
				case 'const_string':
					// 
					break;
			}

			// FIXME: Remove, should be unreachable
			return {
				enum_member: branch.case_name,
				branch_type: 'invalid'
			};
		});

		const type_ts
			= generator_comment
			+ tmpl.switch_template({
				ts_switch: this,
				switch_comments: this.node.comments.map((comment) => comment.content),
				enum_name: ts_enum.name,
				enum_file_path: ts_enum.file_path,
				branches: branches_opts,
				default: { branch_type: 'void' },
			});

		return this.state.opts.out_dir.write_file(`${this.file_path}.ts`, type_ts);
	}
}
