
import * as lnk from '../../linker';
import { c_ts as log } from '../../log';
import { BuildError, build_error_factory } from '../../error';
import type { TypescriptCompilerOptions } from './index';
import { TSEnumModule, TSStructModule, TSSwitchModule } from './ts-entities';

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

	public readonly errors: BuildError[] = [ ];
	public readonly error = build_error_factory(this.errors, this.schema);

	public readonly ts_structs  = new Map<lnk.Struct, TSStructModule>();
	public readonly ts_switches = new Map<lnk.Switch, TSSwitchModule>();
	public readonly ts_enums    = new Map<lnk.Enum, TSEnumModule>();

	public emit_all() {
		const promises: Promise<void>[] = [ ];

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
