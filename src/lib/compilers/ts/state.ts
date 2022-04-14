
import * as lnk from '../../linker';
import { ts } from './ts-entities';
import { c_ts as log } from '../../log';
import { BuildError } from '../../error';
import type { TypescriptCompilerOptions } from './index';

export class CompilerState {
	constructor(
		public readonly schema: lnk.Schema,
		public readonly opts: TypescriptCompilerOptions
	) { }

	public readonly errors: BuildError[] = [ ];

	public readonly ts_structs = new Map<lnk.Struct, ts.StructClass>();
	public readonly ts_switches = new Map<lnk.Switch, ts.SwitchFunction>();
	public readonly ts_enums = new Map<lnk.Enum, ts.Enum>();
}
