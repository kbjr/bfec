
import * as lnk from '../../../linker';
import { TSModule } from './module';
import { TSEnum } from './enum';
import { TSNamespace } from './namespace';
import { generator_comment_template } from '../templates';

export class TSEnumModule extends TSModule {
	public bfec_enum: lnk.Enum;

	public ts_enum: TSEnum;
	public ts_namespace: TSNamespace;

	public get module_str() {
		return `\n${this.imports_str}\n`;
		// return `\n${this.imports_str}\n${this.ts_enum.decl_str}\n${this.ts_namespace.decl_str}\n`;
	}

	public emit() {
		const type_ts
			= generator_comment_template(this.state.opts.no_generator_comment)
			+ this.module_str;

		return this.state.opts.out_dir.write_file(`${this.file_path}.ts`, type_ts);
	}
}
