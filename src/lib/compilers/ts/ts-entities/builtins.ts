
import * as lnk from '../../../linker';
import { CompilerState } from '../state';
import { Assign } from './types';

export namespace builtins {
	export type Builtin = Exclude<lnk.BuiltinType, lnk.ArrayType> | lnk.ConstInt | lnk.ConstString | lnk.ArrayType<lnk.FixedIntType>;

	export type RealType<T extends Builtin> 
		= T extends lnk.VarIntType ? lnk.FixedIntType
		: T extends lnk.LengthType ? lnk.FixedIntType | lnk.VarIntType
		: T extends lnk.ChecksumType ? lnk.FixedIntType | int_array.IntArray
		: T extends int_array.IntArray ? lnk.FixedIntType
		: never;

	export class TSBuiltin<T extends Builtin = Builtin> {
		public real_type?: TSBuiltin<RealType<T>>;
		public length_type?: TSBuiltin<lnk.FixedIntType | lnk.VarIntType | lnk.ConstInt>;

		constructor(
			public state: CompilerState,
			public type: T
		) {
			switch (type.type) {
				case 'type_array':
					this.real_type = new TSBuiltin(state, type.elem_type as RealType<T>);
					// no-break

				case 'type_text': {
					if (type.length.length_type === 'length_prefix') {
						this.length_type = new TSBuiltin(state, type.length.prefix_type);
					}

					else if (type.length.length_type === 'static_length') {
						this.length_type = new TSBuiltin(state, type.length.value);
					}
					break;
				}

				case 'type_checksum':
					this.real_type = new TSBuiltin(state, type.real_type as RealType<T>);
					state.on_checksum_ref(type);
					break;

				case 'type_var_int':
					this.real_type = new TSBuiltin(state, type.real_type as RealType<T>);
					break;

				case 'type_len':
					this.real_type = new TSBuiltin(state, type.real_type as RealType<T>);
					break;
			}
		}

		public field_type() : string {
			switch (this.type.type) {
				case 'const_int': return const_int.field_type(this as TSBuiltin<any>);
				case 'const_string': return const_str.field_type(this as TSBuiltin<any>);
				case 'type_fixed_int': return fixed_int.field_type(this as TSBuiltin<any>);
				case 'type_text': return text.field_type(this as TSBuiltin<any>);
				case 'type_checksum': return checksum.field_type(this as TSBuiltin<any>);
				case 'type_len': return len.field_type(this as TSBuiltin<any>);
				case 'type_float': return float.field_type(this as TSBuiltin<any>);
				case 'type_var_int': return varint.field_type(this as TSBuiltin<any>);
				case 'type_array': return int_array.field_type(this as TSBuiltin<any>);
				default: return 'never';
			}
		}
	
		public encode_aligned(value_expr: string) {
			switch (this.type.type) {
				case 'const_int': return const_int.encode_aligned(this as TSBuiltin<any>, value_expr);
				case 'const_string': return const_str.encode_aligned(this as TSBuiltin<any>, value_expr);
				case 'type_fixed_int': return fixed_int.encode_aligned(this as TSBuiltin<any>, value_expr);
				case 'type_text': return text.encode_aligned(this as TSBuiltin<any>, value_expr);
				case 'type_checksum': return checksum.encode_aligned(this as TSBuiltin<any>, value_expr);
				case 'type_len': return len.encode_aligned(this as TSBuiltin<any>, value_expr);
				case 'type_float': return float.encode_aligned(this as TSBuiltin<any>, value_expr);
				case 'type_var_int': return varint.encode_aligned(this as TSBuiltin<any>, value_expr);
				default: return `$state.fatal('Failed to compile encoder')`;
			}
		}
	
