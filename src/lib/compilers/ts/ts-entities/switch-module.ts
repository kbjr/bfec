
import * as lnk from '../../../linker';
import { TSModule } from './module';
import { TSFunction } from './function';
import { TSTypeBranchAlias } from './type-branch-alias';
import { generator_comment_template } from '../templates';
import { TSEnum } from './enum';
import { TSImportedRef } from './import';
import { TSTypeParam } from './type-param';
import { TSSwitchStatement } from './switch';

export class TSSwitchModule extends TSModule {
	public bfec_switch: lnk.Switch;

	public ts_enum: TSImportedRef<TSEnum>;
	public ts_type: TSTypeBranchAlias;
	public ts_encode: TSFunction;
	public ts_decode: TSFunction;
	public encode_switch: TSSwitchStatement;
	public decode_switch: TSSwitchStatement;

	public build() {
		this.import_util('$State');
		this.import_enum();
		this.build_type();
		this.build_encoder();
		// this.build_decoder();
	}

	public get module_str() {
		return `\n${this.imports_str}\n${this.ts_type.decl_str}\n${this.obj_str}\n`;
	}

	private get obj_str() {
		return `export const ${this.name} = Object.freeze({\n\t${this.ts_encode.decl_obj_str},\n\t${this.ts_decode.decl_obj_str}\n});`;
	}

	public emit() {
		const type_ts
			= generator_comment_template(this.state.opts.no_generator_comment)
			+ this.module_str;

		return this.state.opts.out_dir.write_file(`${this.file_path}.ts`, type_ts);
	}

	private import_enum() {
		const enum_module = this.state.ts_enums.get(this.bfec_switch.arg_type.points_to);

		if (! enum_module) {
			this.state.error(this.bfec_switch.arg_type, 'Encountered a reference to an enum that was not collected');
			return;
		}

		this.ts_enum = this.import(enum_module.ts_enum);
	}

	private build_type() {
		this.ts_type = new TSTypeBranchAlias();
		this.ts_type.type = this.ts_enum.ref_str;
		this.ts_type.cases = this.bfec_switch.cases.map(this.branch_type);
		// this.ts_type.default_type
	}

	private branch_type = (branch: lnk.SwitchCase) : [ sub_type: string, result_type: string ] => {
		const sub_type = `${this.ts_enum.ref_str}.${branch.case_name}`;

		if (branch.is_void) {
			return [ sub_type, 'void' ];
		}
		
		if (branch.is_invalid) {
			return [ sub_type, 'never' ];
		}

		switch (branch.case_type.type) {
			case 'enum_ref':
				const enum_node = branch.case_type.points_to;
				const enum_module = this.state.ts_enums.get(enum_node);
				const ts_enum = this.import(enum_module.ts_enum);

				return [ sub_type, ts_enum.ref_str ];
				
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
		return [ sub_type, 'unknown' ];
	};

	private build_encoder() {
		this.ts_encode = new TSFunction();
		this.ts_encode.name = '$encode';

		const type_param = new TSTypeParam();
		this.ts_encode.type_params.push(type_param);
		type_param.name = '$T';
		type_param.extends = this.ts_enum.ref_str;
		type_param.default = this.ts_enum.ref_str;

		this.import_util('$State');
		this.ts_encode.params.push(
			[ '$state', '$State' ],
			[ '$case', '$T' ],
			[ '$inst', `${this.name}<$T>` ]
		);

		this.encode_switch = new TSSwitchStatement();
		this.encode_switch.ts_enum = this.ts_enum;
		this.encode_switch.param = '$case';
		this.encode_switch.cases.push(
			...this.bfec_switch.cases.map(this.encode_branch)
		);
		this.encode_switch.default_expr = this.encode_default(this.bfec_switch.default);

		this.ts_encode.statements.push(this.encode_switch.stmt_str);
	}

	private encode_branch = (branch: lnk.SwitchCase) : [ case_expr: string, result_expr: string ] => {
		const case_expr = `${this.ts_enum.ref_str}.${branch.case_name}`;

		if (branch.is_void) {
			return [ case_expr, 'return void 0;' ];
		}
		
		if (branch.is_invalid) {
			return [ case_expr, `$state.fatal(\`${this.name}: Encountered invalid case: \${$case}\`);` ];
		}

		switch (branch.case_type.type) {
			case 'enum_ref':
				const enum_node = branch.case_type.points_to;
				const enum_module = this.state.ts_enums.get(enum_node);
				const ts_enum = this.import(enum_module.ts_enum);

				return [ case_expr, `return ${ts_enum.ref_str}.$encode($state, $inst);` ];
				
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
		return [ case_expr, '$state.fatal(`Not yet implemented`);' ];
	};

	private encode_default(branch: lnk.SwitchDefault) {
		if (branch.is_void) {
			return 'return void 0;';
		}
		
		if (branch.is_invalid) {
			return `$state.fatal(\`${this.name}: Encountered invalid case: \${$case}\`);`;
		}

		switch (branch.default_type.type) {
			case 'enum_ref':
				const enum_node = branch.default_type.points_to;
				const enum_module = this.state.ts_enums.get(enum_node);
				const ts_enum = this.import(enum_module.ts_enum);

				return `return ${ts_enum.ref_str}.$encode($state, $inst);`;
				
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
		return '$state.fatal(`Not yet implemented`);';
	}

	// private build_decoder() {
	// 	this.ts_encode = new TSFunction();
	// 	this.ts_encode.name = '$encode';
	// 	this.ts_encode.type_params
	// 	this.ts_encode.params = [
	// 		[ '$state', '$State' ],
	// 		[ '$case', this. ],
	// 		[ '$inst', this. ],
	// 	]
	// 	this.ts_encode.return_type
	// 	this.ts_encode.statements
	// }
}
