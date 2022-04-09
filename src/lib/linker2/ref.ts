
import { ast } from '../parser';
import { SchemaNode } from './node';
import { NamedStruct, Struct, StructField, StructMember } from './struct';
import { pos, pos_for_type_expr, pos_for_value_expr } from './pos';
import { Import } from './import';
import { Enum, EnumMember } from './enum';
import { NamedSwitch, Switch } from './switch';
import { FieldType } from './field-type';
import { StructParam } from '../schema';

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
		return `@[imported ${this.ast_node.source_name.text}${alias} from ${this.from.source.value}]`;
	}
}

export class StructRef<F extends StructMember = StructMember> implements SchemaNode {
	public type = 'struct_ref' as const;
	public ast_node: ast.TypeExpr_named;
	public imported?: ImportedRef;
	public points_to: Struct<F>;
	public params: ParamType[];

	public get pos() {
		return pos_for_type_expr(this.ast_node);
	}

	public toJSON() {
		return `@[struct ${this.ast_node.name.text}]`;
	}
}

export type StructFieldRef<T extends FieldType = FieldType> = LocalFieldRef<T> | GlobalFieldRef<T>;
	
export class SwitchRef implements SchemaNode {
	public type = 'switch_ref' as const;
	public ast_node: ast.TypeExpr_named;
	public imported?: ImportedRef;
	public points_to: Switch;
	public param: ParamType;

	public get pos() {
		return pos_for_type_expr(this.ast_node);
	}

	public toJSON() {
		return `@[switch ${this.ast_node.name.text}]`;
	}
}

export class EnumRef implements SchemaNode {
	public type = 'enum_ref' as const;
	public ast_node: ast.TypeExpr_named;
	public imported?: ImportedRef;
	public points_to: Enum;

	public get pos() {
		return pos_for_type_expr(this.ast_node);
	}

	public toJSON() {
		return `@[enum ${this.ast_node.name.text}]`;
	}
}

export class EnumMemberRef implements SchemaNode {
	public type = 'enum_member_ref' as const;
	public ast_node: ast.ValueExpr_path; // | ast.NameToken_normal
	public points_to: EnumMember;
	
	public get pos() {
		return pos_for_value_expr(this.ast_node);
	}

	public toJSON() {
		return `@[enum_member ${this.ast_node.text}]`;
	}
}

export class LocalFieldRef<T extends FieldType = FieldType> implements SchemaNode {
	public type = 'local_field_ref' as const;
	public ast_node: ast.ValueExpr_path;
	public points_to: StructField<T>;
	
	public get pos() {
		return pos_for_value_expr(this.ast_node);
	}

	public toJSON() {
		return `@[local_field ${this.ast_node.text}]`;
	}
}

export class GlobalFieldRef<T extends FieldType = FieldType> implements SchemaNode {
	public type = 'global_field_ref' as const;
	public ast_node: ast.ValueExpr_path;
	public points_to: StructField<T>;
	
	public get pos() {
		return pos_for_value_expr(this.ast_node);
	}

	public toJSON() {
		return `@[global_field ${this.ast_node.text}]`;
	}
}

export class ParamRef implements SchemaNode {
	public type = 'param_ref' as const;
	public ast_node: ast.ValueExpr_path;
	public points_to: StructParam;
	
	public get pos() {
		return pos_for_value_expr(this.ast_node);
	}

	public toJSON() {
		return `@[struct_param ${this.ast_node.text}]`;
	}
}