		public encode_unaligned(value_expr: string) {
			switch (this.type.type) {
				case 'const_int': return const_int.encode_unaligned(this as TSBuiltin<any>, value_expr);
				case 'const_string': return const_str.encode_unaligned(this as TSBuiltin<any>, value_expr);
				case 'type_fixed_int': return fixed_int.encode_unaligned(this as TSBuiltin<any>, value_expr);
				case 'type_text': return text.encode_unaligned(this as TSBuiltin<any>, value_expr);
				case 'type_checksum': return checksum.encode_unaligned(this as TSBuiltin<any>, value_expr);
				case 'type_len': return len.encode_unaligned(this as TSBuiltin<any>, value_expr);
				case 'type_float': return float.encode_unaligned(this as TSBuiltin<any>, value_expr);
				case 'type_var_int': return varint.encode_unaligned(this as TSBuiltin<any>, value_expr);
				default: return `$state.fatal('Failed to compile encoder')`;
			}
		}
	
		public decode_aligned(assign: Assign) {
			switch (this.type.type) {
				case 'const_int': return const_int.decode_aligned(this as TSBuiltin<any>, assign);
				case 'const_string': return const_str.decode_aligned(this as TSBuiltin<any>, assign);
				case 'type_fixed_int': return fixed_int.decode_aligned(this as TSBuiltin<any>, assign);
				case 'type_text': return text.decode_aligned(this as TSBuiltin<any>, assign);
				case 'type_checksum': return checksum.decode_aligned(this as TSBuiltin<any>, assign);
				case 'type_len': return len.decode_aligned(this as TSBuiltin<any>, assign);
				case 'type_float': return float.decode_aligned(this as TSBuiltin<any>, assign);
				case 'type_var_int': return varint.decode_aligned(this as TSBuiltin<any>, assign);
				default: return `$state.fatal('Failed to compile decoder')`;
			}
		}
	
		public decode_unaligned(assign: Assign) : string {
			switch (this.type.type) {
				case 'const_int': return const_int.decode_unaligned(this as TSBuiltin<any>, assign);
				case 'const_string': return const_str.decode_unaligned(this as TSBuiltin<any>, assign);
				case 'type_fixed_int': return fixed_int.decode_unaligned(this as TSBuiltin<any>, assign);
				case 'type_text': return text.decode_unaligned(this as TSBuiltin<any>, assign);
				case 'type_checksum': return checksum.decode_unaligned(this as TSBuiltin<any>, assign);
				case 'type_len': return len.decode_unaligned(this as TSBuiltin<any>, assign);
				case 'type_float': return float.decode_unaligned(this as TSBuiltin<any>, assign);
				case 'type_var_int': return varint.decode_unaligned(this as TSBuiltin<any>, assign);
				default: return `$state.fatal('Failed to compile decoder')`;
			}
		}
	}
}

export namespace const_int {
	const u32_max = (2 ** 32) - 1;
	const u32_max_big = BigInt(u32_max);

	export function field_type(type: builtins.TSBuiltin<lnk.ConstInt>) : string {
		const value = type.type.value;
		return `0x${value.toString(16)}${value > u32_max_big ? 'n' : ''}`;
	}

	export function encode_aligned(type: builtins.TSBuiltin<lnk.ConstInt>, value_expr: string) {
		// TODO: 
		return `encode_const_int(${value_expr})`;
	}

	export function encode_unaligned(type: builtins.TSBuiltin<lnk.ConstInt>, value_expr: string) {
		return `$state.fatal('Cannot encode unaligned const_int')`;
	}

	export function decode_aligned(type: builtins.TSBuiltin<lnk.ConstInt>, assign: Assign) {
		return assign(`decode_const_int()`);
	}

	export function decode_unaligned(type: builtins.TSBuiltin<lnk.ConstInt>, assign: Assign) {
		return `$state.fatal('Cannot decode unaligned const_int')`;
	}
}

export namespace const_str {
	export function field_type(type: builtins.TSBuiltin<lnk.ConstString>) : string {
		// TODO: Do something more JS-safe
		return type.type.token.text;
	}

	export function encode_aligned(type: builtins.TSBuiltin<lnk.ConstString>, value_expr: string) {
		const ts_const_str = type.state.ts_module.add_const_str(type.type);
		const ts_const_u8 = type.state.ts_module.add_const_str_as_byte_array(type.type);
		const lines: string[] = [
			`$state.assert_match(${value_expr}, ${ts_const_str.ref_str});`,
			`// TODO: Write bytes in ts_const_u8`
		];
		return lines.join('\n\t\t');
	}

