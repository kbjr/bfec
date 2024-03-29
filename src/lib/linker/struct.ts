
import { ast } from '../parser';
import { Schema } from './schema';
import { Comment } from './comment';
import { BaseType } from './base-types';
import { BoolExpr } from './bool-expr';
import { FieldType } from './field-type';
import { SchemaNode } from './node';
import { pos, PositionRange } from './pos';
import { ConstInt, ConstString } from './const';
import { EnumMemberRef, EnumRef, ParamRef, StructRef, SwitchRef } from './ref';

export type ExpandedStruct = Struct<StructField>;

export type Struct<F extends StructMember = StructMember> = NamedStruct<F> | InlineStruct<F>;

export type StructMember = StructField | StructExpansion;

export type StructExpandableType = StructRef | SwitchRef;

export abstract class AbstractStruct<F extends StructMember = StructMember> implements SchemaNode {
	public type = 'struct' as const;
	public comments: Comment[];
	public fields: F[];
	public symbols = new Map<string, StructField>();
	public params: StructParam[];
	public param_map = new Map<string, StructParam>();
	
	public abstract readonly struct_type: string;
	public abstract get name() : string;
	public abstract get is_byte_aligned() : boolean;
	public abstract get pos() : PositionRange;

	public toJSON() {
		return {
			type: this.type,
			struct_type: this.struct_type,
			is_byte_aligned: this.is_byte_aligned,
			name: this.name,
			comments: this.comments,
			fields: this.fields,
		};
	}
}

export class NamedStruct<F extends StructMember = StructMember> extends AbstractStruct<F> {
	public struct_type = 'named' as const;
	public ast_node: ast.DeclareStructNode;
	public parent: Schema;

	public get name() {
		return this.ast_node.name.text;
	}

	public get name_token() {
		return this.ast_node.name;
	}

	public get is_byte_aligned() {
		return this.ast_node.struct_keyword.text === 'struct';
	}

	public get pos() {
		return pos(this.ast_node.struct_keyword, this.ast_node.body.close_brace);
	}
}

export class InlineStruct<F extends StructMember = StructMember> extends AbstractStruct<F> {
	public struct_type = 'inline' as const;
	public ast_node: ast.TypeExpr_struct_refinement;
	public parent: Struct;

	public get name() {
		return '<inline_struct>';
	}

	public get is_byte_aligned() {
		return this.ast_node.struct_keyword.text === 'struct';
	}

	public get pos() {
		return pos(this.ast_node.struct_keyword, this.ast_node.body.close_brace);
	}
}

export class StructField<T extends FieldType = FieldType> implements SchemaNode {
	public type = 'struct_field' as const;
	public ast_node: ast.StructField;
	public comments: Comment[];
	public condition?: BoolExpr;
	public field_type: T;
	public field_value?: ParamRef | EnumMemberRef | ConstInt | ConstString;
	public parent: Struct;

	public get name() {
		return this.ast_node.field_name.text;
	}

	public get name_token() {
		return this.ast_node.field_name;
	}

	public get has_condition() {
		return this.ast_node.optional_condition != null;
	}

	public get has_field_value() {
		return this.ast_node.optional_value != null;
	}

	public get pos() {
		return pos(this.name_token, this.ast_node.terminator);
	}

	public toJSON() {
		return {
			type: this.type,
			name: this.name,
			comments: this.comments,
			field_type: this.field_type,
			condition: this.condition,
			field_value: this.field_value,
		};
	}
}

export class StructExpansion<T extends StructExpandableType = StructExpandableType> implements SchemaNode {
	public type = 'struct_expansion' as const;
	public ast_node: ast.StructExpansion;
	public comments: Comment[];
	public expanded_type: T;
	public parent: Struct;

	public get pos() {
		return pos(this.ast_node.expansion_op, this.ast_node.terminator);
	}

	public toJSON() {
		return {
			type: this.type,
			comments: this.comments,
			expanded_type: this.expanded_type,
		};
	}
}

export class StructParam implements SchemaNode {
	public type = 'struct_param' as const;
	public ast_node: ast.StructParamNode;
	public param_type: BaseType | EnumRef;
	public parent: NamedStruct;

	public get name() {
		return this.name_token.text;
	}

	public get name_token() {
		return this.ast_node.name;
	}

	public get pos() {
		return pos(this.name_token);
	}

	public toJSON() {
		return {
			type: this.type,
			name: this.name,
			param_type: this.param_type,
		};
	}
}

export function is_struct_fully_expanded(struct: Struct) : struct is Struct<StructField> {
	for (const field of struct.fields) {
		if (field instanceof StructField) {
			continue;
		}

		return false;
	}

	return true;
}
