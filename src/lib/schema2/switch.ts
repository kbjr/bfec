
import { ast } from '../parser';
import { Comment } from './comment';
import { Enum } from './enum';
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

	public get pos() {
		return null;
	}
}

export class SwitchCase implements SchemaNode {
	public type = 'switch_case' as const;
	public ast_node: ast.SwitchCase;
	public comments: Comment[];
	public case_value: EnumMemberRef;
	// type expr

	public get case_name() {
		return this.case_name_token.text;
	}

	public get case_name_token() {
		return this.ast_node.condition_name;
	}

	public get pos() {
		return null;
	}
}

export class SwitchDefault implements SchemaNode {
	public type = 'switch_default' as const;
	public ast_node: ast.SwitchDefault;
	public comments: Comment[];
	// type expr

	public get pos() {
		return null;
	}
}