	export function encode_unaligned(type: builtins.TSBuiltin<lnk.ConstString>, value_expr: string) {
		return `$state.fatal('Cannot decode unaligned const_str')`;
	}

	export function decode_aligned(type: builtins.TSBuiltin<lnk.ConstString>, assign: Assign) {
		const ts_const_str = type.state.ts_module.add_const_str(type.type);
		const ts_const_u8 = type.state.ts_module.add_const_str_as_byte_array(type.type);
		const bytes = `$state.read_from.take_bytes(${type.type.value.length}, false)`;
		return assign(`$state.assert_u8_array_match(${bytes}, ${ts_const_u8.ref_str}, ${ts_const_str.ref_str})`);
	}

	export function decode_unaligned(type: builtins.TSBuiltin<lnk.ConstString>, assign: Assign) {
		return `$state.fatal('Cannot decode unaligned const_str')`;
	}
}

export namespace fixed_int {
	export const mask = new Uint32Array(33);

	// Block to scope `temp` so it goes away when we're done with it
	{
		let temp = 0;
		for (let i = 1; i < 33; i++) {
			temp <<= 1;
			mask[i] = (temp |= 1);
		}
	}

	export function field_type(type: builtins.TSBuiltin<lnk.FixedIntType>) : string {
		return type.type.size_bits > 32 ? 'bigint' : 'number';
	}

	export function encode_aligned(type: builtins.TSBuiltin<lnk.FixedIntType>, value_expr: string) : string {
		const { size_bits, is_signed, is_big_endian } = type.type;

		switch (size_bits) {
			case 8: return `$state.write_to.write_${is_signed ? 'i8' : 'u8'}(${value_expr});`;
			case 16: return `$state.write_to.write_${is_signed ? 'i16' : 'u16'}_${is_big_endian ? 'be' : 'le'}(${value_expr});`;
			case 24: return `$state.write_to.write_${is_signed ? 'i24' : 'u24'}_${is_big_endian ? 'be' : 'le'}(${value_expr});`;
			case 32: return `$state.write_to.write_${is_signed ? 'i32' : 'u32'}_${is_big_endian ? 'be' : 'le'}(${value_expr});`;
			case 64: return `$state.write_to.write_${is_signed ? 'i64' : 'u64'}_${is_big_endian ? 'be' : 'le'}(${value_expr});`;
			case 128: return `$state.write_to.write_${is_signed ? 'i128' : 'u128'}_${is_big_endian ? 'be' : 'le'}(${value_expr});`;
		}

		if (size_bits < 1 || size_bits > 32) {
			throw new Error(`Invalid bit size ${size_bits} for fixed int`);
		}

		if (size_bits < 9) {
			return `$state.write_to.write_${is_signed ? 'i8' : 'u8'}(${value_expr}) & 0x${mask[size_bits].toString(16)};`;
		}

		if (size_bits < 17) {
			return `$state.write_to.write_${is_signed ? 'i16' : 'u16'}_${is_big_endian ? 'be' : 'le'}(${value_expr}) & 0x${mask[size_bits].toString(16)};`;
		}

		if (size_bits < 25) {
			return `$state.write_to.write_${is_signed ? 'i24' : 'u24'}_${is_big_endian ? 'be' : 'le'}(${value_expr}) & 0x${mask[size_bits].toString(16)};`;
		}

		return `$state.write_to.write_${is_signed ? 'i32' : 'u32'}_${is_big_endian ? 'be' : 'le'}(${value_expr}) & 0x${mask[size_bits].toString(16)};`;
	}

	export function encode_unaligned(type: builtins.TSBuiltin<lnk.FixedIntType>, value_expr: string) : string {
		return `$state.fatal('Cannot encode unaligned int field')`;
	}
	
