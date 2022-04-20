
import { CompilerState } from '../state';
import { TSEntity } from './entity';
import { TSImport, TSImportedRef, TSImportedUtils } from './import';

export abstract class TSModule {
	public imports = new Map<TSModule, TSImport>();
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

	public import(ent: TSEntity) {
		const ref = new TSImportedRef();
		ref.entity = ent;

		let ts_import: TSImport;

		if (! this.imports.has(ent.module)) {
			ts_import = new TSImport(this, ent.module, [ ]);
			this.imports.set(ent.module, ts_import);
		}

		else {
			ts_import = this.imports.get(ent.module);
		}

		ts_import.imports.push(ref);
		ref.ts_import = ts_import;

		return ref;
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
