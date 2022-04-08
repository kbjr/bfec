
import { ArrayType, FixedIntType } from './base-types';
import { SchemaNode } from './node';
import { StructRef, SwitchRef } from './ref';
import { InlineStruct } from './struct';
import { InlineSwitch } from './switch';

export type RefinementBase = FixedIntType | ArrayType<FixedIntType>;

export type RefinementTarget = StructRef | SwitchRef | InlineStruct | InlineSwitch;

// 
// TODO:
// Refactor AST nodes for refinement type expressions to not directly contain
// struct/switch/etc components, but point to an "inline struct", etc object
// 
export class TypeRefinement<
	B extends RefinementBase = RefinementBase,
	T extends RefinementTarget = RefinementTarget
> implements SchemaNode {
	public type = 'type_refinement' as const;
	public base_type: B;
	public refined_type: T;

	public get pos() {
		return null;
	}
}