	export function decode_aligned(type: builtins.TSBuiltin<lnk.FixedIntType>, assign: Assign) : string {
		const { size_bits, is_signed, is_big_endian } = type.type;

		switch (size_bits) {
			case 8: return assign(`$state.read_from.read_${is_signed ? 'i8' : 'u8'}()`);
			case 16: return assign(`$state.read_from.read_${is_signed ? 'i16' : 'u16'}_${is_big_endian ? 'be' : 'le'}()`);
			case 24: return assign(`$state.read_from.read_${is_signed ? 'i24' : 'u24'}_${is_big_endian ? 'be' : 'le'}()`);
			case 32: return assign(`$state.read_from.read_${is_signed ? 'i32' : 'u32'}_${is_big_endian ? 'be' : 'le'}()`);
			case 64: return assign(`$state.read_from.read_${is_signed ? 'i64' : 'u64'}_${is_big_endian ? 'be' : 'le'}()`);
			case 128: return assign(`$state.read_from.read_${is_signed ? 'i128' : 'u128'}_${is_big_endian ? 'be' : 'le'}()`);
		}

		if (size_bits < 1 || size_bits > 32) {
			throw new Error(`Invalid bit size ${size_bits} for fixed int`);
		}

		if (size_bits < 9) {
			return assign(`$state.read_from.read_${is_signed ? 'i8' : 'u8'}() & 0x${mask[size_bits].toString(16)}`);
		}

		if (size_bits < 17) {
			return assign(`$state.read_from.read_${is_signed ? 'i16' : 'u16'}_${is_big_endian ? 'be' : 'le'}() & 0x${mask[size_bits].toString(16)}`);
		}

		if (size_bits < 25) {
			return assign(`$state.read_from.read_${is_signed ? 'i24' : 'u24'}_${is_big_endian ? 'be' : 'le'}() & 0x${mask[size_bits].toString(16)}`);
		}

		return assign(`$state.read_from.read_${is_signed ? 'i32' : 'u32'}_${is_big_endian ? 'be' : 'le'}() & 0x${mask[size_bits].toString(16)}`);
	}

	export function decode_unaligned(type: builtins.TSBuiltin<lnk.FixedIntType>, assign: Assign) : string {
		return assign(`$state.fatal('Cannot decode unaligned int field')`);
	}
}

export namespace varint {
	export function field_type(type: builtins.TSBuiltin<lnk.VarIntType>) {
		return fixed_int.field_type(type.real_type);
	}

	export function encode_aligned(type: builtins.TSBuiltin<lnk.VarIntType>, value_expr: string) {
		return `$state.fatal('not implemented')`;
	}

	export function encode_unaligned(type: builtins.TSBuiltin<lnk.VarIntType>, value_expr: string) {
		return `$state.fatal('not implemented')`;
	}

	export function decode_aligned(type: builtins.TSBuiltin<lnk.VarIntType>, assign: Assign) {
		return `$state.fatal('not implemented')`;
	}

	export function decode_unaligned(type: builtins.TSBuiltin<lnk.VarIntType>, assign: Assign) {
		return `$state.fatal('not implemented')`;
	}
}

export namespace text {
	export function field_type(type: builtins.TSBuiltin<lnk.TextType>) : string {
		return 'string';
	}

	export function encode_aligned(type: builtins.TSBuiltin<lnk.TextType>, value_expr: string) {
		switch (type.type.length.length_type) {
			case 'length_field':
				return `$state.fatal('not supported')`;

			case 'length_prefix':
				return `$state.fatal('not supported')`;

			case 'null_terminated':
				return `$state.fatal('not supported')`;

			case 'static_length':
				return `$state.fatal('not supported')`;

			case 'take_remaining':
				return `$state.fatal('not supported')`;
		}
	}

	export function encode_unaligned(type: builtins.TSBuiltin<lnk.TextType>, value_expr: string) {
		return `$state.fatal('Cannot encode unaligned text field')`;
	}

	export function decode_aligned(type: builtins.TSBuiltin<lnk.TextType>, assign: Assign) {
		switch (type.type.length.length_type) {
			case 'length_field':
				return `$state.fatal('not supported');`;

			case 'length_prefix': {
				const len = type.length_type.decode_aligned((x) => x);
				const bytes = `$state.read_from.take_bytes(${len}, false)`;
				return assign(`$state.read_from.${as_text(type.type)}(${bytes})`);
			}

			case 'null_terminated':
				return assign(`$state.read_from.${read_null_term(type.type)}()`);

			case 'static_length': {
				const len = type.type.length.value.value;
				const bytes = `$state.read_from.take_bytes(${len}, false)`;
				return assign(`$state.read_from.${as_text(type.type)}(${bytes})`);
			}

			case 'take_remaining':
				return `$state.fatal('not supported');`;
		}
	}

