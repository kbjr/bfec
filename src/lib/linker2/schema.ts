
import { Enum } from './enum';
import { Import } from './import';
import { ImportedRef } from './ref';
import { NamedStruct, Struct } from './struct';
import { NamedSwitch, Switch } from './switch';
import { schema_json_schema } from '../constants';
import { ast } from '../parser';

export class Schema {
	public imports: Import[] = [ ];
	public imported_refs: ImportedRef[] = [ ];
	public structs: Struct[] = [ ];
	public switches: Switch[] = [ ];
	public enums: Enum[] = [ ];
	public symbols = new Map<string, ImportedRef | NamedStruct | NamedSwitch | Enum>();
	public source: ast.FileNode;

	public root_schema?: Schema;
	public is_external: boolean = false;
	public is_remote: boolean = false;

	public toJSON() {
		return {
			$schema: this.root_schema ? void 0 : schema_json_schema,
			source: this.source.source,
			is_external: this.is_external,
			is_remote: this.is_remote,
			imports: this.root_schema ? void 0 : this.get_all_imports(),
			imported_refs: this.imported_refs,
			structs: this.structs,
			switches: this.switches,
			enums: this.enums,
		};
	}

	private get_all_imports() {
		const seen = new Set<Schema>();
		const imports: Import[] = this.imports.slice();

		top_loop:
		for (let i = 0; i < imports.length; i++) {
			const imported = imports[i];

			if (! imported.schema) {
				continue top_loop;
			}

			seen.add(imported.schema);

			sub_loop:
			for (const child of imported.schema.imports) {
				if (! child.schema) {
					continue sub_loop;
				}

				if (seen.has(child.schema)) {
					continue sub_loop;
				}

				imports.push(child);
				seen.add(child.schema);
			}
		}

		return imports;
	}
}
