
import * as lnk from '../../../linker';
import { TSModule } from './module';
import { TSClass } from './class';
import { TSInterface } from './interface';
import { generator_comment_template } from '../templates';
import { TSTypeParam } from './type-param';

export class TSStructModule extends TSModule {
	public bfec_struct: lnk.Struct;

	public ts_iface: TSInterface;
	public ts_class: TSClass;

	public get module_str() {
		return `\n${this.imports_str}\n${this.ts_iface.decl_str}\n${this.ts_class.decl_str}\n`;
	}

	public build() {
		this.build_iface();
		this.build_class();
	}

	public emit() {
		const type_ts
			= generator_comment_template(this.state.opts.no_generator_comment)
			+ this.module_str;

		return this.state.opts.out_dir.write_file(`${this.file_path}.ts`, type_ts);
	}

	private build_iface() {
		this.ts_iface = new TSInterface();
		this.ts_iface.type_params.push(
			...this.bfec_struct.params.map((param) => {
				const ts_param = new TSTypeParam();
				ts_param.name = param.name;

				if (param.param_type.type === 'enum_ref') {
					const enum_module = this.state.ts_enums.get(param.param_type.points_to);

					if (! enum_module) {
						this.state.error(param.param_type, 'Encountered reference to uncollected type');
						return;
					}

					const ts_enum = this.import(enum_module.ts_enum);
					ts_param.extends = ts_enum.ref_str;
					ts_param.default = ts_enum.ref_str;
				}

				else {
					// TODO: Built-ins
				}

				return ts_param;
			})
		)

		for (const field of this.bfec_struct.fields) {
			if (field.type === 'struct_field') {
				// 
			}

			else if (field.type === 'struct_expansion') {
				// 
			}
		}
	}

	private build_class() {
		this.ts_class = new TSClass();
		// 
	}
}
