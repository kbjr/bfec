
import { ast } from '../parser';
import { Comment } from './comment';
import { Enum } from './enum';
import { FieldType } from './field-type';
import { SchemaNode } from './node';
import { PositionRange } from './pos';
import { EnumMemberRef, EnumRef, ImportedRef } from './ref';

export type Switch = NamedSwitch | InlineSwitch;

export abstract class AbstractSwitch implements SchemaNode {
	public type = 'switch' as const;
	public comments: Comment[];
	public arg_type: EnumRef | ImportedRef<Enum>;
	public case_map = new Map<string, SwitchCase>();
	public cases: SwitchCase[];
	public default: SwitchDefault;
	
	public abstract readonly switch_type: string;
	public abstract get name() : string;
	public abstract get pos() : PositionRange;

	public toJSON() {
		return {
			type: this.type,
			switch_type: this.switch_type,
			name: this.name,
			comments: this.comments,
			arg_type: this.arg_type,
			cases: this.cases,
			default: this.default,
		};
	}
}

export class NamedSwitch extends AbstractSwitch {
	public switch_type = 'named';
	public ast_node: ast.DeclareSwitchNode;

	public get name() {
		return this.name_token.text;
	}

	public get name_token() {
		return this.ast_node.name;
	}

	public get arg_type_node() {
		return this.ast_node.param.param_type;
	}

	public get pos() {
		return null;
	}
}

export class InlineSwitch extends AbstractSwitch {
	public switch_type = 'named';
	public ast_node: ast.DeclareSwitchNode;

	public get name() {
		return '<inline_switch>';
	}

	public get arg_type_node() {
		return this.ast_node.param.param_type;
	}

	public get pos() {
		return null;
	}
}

export class SwitchCase<T extends FieldType = FieldType> implements SchemaNode {
	public type = 'switch_case' as const;
	public ast_node: ast.SwitchCase;
	public comments: Comment[];
	public case_value: EnumMemberRef;
	public case_type?: T;

	public get case_name() {
		return this.case_name_token.text;
	}

	public get case_name_token() {
		return this.ast_node.condition_name;
	}

	public get is_void() {
		return this.ast_node.selection.type === ast.node_type.kw_void;
	}

	public get is_invalid() {
		return this.ast_node.selection.type === ast.node_type.kw_invalid;
	}

	public get is_type() {
		return ! this.is_void && ! this.is_invalid;
	}

	public get pos() {
		return null;
	}

	public toJSON() {
		const type
			= this.is_type ? this.case_type
			: this.is_void ? '[void]'
			: this.is_invalid ? '[invalid]'
			: '[unknown]'
			;

		return {
			type: this.type,
			comments: this.comments,
			case_name: this.case_name,
			case_value: this.case_value,
			case_type: type,
		};
	}
}

export class SwitchDefault<T extends FieldType = FieldType> implements SchemaNode {
	public type = 'switch_default' as const;
	public ast_node: ast.SwitchDefault;
	public comments: Comment[];
	public default_type: T;

	public get is_void() {
		return this.ast_node.selection.type === ast.node_type.kw_void;
	}

	public get is_invalid() {
		return this.ast_node.selection.type === ast.node_type.kw_invalid;
	}

	public get is_type() {
		return ! this.is_void && ! this.is_invalid;
	}

	public get pos() {
		return null;
	}

	public toJSON() {
		const type
			= this.is_type ? this.default_type
			: this.is_void ? '[void]'
			: this.is_invalid ? '[invalid]'
			: '[unknown]'
			;

		return {
			type: this.type,
			comments: this.comments,
			default_type: type,
		};
	}
}
