
import * as lnk from '../../../linker';
import { TSEntity } from './entity';
import { CompilerState } from '../state';
import { TSImport, TSImportedRef, TSImportedUtils } from './import';
import { const_from_const_str, const_from_const_str_as_byte_array, TSConst } from './const';
import { ConstString } from '../../../linker';

export abstract class TSModule {
	public imports = new Map<TSModule, TSImport>();
	public str_consts = new Map<lnk.ConstString, TSConst>();
	public u8_array_consts = new Map<lnk.ConstString, TSConst>();
	public util_imports = new TSImportedUtils(this);

	constructor(
		public dir: string,
		public name: string,
		public state: CompilerState
	) { }

	public abstract emit() : Promise<void>;

	public get file_path() {
		return `${this.dir}/${this.name}`;
	}
	public get consts_str() {
		const lines: string[] = [ ];
		
		for (const [, str] of this.str_consts) {
			lines.push(str.decl_str);
		}
		
		for (const [, u8_array] of this.u8_array_consts) {
			lines.push(u8_array.decl_str);
		}

		return lines.join('\n');
	}

	public import<T extends TSEntity>(ent: T) : TSImportedRef<T> {
		let ts_import: TSImport;

		if (! this.imports.has(ent.module)) {
			ts_import = new TSImport(this, ent.module);
			this.imports.set(ent.module, ts_import);
		}

		else {
			ts_import = this.imports.get(ent.module);
		}

		return ts_import.add(ent);
	}

	public add_const_str(str: ConstString) {
		if (this.str_consts.has(str)) {
			return this.str_consts.get(str);
		}

		const new_const = new TSConst();
		new_const.name = `$const_str$_${this.str_consts.size}`;
		new_const.value = const_from_const_str(str);
		new_const.type = 'string';
		this.str_consts.set(str, new_const);
		return new_const;
	}

	public add_const_str_as_byte_array(str: ConstString) {
		if (this.u8_array_consts.has(str)) {
			return this.u8_array_consts.get(str);
		}

		const new_const = new TSConst();
		new_const.name = `$const_u8_array$_${this.u8_array_consts.size}`;
		new_const.value = const_from_const_str_as_byte_array(str);
		new_const.type = 'u8_array';
		this.u8_array_consts.set(str, new_const);
		return new_const;
	}

	public import_util(util: string) {
		this.util_imports.imports.add(util);
	}

	public get imports_str() {
		const import_lines: string[] = [ ];

		if (! this.util_imports.is_empty) {
			import_lines.push(this.util_imports.import_str);
		}

		for (const [module, ts_import] of this.imports) {
			import_lines.push(ts_import.import_str);
		}

		return import_lines.join('\n');
	}
}