	export function decode_unaligned(type: builtins.TSBuiltin<lnk.TextType>, assign: Assign) {
		return `$state.fatal('Cannot decode unaligned text field');`;
	}

	function read_null_term(expr: lnk.TextType) {
		switch (expr.name) {
			case 'ascii': return 'read_ascii_null_term';
			case 'utf8': return 'read_utf8_null_term';
			case 'utf16': return 'read_utf16_null_term';
			case 'utf32': return 'read_utf32_null_term';
		}
	}

	function as_text(expr: lnk.TextType) {
		switch (expr.name) {
			case 'ascii': return 'as_ascii';
			case 'utf8': return 'as_utf8';
			case 'utf16': return 'as_utf16';
			case 'utf32': return 'as_utf32';
		}
	}
}

export namespace float {
	export function field_type(type: builtins.TSBuiltin<lnk.FloatType>) {
		return 'number';
	}

	export function encode_aligned(type: builtins.TSBuiltin<lnk.FloatType>, value_expr: string) {
		return `$state.fatal('not implemented')`;
	}

	export function encode_unaligned(type: builtins.TSBuiltin<lnk.FloatType>, value_expr: string) {
		return `$state.fatal('not implemented')`;
	}

	export function decode_aligned(type: builtins.TSBuiltin<lnk.FloatType>, assign: Assign) {
		return `$state.fatal('not implemented')`;
	}

	export function decode_unaligned(type: builtins.TSBuiltin<lnk.FloatType>, assign: Assign) {
		return `$state.fatal('not implemented')`;
	}
}

export namespace len {
	export function field_type(type: builtins.TSBuiltin<lnk.LengthType>) {
		return type.real_type.field_type();
	}

	export function encode_aligned(type: builtins.TSBuiltin<lnk.LengthType>, value_expr: string) {
		return `$state.fatal('not implemented')`;
	}

	export function encode_unaligned(type: builtins.TSBuiltin<lnk.LengthType>, value_expr: string) {
		return `$state.fatal('not implemented')`;
	}

	export function decode_aligned(type: builtins.TSBuiltin<lnk.LengthType>, assign: Assign) {
		return `$state.fatal('not implemented')`;
	}

	export function decode_unaligned(type: builtins.TSBuiltin<lnk.LengthType>, assign: Assign) {
		return `$state.fatal('not implemented')`;
	}
}

export namespace checksum {
	export function field_type(type: builtins.TSBuiltin<lnk.ChecksumType>) {
		return type.real_type.field_type();
	}

	export function encode_aligned(type: builtins.TSBuiltin<lnk.ChecksumType>, value_expr: string) {
		return `$state.fatal('not implemented')`;
	}

	export function encode_unaligned(type: builtins.TSBuiltin<lnk.ChecksumType>, value_expr: string) {
		return `$state.fatal('not implemented')`;
	}

	export function decode_aligned(type: builtins.TSBuiltin<lnk.ChecksumType>, assign: Assign) {
		return `$state.fatal('not implemented')`;
	}

	export function decode_unaligned(type: builtins.TSBuiltin<lnk.ChecksumType>, assign: Assign) {
		return `$state.fatal('not implemented')`;
	}
}

export namespace int_array {
	export type IntArray = lnk.ArrayType<lnk.FixedIntType>;

	export function field_type(type: builtins.TSBuiltin<IntArray>) {
		return `${type.real_type.field_type()}[]`;
	}

	export function encode_aligned(type: builtins.TSBuiltin<IntArray>, value_expr: string) {
		return `$state.fatal('not implemented')`;
	}

	export function encode_unaligned(type: builtins.TSBuiltin<IntArray>, value_expr: string) {
		return `$state.fatal('not implemented')`;
	}

	export function decode_aligned(type: builtins.TSBuiltin<IntArray>, assign: Assign) {
		return `$state.fatal('not implemented')`;
	}

	export function decode_unaligned(type: builtins.TSBuiltin<IntArray>, assign: Assign) {
		return `$state.fatal('not implemented')`;
	}
}
