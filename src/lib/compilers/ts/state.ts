
import * as lnk from '../../linker';
import { c_ts as log } from '../../log';
import { BuildError, build_error_factory } from '../../error';
import type { TypescriptCompilerOptions } from './index';
import { TSEnumModule, TSFunction, TSModule, TSStructModule, TSSwitchModule } from './ts-entities';

export class CompilerState {
	constructor(
		public readonly schema: lnk.Schema,
		public readonly opts: TypescriptCompilerOptions
	) { }

	public root_struct: lnk.NamedStruct;
	public root_class_name: string;
	public root_class_dir: string;

	public get root_class_file() {
		return `${this.root_class_dir}/${this.root_class_name}`;
	}

	public readonly checksum_funcs = new Map<string, Set<lnk.ChecksumType>>();

	public ts_module: TSModule;
	public ts_function: TSFunction;

	public readonly errors: BuildError[] = [ ];
	public readonly error = build_error_factory(this.errors, this.schema);

	public readonly ts_structs  = new Map<lnk.Struct, TSStructModule>();
	public readonly ts_switches = new Map<lnk.Switch, TSSwitchModule>();
	public readonly ts_enums    = new Map<lnk.Enum, TSEnumModule>();

	public on_checksum_ref(ref: lnk.ChecksumType) {
		const func = ref.checksum_func.value;

		if (this.checksum_funcs.has(func)) {
			this.checksum_funcs.get(func).add(ref);
		}
		
		else {
			this.checksum_funcs.set(func, new Set([ ref ]))
		}
	}

	private build_all() {
		for (const [node, type] of this.ts_structs) {
			type.build();
		}

		for (const [node, type] of this.ts_switches) {
			type.build();
		}

		for (const [node, type] of this.ts_enums) {
			type.build();
		}
	}

	private link_all() {
		for (const [node, type] of this.ts_structs) {
			type.link();
		}

		for (const [node, type] of this.ts_switches) {
			type.link();
		}

		for (const [node, type] of this.ts_enums) {
			type.link();
		}
	}

	public emit_all() {
		const promises: Promise<void>[] = [ ];

		this.build_all();
		this.link_all();

		for (const [node, type] of this.ts_structs) {
			promises.push(type.emit());
		}

		for (const [node, type] of this.ts_switches) {
			promises.push(type.emit());
		}

		for (const [node, type] of this.ts_enums) {
			promises.push(type.emit());
		}

		return Promise.all(promises);
	}
}
