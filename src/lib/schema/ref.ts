
import assert = require('assert');
import { ast } from '../parser';
import { Enum, EnumMember } from './enum';
import { Switch } from './switch';
import { SchemaNode } from './node';
import { Struct, StructField } from './struct';
import { Import } from './import';
import { SchemaElem } from './schema';

export enum ref_locality {
	/** This ref is in the same declaration (e.g. struct) as the node referencing it */
	declaration = 'declarataion',
	/** This ref is in the same schema (i.e. file) as the node referencing it */
	schema      = 'schema',
	/** This ref is in the same project (e.g. not a remote library) as the node referencing it */
	project     = 'project',
	/** This ref shares no locality with the node referencing it (i.e. comes from a different project) */
	external    = 'external',
	/** Additional level on top of `external` to indicate a file from a remote (network) location */
	remote      = 'remote',
}

export class Ref<T extends SchemaNode> extends SchemaNode {
	public type = 'ref';
	public points_to?: T;
	public locality: ref_locality;

	public get name() {
		return '<unnamed_ref>';
	}
}

export class RootRef extends Ref<Struct> {
	public ref_type = 'root';
	public name_token: ast.NameToken_root_schema;
	
	public get name() { return '$'; }

	public static from_name(name: ast.NameToken_root_schema) {
		const ref = new RootRef();
		ref.name_token = name;
		return ref;
	}
}

export class SelfRef extends Ref<Struct> {
	public ref_type = 'this';
	public name_token: ast.NameToken_this_schema;
	
	public get name() { return '@'; }

	public static from_name(name: ast.NameToken_this_schema) {
		const ref = new SelfRef();
		ref.name_token = name;
		return ref;
	}
}

export type NamedParentRefable = Struct | StructField | Enum;

export type NamedRefable
	= Enum
	| Struct
	| Switch
	| ImportedRef
	| EnumMember
	| StructField
	;

export class NamedRef<T extends NamedRefable = NamedRefable, P extends NamedParentRefable = NamedParentRefable> extends Ref<T> {
	public ref_type = 'named';
	public name_token: ast.NameToken_normal;
	public parent_ref?: Ref<P>;

	public get name() {
		return this.name_token.text;
	}

	public resolve_in(map: Map<string, T>, locality: ref_locality) : boolean {
		const name = this.name_token.text;
		const found = map.get(name);
			
		if (found) {
			this.points_to = found;
			this.locality = locality;
			return true;
		}

		return false;
	}

	public static from_name<T extends NamedRefable, P extends NamedParentRefable>(name: ast.NameToken_normal, parent_ref?: Ref<P>) {
		const ref = new NamedRef<T, P>();
		ref.name_token = name;
		ref.parent_ref = parent_ref;
		return ref;
	}
}

export class ImportedRef<T extends SchemaElem = SchemaElem> extends Ref<T> {
	public ref_type = 'imported';
	public from: Import;
	public local_token: ast.NameToken_normal;
	public source_token?: ast.NameToken_normal | ast.NameToken_root_schema;
	public import_root?: true;
	
	public get name() {
		return this.local_token.text;
	}

	public static from_root_import(from: Import, node: ast.DeclareFromNode) {
		assert(node.root_import, 'expected ImportedRef.from_root_import to be called with a `from` node that actually declares a root import');

		const ref = new ImportedRef();
		ref.from = from;
		ref.local_token = node.root_import;
		ref.import_root = true;
		return ref;
	}

	public static from_imported(from: Import, imported: ast.FromImportNode) {
		const ref = new ImportedRef();
		ref.from = from;
		ref.local_token = imported.alias_name || imported.source_name;
		ref.source_token = imported.source_name;
		return ref;
	}
}

export function fully_resolve<T extends SchemaNode>(ref: Ref<T>) : T {
	let points_to = ref.points_to;

	while (points_to instanceof Ref) {
		points_to = points_to.points_to;
	}

	return points_to;
}

export function is_named_ref<T extends NamedRefable>(ref: Ref<T>) : ref is NamedRef<T> {
	return ref instanceof NamedRef;
}
