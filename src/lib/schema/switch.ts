
import { ast } from '../parser';
import { Comment } from './comment';
import { Enum, EnumMember } from './enum';
import { SchemaNode } from './node';
import { NamedRef } from './ref';
import { TypeExpr } from './type-expr';

export class Switch extends SchemaNode {
	public type = 'switch';
	public comments: Comment[];
	public name: ast.NameToken_normal;
	public arg_type: NamedRef<Enum>;
	public cases: SwitchCase[] = [ ];
	public default?: SwitchCase;
}

export class SwitchCase extends SchemaNode {
	public type = 'switch_case';
	public case_type: switch_case_type;
	public comments: Comment[];
	public case_value?: NamedRef<EnumMember>;
	public case_type_expr?: TypeExpr;
}

export enum switch_case_type {
	type_expr = 'type_expr',
	void      = 'void',
	invalid   = 'invalid',
}
