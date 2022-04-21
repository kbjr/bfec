
import * as lnk from '../../../linker';
import { TSModule } from './module';
import { TSInterface } from './interface';
import { TSTypeParam } from './type-param';
import { CompilerState } from '../state';
import { builtins } from './builtins';
import { generator_comment_template } from '../templates';
import { TSFunction } from './function';
import { TSNamespace } from './namespace';
import { decode, encode } from './types';

export class TSStructModule extends TSModule {
	public bfec_struct: lnk.Struct;

	public ts_iface = new TSInterface();
	public ts_namespace = new TSNamespace();
	public ts_encode = new TSFunction();
	public ts_decode = new TSFunction();

	constructor(dir: string, name: string, state: CompilerState) {
		super(dir, name, state);
		this.ts_iface.name = this.name;
		this.ts_iface.module = this;
		this.ts_namespace.name = this.name;
		this.ts_namespace.module = this;
		this.ts_encode.name = '$encode';
		this.ts_encode.module = this;
		this.ts_decode.name = '$decode';
		this.ts_decode.module = this;
	}

	public get module_str() {
		return `\n${this.imports_str}\n${this.consts_str}\n${this.ts_iface.decl_str}\n${this.ts_namespace.decl_str}\n`;
	}

	public get is_root() {
		return this.bfec_struct.name === '$';
	}

	public get is_byte_aligned() {
		return this.bfec_struct.is_byte_aligned;
	}

	public build() {
		this.state.ts_module = this;
		this.import_util('$State');
		this.build_iface();
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

	private build_iface() {
		if (this.bfec_struct.params) {
			this.ts_iface.type_params.push(
				...this.bfec_struct.params.map(this.build_iface_param)
			);
		}

		const extend: string[] = [ ];

		for (const field of this.bfec_struct.fields) {
			if (field.type === 'struct_field') {
				this.ts_iface.add_field(field);
			}

			else if (field.type === 'struct_expansion') {
				// TODO: Import
				// TODO: Params
				extend.push(field.expanded_type.name);
			}
		}

		if (extend.length) {
			this.ts_iface.extends = extend.join(', ');
		}
	}

	private build_iface_param = (param: lnk.StructParam) => {
		const ts_param = new TSTypeParam();
		ts_param.name = param.name;

		if (param.param_type.type === 'enum_ref') {
			const enum_module = this.state.ts_enums.get(param.param_type.points_to);

			if (! enum_module) {
				this.state.error(param.param_type, 'Encountered reference to uncollected type');
				return;
			}

			this.on_link.push(() => {
				const ts_enum = this.import(enum_module.ts_enum);
				ts_param.extends = ts_enum.ref_str;
				ts_param.default = ts_enum.ref_str;
			});
		}

		else {
			const type = builtins.field_type(this.state, param.param_type);
			ts_param.extends = type;
			ts_param.default = type;
		}

		return ts_param;
	};

	private build_namespace() {
		this.build_encode();
		this.build_decode();

		this.ts_namespace.contents.push(
			this.ts_encode.decl_ns_str,
			this.ts_decode.decl_ns_str,
		);
	}

	private build_encode() {
		this.ts_encode.params.push(
			[ '$state', '$State' ],
			[ '$inst', this.name ],
		);
		
		if (this.is_root) {
			this.ts_encode.statements.push(`$state.step_down('$', $inst);`);
		}

		for (const field of this.bfec_struct.fields) {
			if (field.type === 'struct_field') {
				this.build_field_encode(field);
			}

			else if (field.type === 'struct_expansion') {
				this.build_expansion_encode(field);
			}
		}
		
		if (this.is_root) {
			this.ts_encode.statements.push(`$state.step_up();`);
		}
	}

	private build_field_encode(field: lnk.StructField) {
		if (field.has_field_value) {
			// 
		}

		const encode_expr = encode(this.state, field.field_type, this, `$inst.${field.name}`);
		this.ts_encode.statements.push(`$state.step_down('${field.name}', $inst.${field.name});`);
		this.ts_encode.statements.push(encode_expr + ';');
		this.ts_encode.statements.push(`$state.step_up();`);
	}

	private build_expansion_encode(field: lnk.StructExpansion) {
		this.ts_encode.statements.push('// struct expansion not yet implemented');
	}

	private build_decode() {
		this.ts_decode.params.push(
			[ '$state', '$State' ],
		);
		this.ts_decode.return_type = this.name;
		this.ts_decode.statements.push(`const $inst = { } as ${this.name};`);
		
		if (this.is_root) {
			this.ts_decode.statements.push(`$state.step_down('$', $inst);`);
		}

		for (const field of this.bfec_struct.fields) {
			if (field.type === 'struct_field') {
				this.build_field_decode(field);
			}

			else if (field.type === 'struct_expansion') {
				this.build_expansion_decode(field);
			}
		}
		
		if (this.is_root) {
			this.ts_decode.statements.push(`$state.step_up();`);
		}
		
		this.ts_decode.statements.push(`return $inst;`);
	}

	private build_field_decode(field: lnk.StructField) {
		if (field.has_field_value) {
			// 
		}

		const decode_expr = decode(this.state, field.field_type, this);
		this.ts_decode.statements.push(`$state.step_down('${field.name}');`);
		this.ts_decode.statements.push(`$inst.${field.name} = ${decode_expr};`);
		this.ts_decode.statements.push(`$state.step_up();`);
	}

	private build_expansion_decode(field: lnk.StructExpansion) {
		this.ts_encode.statements.push('// struct expansion not yet implemented');
	}
}

export class TSStructRef {
	constructor(
		public ts_struct: TSStructModule,
		public params: string[]
	) { }

	public static from_ref(state: CompilerState, ref: lnk.StructRef) {
		const ts_struct = state.ts_structs.get(ref.points_to);
		const params = ref.params.map((param) => {
			return `(todo: ref to ${param.name})`;
		});

		return new TSStructRef(ts_struct, params);
	}

	public get ref_str() {
		return '(todo: TSStructRef.ref_str)';
	}
}
