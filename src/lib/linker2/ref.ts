
import { ast } from '../parser';
import { SchemaNode } from './node';
import { NamedStruct, Struct, StructField, StructMember, StructParam } from './struct';
import { pos, pos_for_type_expr, pos_for_value_expr } from './pos';
import { Import } from './import';
import { Enum, EnumMember } from './enum';
import { NamedSwitch, Switch } from './switch';
import { FieldType } from './field-type';

export type ParamType = StructFieldRef | EnumMemberRef;

export type ImportedRefable = NamedStruct | NamedSwitch | Enum | ImportedRef;

export class ImportedRef<T extends ImportedRefable = ImportedRefable> implements SchemaNode {
	public type = 'imported_ref' as const;
	public ast_node: ast.FromImportNode;
	public points_to: T;
	public from: Import;

	public get name() {
		return this.name_token.text;
	}

	public get source_name() {
		return this.ast_node.source_name.text;
	}

	public get name_token() {
		return this.ast_node.alias_name || this.ast_node.source_name;
	}

	public get pos() {
		return pos(this.ast_node.source_name, this.ast_node.alias_name || this.ast_node.source_name);
	}

	public toJSON() {
		const alias = this.ast_node.alias_name ? ` as ${this.ast_node.alias_name}` : '';

		let points_to: ImportedRefable = this.points_to;

		while (points_to && points_to.type === 'imported_ref') {
			points_to = points_to.points_to;
		}

		if (points_to) {
			const type = points_to.type.slice(-4);
			return `@[imported ${type} ${this.ast_node.source_name.text}${alias} from ${this.from.source.value}]`;
		}

		return `@[imported unresolved ${this.ast_node.source_name.text}${alias} from ${this.from.source.value}]`;
	}
}

export class StructRef<F extends StructMember = StructMember> implements SchemaNode {
	public type = 'struct_ref' as const;
	public ast_node: ast.TypeExpr_named;
	public imported?: ImportedRef;
	public points_to: Struct<F>;
	public params: ParamType[];

	public get name() {
		return this.ast_node.name.text;
	}

	public get pos() {
		return pos_for_type_expr(this.ast_node);
	}

	public toJSON() {
		return `@[struct ${this.name}]`;
	}
}

export type StructFieldRef<T extends FieldType = FieldType> = LocalFieldRef<T> | GlobalFieldRef<T>;
	
export class SwitchRef implements SchemaNode {
	public type = 'switch_ref' as const;
	public ast_node: ast.TypeExpr_named;
	public imported?: ImportedRef;
	public points_to: Switch;
	public param: ParamType;

	public get name() {
		return this.ast_node.name.text;
	}

	public get pos() {
		return pos_for_type_expr(this.ast_node);
	}

	public toJSON() {
		return `@[switch ${this.name}]`;
	}
}

export class EnumRef implements SchemaNode {
	public type = 'enum_ref' as const;
	public ast_node: ast.TypeExpr_named | ast.NameToken_normal;
	public imported?: ImportedRef;
	public points_to: Enum;

	public get name() {
		return this.name_token.text;
	}

	public get name_token() {
		return this.ast_node.type === ast.node_type.name_normal ? this.ast_node : this.ast_node.name;
	}

	public get pos() {
		return pos(this.name_token);
	}

	public toJSON() {
		return `@[enum ${this.name}]`;
	}
}

export class EnumMemberRef implements SchemaNode {
	public type = 'enum_member_ref' as const;
	public ast_node: ast.ValueExpr_path | ast.NameToken_normal;
	public enum_ref: EnumRef;
	public points_to: EnumMember;

	public get name() {
		return this.ast_node.text;
	}
	
	public get pos() {
		if (this.ast_node.type === ast.node_type.name_normal) {
			return pos(this.ast_node);
		}

		return pos_for_value_expr(this.ast_node);
	}

	public toJSON() {
		return `@[enum_member ${this.name}]`;
	}
}

export class LocalFieldRef<T extends FieldType = FieldType> implements SchemaNode {
	public type = 'local_field_ref' as const;
	public ast_node: ast.ValueExpr_path;
	public points_to: StructField<T>;

	public get name() {
		return this.ast_node.text;
	}
	
	public get pos() {
		return pos_for_value_expr(this.ast_node);
	}

	public toJSON() {
		return `@[local_field ${this.name}]`;
	}
}

export class GlobalFieldRef<T extends FieldType = FieldType> implements SchemaNode {
	public type = 'global_field_ref' as const;
	public ast_node: ast.ValueExpr_path;
	public points_to: StructField<T>;

	public get name() {
		return this.ast_node.text;
	}
	
	public get pos() {
		return pos_for_value_expr(this.ast_node);
	}

	public toJSON() {
		return `@[global_field ${this.name}]`;
	}
}

export class ParamRef implements SchemaNode {
	public type = 'param_ref' as const;
	public ast_node: ast.ValueExpr_path;
	public points_to: StructParam;

	public get name() {
		return this.ast_node.text;
	}
	
	public get pos() {
		return pos_for_value_expr(this.ast_node);
	}

	public toJSON() {
		return `@[struct_param ${this.name}]`;
	}
}
