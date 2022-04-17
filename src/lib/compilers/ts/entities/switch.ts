
import * as lnk from '../../../linker';
import * as tmpl from '../templates';
import { CompilerState } from '../state';

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

	public get imports() : tmpl.ImportTemplateOpts[] {
		return [ ];
	}

	public get comments() {
		const { comments } = this.node;

		return comments && comments.length
			? tmpl.doc_comments_template(comments.map((comment) => comment.content))
			: '';
	}

	public get ts_enum() {
		return this.state.ts_enums.get(this.node.arg_type.points_to);
	}

	public get branches() {
		return this.node.cases.map((branch) : tmpl.SwitchBranchOpts => {
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
	}

	public get default() {
		return { branch_type: 'void' as const };
	}

	public emit() {
		const generator_comment = tmpl.generator_comment_template(this.state.opts.no_generator_comment);

		const type_ts
			= generator_comment
			+ tmpl.switch_template({
				ts_switch: this,
				ts_enum: this.ts_enum,
				branches: this.branches,
				default: this.default,
			});

		return this.state.opts.out_dir.write_file(`${this.file_path}.ts`, type_ts);
	}
}
