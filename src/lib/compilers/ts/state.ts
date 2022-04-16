
import * as lnk from '../../linker';
import * as ts from './ts-entities';
import { c_ts as log } from '../../log';
import { BuildError } from '../../error';
import type { TypescriptCompilerOptions } from './index';

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

	public readonly ts_structs  = new Map<lnk.Struct, ts.Struct>();
	public readonly ts_switches = new Map<lnk.Switch, ts.Switch>();
	public readonly ts_enums    = new Map<lnk.Enum, ts.Enum>();
}
