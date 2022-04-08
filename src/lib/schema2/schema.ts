
import { Enum } from './enum';
import { Import } from './import';
import { NamedStruct, Struct } from './struct';
import { NamedSwitch, Switch } from './switch';
import { ImportedRef } from './ref';
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
			$schema: schema_json_schema,
			source: this.source.source,
			imports: this.imports,
			imported_refs: this.imported_refs,
			structs: this.structs,
			switches: this.switches,
			enums: this.enums,
		};
	}
}
