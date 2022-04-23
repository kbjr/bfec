
import * as lnk from '../../../linker';
import { TSModule } from './module';
import { TSFunction } from './function';
import { TSTypeBranch, TSTypeBranchAlias } from './type-branch-alias';
import { generator_comment_template } from '../templates';
import { TSEnum } from './enum';
import { TSImportedRef } from './import';
import { TSTypeParam } from './type-param';
import { TSSwitchStatement } from './switch';
import { TSEnumRef } from './enum-module';
import { CompilerState } from '../state';
import { TSNamespace } from './namespace';
import { Assign, create_ts_field_type, TSFieldType, TSNever } from './types';

export class TSSwitchModule extends TSModule {
	public ts_enum: TSImportedRef<TSEnum>;
	public ts_cases: TSSwitchBranch<lnk.SwitchCase>[];
	public ts_default: TSSwitchBranch<lnk.SwitchDefault>;
	public ts_type = new TSTypeBranchAlias();
	public ts_namespace = new TSNamespace();
	public ts_encode = new TSFunction();
	public ts_decode = new TSFunction();
	public encode_switch = new TSSwitchStatement();
	public decode_switch = new TSSwitchStatement();

	constructor(
		dir: string,
		name: string,
		state: CompilerState,
		public bfec_switch: lnk.Switch
	) {
		super(dir, name, state);
		this.ts_type.name = this.name;
		this.ts_type.module = this;
		this.ts_namespace.name = this.name;
		this.ts_namespace.module = this;
		this.ts_encode.name = '$encode';
		this.ts_encode.module = this;
		this.ts_decode.name = '$decode';
		this.ts_decode.module = this;
	}

	public build() {
		this.state.ts_module = this;
		this.import_util('$State');
		this.import_enum();
		this.build_cases();
		this.build_type();
		this.build_encoder();
		this.build_decoder();
		this.state.ts_module = null;
	}

	public link() {
		this.state.ts_module = this;
		for (const func of this.on_link) {
			func();
		}

		this.on_link.length = 0;
		this.state.ts_module = null;
	}

	public get module_str() {
		return `\n${this.imports_str}\n${this.consts_str}\n${this.ts_type.decl_str}\n${this.ts_namespace.decl_str}\n`;
	}

	public emit() {
		const type_ts
			= generator_comment_template(this.state.opts.no_generator_comment)
			+ this.module_str;

		return this.state.opts.out_dir.write_file(`${this.file_path}.ts`, type_ts);
	}

	private on_link: (() => void)[] = [ ];

	private import_enum() {
		const enum_module = this.state.ts_enums.get(this.bfec_switch.arg_type.points_to);

		if (! enum_module) {
			this.state.error(this.bfec_switch.arg_type, 'Encountered a reference to an enum that was not collected');
			return;
		}

		this.ts_enum = this.import(enum_module.ts_enum);
	}

	private build_cases() {
		this.ts_cases = [ ];

		for (const branch of this.bfec_switch.cases) {
			this.ts_cases.push(TSSwitchBranch.from_bfec(this.state, branch));
		}

		this.ts_default = TSSwitchBranch.from_bfec(this.state, this.bfec_switch.default);
	}

	private build_type() {
		this.ts_type.type = this.ts_enum.ref_str;

		for (const ts_case of this.ts_cases) {
			this.build_type_branch(ts_case.bfec_case, this.ts_type.add_case(`${this.ts_enum.ref_str}.${ts_case.bfec_case.case_name}`));
		}

		this.ts_type.add_default();
		this.build_type_branch(this.bfec_switch.default, this.ts_type.default_type);
	}

	private build_type_branch(branch: lnk.SwitchCase | lnk.SwitchDefault, ts_case: TSTypeBranch) {
		if (branch.is_void) {
			ts_case.result_type = '$V';
		}
		
		else if (branch.is_invalid) {
			ts_case.result_type = new TSNever();
		}

		else {
			const type = create_ts_field_type(this.state, branch.type === 'switch_case' ? branch.case_type : branch.default_type);
			ts_case.result_type = type;
		}
	}

	private build_encoder() {
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

		this.ts_namespace.contents.push(
			this.ts_encode.decl_ns_str
		);
	}

