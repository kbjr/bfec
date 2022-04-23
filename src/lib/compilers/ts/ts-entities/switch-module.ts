
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

		this.ts_default = this.bfec_switch.default
			? TSSwitchBranch.from_bfec(this.state, this.bfec_switch.default)
			: new TSSwitchBranch();
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
		if (! branch) {
			ts_case.result_type = new TSNever();
		}

		else if (branch.is_void) {
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
			...this.ts_cases.map(this.encode_branch)
		);
		this.encode_switch.default_expr = this.encode_default(this.ts_default);

		this.ts_encode.statements.push(this.encode_switch.stmt_str);

		this.ts_namespace.contents.push(
			this.ts_encode.decl_ns_str
		);
	}

	private encode_branch = (branch: TSSwitchBranch<lnk.SwitchCase>) : [ case_expr: string, result_expr: string ] => {
		return [ branch.case_name, branch.encode_str(this) ];
	};

	private encode_default(branch: TSSwitchBranch<lnk.SwitchDefault>) {
		return branch.encode_str(this);
	}

	private build_decoder() {
		const type_param = new TSTypeParam();
		this.ts_decode.type_params.push(type_param);
		type_param.name = '$T';
		type_param.extends = this.ts_enum.ref_str;
		type_param.default = this.ts_enum.ref_str;
		
		this.ts_decode.params = [
			[ '$state', '$State' ],
			[ '$case', '$T' ],
			// [ '$inst', this. ],
		];

		this.ts_decode.return_type = `${this.name}<$T>`;

		this.decode_switch = new TSSwitchStatement();
		this.decode_switch.ts_enum = this.ts_enum;
		this.decode_switch.param = '$case';
		this.decode_switch.cases.push(
			...this.ts_cases.map(this.decode_branch)
		);
		
		this.decode_switch.default_expr = this.decode_default(this.ts_default);

		this.ts_decode.statements.push(this.decode_switch.stmt_str);

		this.ts_namespace.contents.push(
			this.ts_decode.decl_ns_str
		);
	}

	private decode_branch = (branch: TSSwitchBranch) : [ case_expr: string, result_expr: string ] => {
		return [ branch.case_name, branch.decode_str(this) ];
	};
	
	private decode_default(branch: TSSwitchBranch<lnk.SwitchDefault>) {
		return branch.decode_str(this);
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
	public bfec_case?: T;
	public result_type?: TSFieldType;

	public get result_type_str() {
		if (! this.bfec_case) {
			return 'never';
		}

		if (this.bfec_case.is_void) {
			return '$V';
		}

		if (this.bfec_case.is_invalid) {
			return 'never';
		}

		return this.result_type.field_type();
	}

	public encode_str(ts_switch: TSSwitchModule) {
		if (! this.bfec_case) {
			return `$state.fatal(\`${ts_switch.name}: Encountered invalid case: \${$case}\`);`;
		}

		if (this.bfec_case.is_void) {
			// TODO: In the case of `void` when encoding, `$inst` should be either `undefined`
			// (in which case we do nothing) or the base type of a refinement (which should be
			// written without modification)
			return 'return void ($inst != null && $state.write_inst_somehow($inst));';
		}
		
		if (this.bfec_case.is_invalid) {
			return `$state.fatal(\`${ts_switch.name}: Encountered invalid case: \${$case}\`);`;
		}

		return this.result_type.encode_aligned('$inst');
	}

	public decode_str(ts_switch: TSSwitchModule) {
		if (! this.bfec_case) {
			return `$state.fatal(\`${ts_switch.name}: Encountered invalid case: \${$case}\`);`;
		}

		if (this.bfec_case.is_void) {
			return 'return void 0;';
		}
		
		if (this.bfec_case.is_invalid) {
			return `$state.fatal(\`${ts_switch.name}: Encountered invalid case: \${$case}\`);`;
		}

		return this.result_type.decode_aligned((x) => `return ${x};`);
	}

	public get case_name() {
		return (this.bfec_case as lnk.SwitchCase).case_name;
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
