
import * as lnk from '../../../linker';
import { TSModule } from './module';
import { TSEnum } from './enum';
import { TSNamespace } from './namespace';
import { generator_comment_template } from '../templates';
import { CompilerState } from '../state';
import { TSFunction } from './function';
import { builtins } from './builtins';
import { Assign, TSNever } from './types';

export class TSEnumModule extends TSModule {
	public ts_enum = new TSEnum();
	public ts_type: builtins.TSBuiltin;
	public ts_namespace = new TSNamespace();
	public ts_encode_aligned = new TSFunction();
	public ts_encode_unaligned = new TSFunction();
	public ts_decode_aligned = new TSFunction();
	public ts_decode_unaligned = new TSFunction();

	constructor(
		dir: string,
		name: string,
		state: CompilerState,
		public bfec_enum: lnk.Enum
	) {
		super(dir, name, state);
		this.ts_enum.name = this.name;
		this.ts_enum.module = this;
		this.ts_type = new builtins.TSBuiltin(this.state, this.bfec_enum.member_type);
		this.ts_namespace.name = this.name;
		this.ts_namespace.module = this;
		this.ts_encode_aligned.module = this;
		this.ts_encode_aligned.name = '$encode_aligned';
		this.ts_encode_unaligned.module = this;
		this.ts_encode_unaligned.name = '$encode_unaligned';
		this.ts_decode_aligned.module = this;
		this.ts_decode_aligned.name = '$decode_aligned';
		this.ts_decode_unaligned.module = this;
		this.ts_decode_unaligned.name = '$decode_unaligned';
	}

	public get module_str() {
		return `\n${this.imports_str}\n${this.consts_str}\n${this.ts_enum.decl_str}\n${this.ts_namespace.decl_str}\n`;
	}
	
	public build() {
		this.state.ts_module = this;
		this.import_util('$State');
		this.build_enum();
		this.build_namespace();
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

	public emit() {
		const type_ts
			= generator_comment_template(this.state.opts.no_generator_comment)
			+ this.module_str;

		return this.state.opts.out_dir.write_file(`${this.file_path}.ts`, type_ts);
	}

	private on_link: (() => void)[] = [ ];

	private build_enum() {
		for (const member of this.bfec_enum.members) {
			// TODO: Comments
			this.ts_enum.members.push([
				member.name,
				// TODO: TypeScript safe encoding of const expr
				member.value.token.text
			]);
		}
	}

	private build_namespace() {
		this.ts_encode_aligned.params.push(
			[ '$state', '$State' ],
			[ '$value', this.name ],
		);
		this.ts_encode_aligned.statements.push(
			this.ts_type.encode_aligned('$value')
		);
		
		this.ts_encode_unaligned.params.push(
			[ '$state', '$State' ],
			[ '$value', this.name ],
		);
		this.ts_encode_unaligned.statements.push(
			this.ts_type.encode_unaligned('$value')
		);
		
		this.ts_decode_aligned.return_type = this.name;
		this.ts_decode_aligned.params.push(
			[ '$state', '$State' ],
		);
		this.ts_decode_aligned.statements.push(
			this.ts_type.decode_aligned((x) => `return ${x} as ${this.name};`)
		);
		
		this.ts_decode_unaligned.return_type = this.name;
		this.ts_decode_unaligned.params.push(
			[ '$state', '$State' ],
		);
		this.ts_decode_unaligned.statements.push(
			this.ts_type.decode_unaligned((x) => `return ${x} as ${this.name};`)
		);

		this.ts_namespace.contents.push(
			this.ts_encode_aligned.decl_ns_str,
			this.ts_encode_unaligned.decl_ns_str,
			this.ts_decode_aligned.decl_ns_str,
			this.ts_decode_unaligned.decl_ns_str,
		);
	}
}

export class TSEnumRef {
	constructor(
		public ts_enum: TSEnumModule,
	) { }

	public static from_ref(state: CompilerState, ref: lnk.EnumRef) {
		const enum_module = state.ts_enums.get(ref.points_to);

		if (! enum_module) {
			state.error(ref, 'Encountered reference to uncollected type');
			return new TSNever();
		}

		return new TSEnumRef(enum_module);
	}

	public import_into(module: TSModule) {
		module.import(this.ts_enum.ts_enum);
	}
	
	public field_type() {
		return this.ts_enum.name;
	}

	public encode_aligned(value_expr: string) {
		return `${this.ts_enum.name}.$encode_aligned($state, ${value_expr});`;
	}

	public encode_unaligned(value_expr: string) {
		return `${this.ts_enum.name}.$encode_unaligned($state, ${value_expr});`;
	}

	public decode_aligned(assign: Assign) {
		return assign(`${this.ts_enum.name}.$decode_aligned($state)`);
	}

	public decode_unaligned(assign: Assign) {
		return assign(`${this.ts_enum.name}.$decode_unaligned($state)`);
	}
}
