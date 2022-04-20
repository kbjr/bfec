
import { TSModule } from './module';
import { TSEntity } from './entity';
import { path_relative_to } from '../templates';

export class TSImport {
	constructor(
		public from: TSModule,
		public source: TSModule,
		public imports: TSImportedRef[]
	) { }

	public get import_str() {
		const imports = this.imports.map((ref) => ref.decl_str);
		return `import { ${imports.join(', ')} } from '${path_relative_to(this.from.file_path, this.source.file_path)}';`
	}
}

export class TSImportedRef<T extends TSEntity = TSEntity> {
	public ts_import: TSImport;
	public entity: T;
	public alias_name?: string;

	public get decl_str() {
		return this.alias_name ? `${this.entity.name} as ${this.alias_name}` : this.entity.name;
	}

	public get ref_str() {
		return this.alias_name || this.entity.name;
	}
}

export class TSImportedUtils {
	public imports = new Set<string>();

	constructor(
		public from: TSModule,
	) { }

	public get is_empty() {
		return this.imports.size === 0;
	}

	public get import_str() {
		return `import { ${[ ...this.imports ].join(', ')} } from '${path_relative_to(this.from.file_path, 'utils')}';`
	}
}