	private encode_branch = (branch: lnk.SwitchCase) : [ case_expr: string, result_expr: string ] => {
		if (branch.is_void) {
			// TODO: In the case of `void` when encoding, `$inst` should be either `undefined`
			// (in which case we do nothing) or the base type of a refinement (which should be
			// written without modification)
			return [ branch.case_name, 'return void ($inst != null && $state.write_inst_somehow($inst));' ];
		}
		
		if (branch.is_invalid) {
			return [ branch.case_name, `$state.fatal(\`${this.name}: Encountered invalid case: \${$case}\`);` ];
		}

		switch (branch.case_type.type) {
			case 'enum_ref': {
				const enum_node = branch.case_type.points_to;
				const enum_module = this.state.ts_enums.get(enum_node);
				
				if (! enum_module) {
					// this.state.error(enum_node, 'Encountered a reference to an uncollected type');
					return [ branch.case_name, `$state.fatal('Switch case failed to compile');` ];
				}

				const ts_enum = this.import(enum_module.ts_enum);
				return [ branch.case_name, `return ${ts_enum.ref_str}.$encode($state, $inst);` ];
			}
				
			case 'struct_ref': {
				const struct_node = branch.case_type.points_to;
				const struct_module = this.state.ts_structs.get(struct_node);

				if (! struct_module) {
					// this.state.error(struct_node, 'Encountered a reference to an uncollected type');
					return [ branch.case_name, `$state.fatal('Switch case failed to compile');` ];
				}

				const ts_namespace = this.import(struct_module.ts_namespace);
				return [ branch.case_name, `return ${ts_namespace.ref_str}.$encode($state, $inst);` ];
			}
				
			case 'switch_ref': {
				const switch_node = branch.case_type.points_to;
				const switch_module = this.state.ts_switches.get(switch_node);

				if (! switch_module) {
					// this.state.error(switch_node, 'Encountered a reference to an uncollected type');
					return [ branch.case_name, `$state.fatal('Switch case failed to compile');` ];
				}

				const ts_namespace = this.import(switch_module.ts_namespace);
				return [ branch.case_name, `return ${ts_namespace.ref_str}.$encode($state, $inst);` ];
			}

			case 'const_int':
			case 'const_string':
				// 
				break;
		}

		// FIXME: Remove, should be unreachable
		return [ branch.case_name, '$state.fatal(`Not yet implemented`);' ];
	};

	private encode_default(branch: lnk.SwitchDefault) {
		if (branch.is_void) {
			return 'return void 0;';
		}
		
		if (branch.is_invalid) {
			return `$state.fatal(\`${this.name}: Encountered invalid case: \${$case}\`);`;
		}

		switch (branch.default_type.type) {
			// return `return ${branch.default_type.}`
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

	private build_decoder() {
		// this.ts_decode.type_params
		// this.ts_decode.params = [
		// 	[ '$state', '$State' ],
		// 	[ '$case', this. ],
		// 	[ '$inst', this. ],
		// ]
		// this.ts_decode.return_type
		// this.ts_decode.statements
		

		this.ts_namespace.contents.push(
			this.ts_decode.decl_ns_str
		);
	}
}

export class TSSwitchRef {
	constructor(
		public ts_switch: TSSwitchModule,
		public param: null
	) { }

	public static from_ref(state: CompilerState, ref: lnk.SwitchRef) {
		const switch_module = state.ts_switches.get(ref.points_to);

		if (! switch_module) {
			state.error(ref, 'Encountered reference to uncollected type');
			return new TSNever();
		}

		// TODO: Param
		return new TSSwitchRef(switch_module, null);
	}

	public import_into(module: TSModule) {
		module.import(this.ts_switch.ts_type);
	}

	public field_type() {
		// TODO: param
		return this.ts_switch.name;
	}

	public encode_aligned(value_expr: string) {
		return `$state.fatal('Failed to compile switch encoder');`;
	}

	public encode_unaligned(value_expr: string) {
		return `$state.fatal('Failed to compile switch encoder');`;
	}

	public decode_aligned(assign: Assign) {
		return `$state.fatal('Failed to compile switch decoder');`;
	}

	public decode_unaligned(assign: Assign) {
		return `$state.fatal('Failed to compile switch decoder');`;
	}
}

export class TSSwitchBranch<T extends lnk.SwitchCase | lnk.SwitchDefault = lnk.SwitchCase | lnk.SwitchDefault> {
	public bfec_case: T;
	public result_type?: TSFieldType;

	public get result_type_str() {
		if (this.bfec_case.is_void) {
			return '$V';
		}

		if (this.bfec_case.is_invalid) {
			return 'never';
		}

		return this.result_type.field_type();
	}

	public static from_bfec<T extends lnk.SwitchCase | lnk.SwitchDefault = lnk.SwitchCase | lnk.SwitchDefault>(state: CompilerState, bfec_case: T) : TSSwitchBranch<T> {
		const ts_case = new TSSwitchBranch<T>();
		ts_case.bfec_case = bfec_case;

		if (! bfec_case.is_void && ! bfec_case.is_invalid) {
			const result_type = bfec_case.type === 'switch_case' ? bfec_case.case_type : bfec_case.default_type;
			ts_case.result_type = create_ts_field_type(state, result_type);
		}

		return ts_case;
	}
}
