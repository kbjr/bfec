
import { ASTNode, node_type } from './node';
import {
	Ignored,
	ConstToken_ascii, ConstToken_hex_int, ConstToken_int, ConstToken_unicode,
	NameToken_normal, NameToken_root_schema, NameToken_this_schema,
	PuncToken_property_access
} from './tokens';

export type ValueExpr = ValueExpr_path ;

export type ConstExpr = ConstToken_int | ConstToken_hex_int | ConstToken_ascii | ConstToken_unicode ;

export type LeftHandName = NameToken_normal | NameToken_root_schema | NameToken_this_schema;

export class ValueExpr_path extends ASTNode {
	public type: node_type.value_expr_path = node_type.value_expr_path;
	public lh_name: LeftHandName;
	public rh_names: ValueExpr_path_access[] = [ ];
	public children: Ignored[] = [ ];

	public toJSON(): object {
		return {
			type: node_type[this.type],
			lh_name: this.lh_name,
			rh_names: this.rh_names,
			children: this.children,
		};
	}
}

// TODO: Support for new `[@]` token for accessing current branch, i.e.
//       $.foo.bar.[@].baz
export class ValueExpr_path_access extends ASTNode {
	public type: node_type.value_expr_path = node_type.value_expr_path;
	public access_punc: PuncToken_property_access;
	public field_name: NameToken_normal;

	public toJSON(): object {
		return {
			type: node_type[this.type],
			access_punc: this.access_punc,
			field_name: this.field_name,
		};
	}
}
