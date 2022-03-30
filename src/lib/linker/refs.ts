
import { Enum, EnumMember, ImportedSymbol, Ref, Struct, StructField, StructParam, Switch } from '../schema';

export type Refable
	= Struct
	| StructField
	| StructParam
	| Switch
	| Enum
	| EnumMember
	| ImportedSymbol
	;

export enum RefLocality {
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

export class ResolvedRef<T extends Refable> extends Ref {
	constructor(
		name: string,
		public points_to: T,
		public locality: RefLocality
	) {
		super(name);
	}

	/**
	 * "Promote" a `Ref` object to a `ResolvedRef` by providing the resolved `Refable`
	 * 
	 * @param ref The `Ref` to promote
	 * @param points_to The `Refable` the `Ref` should point to
	 */
	public static promote_ref<T extends Refable>(ref: Ref, points_to: T, locality: RefLocality) : ResolvedRef<T> {
		return new ResolvedRef<T>(ref.name, points_to, locality);
	}
}
