
import { Enum, EnumMember, ImportedSymbol, node_type, Ref, Struct, StructField, StructParam, Switch } from '../schema';

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

export type RefedType<T extends ResolvedRef<Refable>> = T extends ResolvedRef<infer RT> ? RT : never;

export interface RefableConstructor<T extends Refable> {
	new (): T;
}

export class ResolvedRef<T extends Refable> extends Ref {
	constructor(
		name: string,
		public points_to: T,
		public locality: RefLocality
	) {
		super(name);
	}

	public is_type<R extends Refable>(Class: RefableConstructor<R>) : this is ResolvedRef<R> {
		return this.points_to instanceof Class;
	}

	public fully_resolve() : Refable {
		let points_to: Refable = this.points_to;

		while (points_to.type === node_type.imported_symbol) {
			if (points_to.imported instanceof ResolvedRef) {
				points_to = points_to.imported.points_to;
			}

			else {
				return null;
			}
		}

		return points_to;
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

	/**
	 * 
	 * @param ref 
	 */
	public static fully_resolve(ref: Ref) : Refable {
		if (ref instanceof ResolvedRef) {
			return ref.fully_resolve();
		}

		return null;
	}
}
