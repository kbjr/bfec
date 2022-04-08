
import { ast } from '../parser';
import { ConstInt, ConstString } from './const';
import { SchemaNode } from './node';
import { pos, PositionRange, pos_for_type_expr, pos_for_value_expr } from './pos';
import { StructFieldRef, StructRef, SwitchRef } from './ref';

export type BaseType
	= FixedIntType
	| VarIntType
	| FloatType
	| TextType
	| LengthType
	| ChecksumType
	| ArrayType
	;

export class FixedIntType implements SchemaNode {
	public type = 'type_fixed_int' as const;
	public ast_node: ast.TypeExpr_builtin_fixed_int;
	public size_bits: number;
	public is_signed: boolean;
	public is_big_endian: number;

	public get pos() {
		return pos(this.ast_node);
	}

	public get min() {
		return int_min(this.size_bits, this.is_signed);
	}

	public get max() {
		return int_max(this.size_bits, this.is_signed);
	}
}

export class VarIntType implements SchemaNode {
	public type = 'type_var_int' as const;
	public ast_node: ast.TypeExpr_builtin_vint;
	public real_type: FixedIntType;

	public get pos() {
		return pos_for_type_expr(this.ast_node);
	}

	public get min() {
		return this.real_type.min;
	}

	public get max() {
		return this.real_type.max;
	}
}

export class FloatType implements SchemaNode {
	public type = 'type_float' as const;
	public ast_node: ast.Type_expr_builtin_float;
	public decimal: boolean;
	public size_bits: number;

	public get pos() {
		return pos(this.ast_node);
	}
}

export class TextType implements SchemaNode {
	public type = 'type_text' as const;
	public ast_node: ast.TypeExpr_builtin_text;
	public length: Length;

	public get pos() {
		return pos_for_type_expr(this.ast_node);
	}
}

export class LengthType implements SchemaNode {
	public type = 'type_len' as const;
	public ast_node: ast.TypeExpr_builtin_len;
	public real_type: FixedIntType | VarIntType;

	public get pos() {
		return pos_for_type_expr(this.ast_node);
	}
}

export class ChecksumType implements SchemaNode {
	public type = 'type_checksum' as const;
	public ast_node: ast.TypeExpr_builtin_checksum;
	public real_type: FixedIntType | TextType | ArrayType<FixedIntType>;
	public data_field: StructFieldRef;
	public checksum_func: ConstString;

	public get pos() {
		return pos(this.ast_node.checksum_keyword, this.ast_node.close_paren);
	}
}

export type ArrayElemType = BaseType | StructRef | SwitchRef;

export class ArrayType<T extends ArrayElemType = ArrayElemType> implements SchemaNode {
	public type = 'type_array' as const;
	public ast_node: ast.TypeExpr_array;
	public elem_type: T;
	public length: Length;

	public get pos() {
		return pos_for_type_expr(this.ast_node);
	}
}



// ===== Length Definitions =====

export type Length
	= NullTerminatedLength
	| TakeRemainingLength
	| StaticLength
	| LengthPrefix
	| LengthField
	;

export abstract class AbstractLength implements SchemaNode {
	public type = 'length';
	
	public abstract readonly length_type: string;
	public abstract ast_node: ast.ASTNode;
	public abstract get pos() : PositionRange;
}

export class NullTerminatedLength extends AbstractLength {
	public length_type = 'null_terminated';
	public ast_node: ast.KeywordToken_null;

	public get pos() {
		return pos(this.ast_node);
	}
}

export class TakeRemainingLength extends AbstractLength {
	public length_type = 'take_remaining';
	public ast_node: ast.OpToken_expansion;

	public get pos() {
		return pos(this.ast_node);
	}
}

export class StaticLength extends AbstractLength {
	public length_type = 'static_length';
	public ast_node: ast.ConstToken_int | ast.ConstToken_hex_int;
	public value: ConstInt;

	public get pos() {
		return pos(this.ast_node);
	}
}

export class LengthPrefix extends AbstractLength {
	public length_type = 'length_prefix';
	public ast_node: ast.TypeExpr_int;

	public get pos() {
		if (this.ast_node.type == ast.node_type.type_expr_vint) {
			return pos(this.ast_node.varint_keyword, this.ast_node.close_bracket);
		}

		return pos(this.ast_node);
	}
}

export class LengthField extends AbstractLength {
	public length_type = 'length_field';
	public ast_node: ast.ValueExpr_path;

	public get pos() {
		return pos_for_value_expr(this.ast_node);
	}
}



// ===== Utility Helpers =====

function int_min(size_bits: number, signed: boolean) : bigint {
	if (! signed) {
		return 0n;
	}

	const base = 2n ** BigInt(size_bits);
	return -(base / 2n);
}

function int_max(size_bits: number, signed: boolean) : bigint {
	const base = 2n ** BigInt(size_bits);
	return (signed ? (base / 2n) : base) - 1n;
}

