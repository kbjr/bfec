
import { ast } from '../parser';
import { ArrayType, FixedIntType } from './base-types';
import { SchemaNode } from './node';
import { pos_for_type_expr } from './pos';
import { StructRef, SwitchRef } from './ref';
import { InlineStruct } from './struct';
import { InlineSwitch } from './switch';

export type RefinementBase = FixedIntType | ArrayType<FixedIntType>;

export type RefinementTarget = StructRef | SwitchRef | InlineStruct | InlineSwitch;

export type ASTRefinement = ast.TypeExpr_named_refinement | ast.TypeExpr_struct_refinement | ast.TypeExpr_switch_refinement;

export class TypeRefinement<
	B extends RefinementBase = RefinementBase,
	T extends RefinementTarget = RefinementTarget
> implements SchemaNode {
	public type = 'type_refinement' as const;
	public ast_node: ASTRefinement;
	public base_type: B;
	public refined_type: T;

	public get pos() {
		return pos_for_type_expr(this.ast_node);
	}

	public toJSON() {
		return {
			type: this.type,
			base_type: this.base_type,
			refined_type: this.refined_type,
		};
	}
}
