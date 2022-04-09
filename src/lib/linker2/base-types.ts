
import { ast } from '../parser';
import { ConstInt, ConstString } from './const';
import { SchemaNode } from './node';
import { pos, PositionRange, pos_for_type_expr, pos_for_value_expr } from './pos';
import { EnumRef, ImportedRef, StructFieldRef, StructRef, SwitchRef } from './ref';

export type BuiltinType
	= BaseType
	| LengthType
	| ChecksumType
	;

export type BaseType
	= FixedIntType
	| VarIntType
	| FloatType
	| TextType
	| ArrayType
	;

export class FixedIntType implements SchemaNode {
	public type = 'type_fixed_int' as const;
	public ast_node: ast.TypeExpr_builtin_fixed_int;
	public size_bits: number;
	public is_signed: boolean;
	public is_big_endian: boolean;

	public get pos() {
		return pos(this.ast_node);
	}

	public get name() {
		return this.ast_node.text;
	}

	public get min() {
		return int_min(this.size_bits, this.is_signed);
	}

	public get max() {
		return int_max(this.size_bits, this.is_signed);
	}

	public toJSON() {
		return {
			type: this.type,
			name: this.name,
			size_bits: this.size_bits,
			is_signed: this.is_signed,
			is_big_endian: this.is_big_endian,
		};
	}
}

export class VarIntType implements SchemaNode {
	public type = 'type_var_int' as const;
	public ast_node: ast.TypeExpr_builtin_vint;
	public real_type: FixedIntType;

	public get name() {
		return `varint<${this.real_type.name}>`;
	}

	public get pos() {
		return pos_for_type_expr(this.ast_node);
	}

	public get min() {
		return this.real_type.min;
	}

	public get max() {
		return this.real_type.max;
	}

	public toJSON() {
		return {
			type: this.type,
			name: this.name,
			real_type: this.real_type,
		};
	}
}

export class FloatType implements SchemaNode {
	public type = 'type_float' as const;
	public ast_node: ast.Type_expr_builtin_float;
	public is_decimal: boolean;
	public size_bits: number;

	public get name() {
		return this.ast_node.text;
	}

	public get pos() {
		return pos(this.ast_node);
	}

	public toJSON() {
		return {
			type: this.type,
			name: this.name,
			size_bits: this.size_bits,
			is_decimal: this.is_decimal,
		};
	}
}

export class TextType implements SchemaNode {
	public type = 'type_text' as const;
	public ast_node: ast.TypeExpr_builtin_text;
	public length: Length;

	public get name() {
		return this.ast_node.text_keyword.text;
	}

	public get pos() {
		return pos_for_type_expr(this.ast_node);
	}

	public toJSON() {
		return {
			type: this.type,
			name: this.name,
			length: this.length,
		};
	}
}

export class LengthType implements SchemaNode {
	public type = 'type_len' as const;
	public ast_node: ast.TypeExpr_builtin_len;
	public real_type: FixedIntType | VarIntType;

	public get name() {
		return `len<${this.real_type.name}>`;
	}

	public get pos() {
		return pos_for_type_expr(this.ast_node);
	}

	public toJSON() {
		return {
			type: this.type,
			name: this.name,
			real_type: this.real_type,
		};
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

	public toJSON() {
		return {
			type: this.type,
			real_type: this.real_type,
			data_field: this.data_field,
			checksum_func: this.checksum_func,
		};
	}
}

export type ArrayElemType = BaseType | StructRef | SwitchRef | EnumRef | ImportedRef;

export class ArrayType<T extends ArrayElemType = ArrayElemType> implements SchemaNode {
	public type = 'type_array' as const;
	public ast_node: ast.TypeExpr_array;
	public elem_type: T;
	public length: Length;

	public get pos() {
		return pos_for_type_expr(this.ast_node);
	}

	public toJSON() {
		return {
			type: this.type,
			elem_type: this.elem_type,
			length: this.length,
		};
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

// TODO: toJSON() methods

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

	public toJSON() {
		return {
			type: this.type,
			length_type: this.length_type,
		};
	}
}

export class TakeRemainingLength extends AbstractLength {
	public length_type = 'take_remaining';
	public ast_node: ast.OpToken_expansion;

	public get pos() {
		return pos(this.ast_node);
	}

	public toJSON() {
		return {
			type: this.type,
			length_type: this.length_type,
		};
	}
}

export class StaticLength extends AbstractLength {
	public length_type = 'static_length';
	public ast_node: ast.ConstToken_int | ast.ConstToken_hex_int;
	public value: ConstInt;

	public get pos() {
		return pos(this.ast_node);
	}

	public toJSON() {
		return {
			type: this.type,
			length_type: this.length_type,
			value: this.value,
		};
	}
}

export class LengthPrefix extends AbstractLength {
	public length_type = 'length_prefix';
	public ast_node: ast.TypeExpr_builtin_fixed_int | ast.TypeExpr_builtin_vint;
	public prefix_type: FixedIntType | VarIntType;

	public get pos() {
		if (this.ast_node.type == ast.node_type.type_expr_vint) {
			return pos(this.ast_node.varint_keyword, this.ast_node.close_bracket);
		}

		return pos(this.ast_node);
	}

	public toJSON() {
		return {
			type: this.type,
			length_type: this.length_type,
			prefix_type: this.prefix_type,
		};
	}
}

export class LengthField extends AbstractLength {
	public length_type = 'length_field';
	public ast_node: ast.ValueExpr_path;
	public field: StructFieldRef<LengthType>;

	public get pos() {
		return pos_for_value_expr(this.ast_node);
	}

	public toJSON() {
		return {
			type: this.type,
			length_type: this.length_type,
			field: this.field,
		};
	}
}



// ===== Type Checks =====

export interface TypeCheck<T> {
	(value: any) : value is T;
}

export function is_fixed_int(value: any) : value is FixedIntType {
	return value instanceof FixedIntType;
}

export function is_array_of<T extends ArrayElemType>(value: any, type_check: TypeCheck<T>) : value is ArrayType<T> {
	return value instanceof ArrayType && type_check(value.elem_type);
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

