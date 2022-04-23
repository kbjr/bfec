
import * as lnk from '../../../linker';
import { TSModule } from './module';
import { TSInterface } from './interface';
import { TSTypeParam } from './type-param';
import { CompilerState } from '../state';
import { builtins } from './builtins';
import { generator_comment_template } from '../templates';
import { TSFunction } from './function';
import { TSNamespace } from './namespace';
import { Assign, TSFieldType, create_ts_field_type, TSNever } from './types';
import { TSEnumRef } from './enum-module';

export class TSStructModule extends TSModule {
	public ts_iface = new TSInterface();
	public ts_namespace = new TSNamespace();
	public ts_encode = new TSFunction();
	public ts_decode = new TSFunction();
	public ts_fields: (TSStructField | TSStructExpansion)[];

	constructor(
		dir: string,
		name: string,
		state: CompilerState,
		public bfec_struct: lnk.Struct
	) {
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
		this.build_fields();
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

	private build_fields() {
		this.ts_fields = [ ];

		for (const field of this.bfec_struct.fields) {
			if (field.type === 'struct_field') {
				this.ts_fields.push(
					TSStructField.from_schema(this.state, field)
				);
			}

			else if (field.type === 'struct_expansion') {
				this.ts_fields.push(
					TSStructExpansion.from_schema(this.state, field)
				); 
			}
		}
	}

	private build_iface() {
		if (this.bfec_struct.params) {
			this.ts_iface.type_params.push(
				...this.bfec_struct.params.map(this.build_iface_param)
			);
		}

		const extend: string[] = [ ];

		for (const field of this.ts_fields) {
			if (field instanceof TSStructField) {
				this.ts_iface.add_field(field);
			}

			else if (field instanceof TSStructExpansion) {
				extend.push(field.extend);
			}
		}

		if (extend.length) {
			this.ts_iface.extends = extend.join(', ');
		}
	}

	private build_iface_param = (param: lnk.StructParam) => {
		const ts_param = new TSTypeParam();
		ts_param.name = param.name;

		const type = create_ts_field_type(this.state, param.param_type) as builtins.TSBuiltin | TSEnumRef;
		ts_param.extends = type.field_type();
		ts_param.default = type.field_type();
		
		if (type instanceof TSEnumRef) {
			type.import_into(this);
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
		this.state.ts_function = this.ts_encode;
		this.ts_encode.params.push(
			[ '$state', '$State' ],
			[ '$inst', this.name ],
		);
		
		if (this.is_root) {
			this.ts_encode.statements.push(`$state.step_down('$', $inst);`);
		}

		for (const field of this.ts_fields) {
			if (field instanceof TSStructField) {
				this.build_field_encode(field);
			}

			else {
				this.build_expansion_encode(field);
			}
		}
		
		if (this.is_root) {
			this.ts_encode.statements.push(`$state.step_up();`);
		}

		this.state.ts_function = null;
	}

	private build_field_encode(field: TSStructField) {
		if (field.bfec_field.has_field_value) {
			// 
		}

		if (field.bfec_field.condition) {
			// 
		}

		// TODO: unaligned?
		const encode_expr = field.field_type.encode_aligned(`$inst.${field.name}`);
		this.ts_encode.statements.push(`$state.step_down('${field.name}', $inst.${field.name});`);
		this.ts_encode.statements.push(encode_expr || 'null');
		this.ts_encode.statements.push(`$state.step_up();`);
	}

	private build_expansion_encode(field: TSStructExpansion) {
		this.ts_encode.statements.push('// struct expansion not yet implemented');
	}

	private build_decode() {
		this.state.ts_function = this.ts_decode;

		this.ts_decode.params.push(
			[ '$state', '$State' ],
		);
		this.ts_decode.return_type = this.name;
		this.ts_decode.statements.push(`const $inst = { } as ${this.name};`);
		
		if (this.is_root) {
			this.ts_decode.statements.push(`$state.step_down('$', $inst);`);
		}

		for (const field of this.ts_fields) {
			if (field instanceof TSStructField) {
				this.build_field_decode(field);
			}

			else {
				this.build_expansion_decode(field);
			}
		}
		
		if (this.is_root) {
			this.ts_decode.statements.push(`$state.step_up();`);
		}
		
		this.ts_decode.statements.push(`return $inst;`);

		this.state.ts_function = null;
	}

	private build_field_decode(field: TSStructField) {
		if (field.bfec_field.has_field_value) {
			// 
		}

		if (field.bfec_field.condition) {
			// 
		}

		// TODO: unaligned?
		const decode_expr = field.field_type.decode_aligned((value_expr: string) => `$inst.${field.name} = ${value_expr}`);
		this.ts_decode.statements.push(`$state.step_down('${field.name}');`);
		this.ts_decode.statements.push(decode_expr);
		this.ts_decode.statements.push(`$state.step_up();`);
	}

	private build_expansion_decode(field: TSStructExpansion) {
		this.ts_encode.statements.push('// struct expansion not yet implemented');
	}
}

export class TSStructField {
	constructor(
		public state: CompilerState,
		public bfec_field: lnk.StructField,
		public field_type: TSFieldType
	) { }

	public get name() {
		return this.bfec_field.name;
	}

	public static from_schema(state: CompilerState, bfec_field: lnk.StructField) {
		if (bfec_field.condition) {
			// 
		}

		if (bfec_field.has_field_value) {
			// 
		}

		return new TSStructField(state, bfec_field, create_ts_field_type(state, bfec_field.field_type));
	}
}

export class TSStructExpansion {
	constructor(
		public state: CompilerState,
		public bfec_expansion: lnk.StructExpansion,
		public field_type: TSFieldType
	) { }

	public get extend() {
		return typeof this.field_type === 'string' ? this.field_type : this.field_type.field_type();
	}

	public static from_schema(state: CompilerState, bfec_expansion: lnk.StructExpansion) {
		return new TSStructExpansion(state, bfec_expansion, create_ts_field_type(state, bfec_expansion.expanded_type));
	}
}

export class TSStructRef {
	constructor(
		public ts_struct: TSStructModule,
		public params: string[]
	) { }

	public static from_ref(state: CompilerState, ref: lnk.StructRef) {
		const struct_module = state.ts_structs.get(ref.points_to);

		if (! struct_module) {
			state.error(ref, 'Encountered reference to uncollected type');
			return new TSNever();
		}

		// TODO: Params
		const params = ref.params.map((param) => {
			return `(todo: ref to ${param.name})`;
		});

		return new TSStructRef(struct_module, params);
	}

	public import_into(module: TSModule) {
		module.import(this.ts_struct.ts_iface);
	}

	public field_type() {
		// TODO: params
		return this.ts_struct.name;
	}

	public encode_aligned(value_expr: string) {
		return `${this.ts_struct.name}.$encode($state, ${value_expr})`;
	}

	public encode_unaligned(value_expr: string) {
		if (this.ts_struct.is_byte_aligned) {
			return `$state.fatal('Cannot encode byte aligned struct in non-aligned context');`;
		}

		return `${this.ts_struct.name}.$encode($state, ${value_expr})`;
	}

	public decode_aligned(assign: Assign) {
		return assign(`${this.ts_struct.name}.$decode($state)`);
	}

	public decode_unaligned(assign: Assign) {
		if (this.ts_struct.is_byte_aligned) {
			return `$state.fatal('Cannot decode byte aligned struct in non-aligned context');`;
		}

		return assign(`${this.ts_struct.name}.$decode($state)`);
	}
}
