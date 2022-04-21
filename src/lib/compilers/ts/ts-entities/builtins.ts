
import * as lnk from '../../../linker';
import { ConstString } from '../../../linker';
import { CompilerState } from '../state';

export namespace builtins {
	export type Builtin = lnk.BuiltinType | lnk.ConstInt | lnk.ConstString;

	export function field_type(state: CompilerState, expr: Builtin) : string {
		switch (expr.type) {
			case 'const_int': return const_int.field_type(state, expr);
			case 'const_string': return const_str.field_type(state, expr);
			case 'type_fixed_int': return fixed_int.field_type(state, expr);
			case 'type_text': return text.field_type(state, expr);
			case 'type_checksum': return checksum.field_type(state, expr);
			case 'type_len': return len.field_type(state, expr);
			case 'type_float': return float.field_type(state, expr);
			case 'type_var_int': return varint.field_type(state, expr);
			default: return 'never';
		}
	}

	export function encode_aligned(state: CompilerState, expr: Builtin, value_expr: string) {
		switch (expr.type) {
			case 'const_int': return const_int.encode_aligned(state, expr, value_expr);
			case 'const_string': return const_str.encode_aligned(state, expr, value_expr);
			case 'type_fixed_int': return fixed_int.encode_aligned(state, expr, value_expr);
			case 'type_text': return text.encode_aligned(state, expr, value_expr);
			case 'type_checksum': return checksum.encode_aligned(state, expr);
			case 'type_len': return len.encode_aligned(state, expr);
			case 'type_float': return float.encode_aligned(state, expr);
			case 'type_var_int': return varint.encode_aligned(state, expr);
			default: return `$state.fatal('Do not know how to encode ${expr.type}')`;
		}
	}

	export function encode_unaligned(state: CompilerState, expr: Builtin, value_expr: string) {
		switch (expr.type) {
			case 'const_int': return const_int.encode_unaligned(state, expr, value_expr);
			case 'const_string': return const_str.encode_unaligned(state, expr, value_expr);
			case 'type_fixed_int': return fixed_int.encode_unaligned(state, expr, value_expr);
			case 'type_text': return text.encode_unaligned(state, expr, value_expr);
			case 'type_checksum': return checksum.encode_unaligned(state, expr);
			case 'type_len': return len.encode_unaligned(state, expr);
			case 'type_float': return float.encode_unaligned(state, expr);
			case 'type_var_int': return varint.encode_unaligned(state, expr);
			default: return `$state.fatal('Do not know how to encode ${expr.type}')`;
		}
	}

	export function decode_aligned(state: CompilerState, expr: Builtin) {
		switch (expr.type) {
			case 'const_int': return const_int.decode_aligned(state, expr);
			case 'const_string': return const_str.decode_aligned(state, expr);
			case 'type_fixed_int': return fixed_int.decode_aligned(state, expr);
			case 'type_text': return text.decode_aligned(state, expr);
			case 'type_checksum': return checksum.decode_aligned(state, expr);
			case 'type_len': return len.decode_aligned(state, expr);
			case 'type_float': return float.decode_aligned(state, expr);
			case 'type_var_int': return varint.decode_aligned(state, expr);
			default: return `$state.fatal('Do not know how to decode ${expr.type}')`;
		}
	}

	export function decode_unaligned(state: CompilerState, expr: Builtin) {
		switch (expr.type) {
			case 'const_int': return const_int.decode_unaligned(state, expr);
			case 'const_string': return const_str.decode_unaligned(state, expr);
			case 'type_fixed_int': return fixed_int.decode_unaligned(state, expr);
			case 'type_text': return text.decode_unaligned(state, expr);
			case 'type_checksum': return checksum.decode_unaligned(state, expr);
			case 'type_len': return len.decode_unaligned(state, expr);
			case 'type_float': return float.decode_unaligned(state, expr);
			case 'type_var_int': return varint.decode_unaligned(state, expr);
			default: return `$state.fatal('Do not know how to decode ${expr.type}')`;
		}
	}
}

export namespace const_int {
	const u32_max = (2 ** 32) - 1;
	const u32_max_big = BigInt(u32_max);

	export function field_type(state: CompilerState, expr: lnk.ConstInt) : string {
		return `0x${expr.value.toString(16)}${expr.value > u32_max_big ? 'n' : ''}`;
	}

	export function encode_aligned(state: CompilerState, expr: lnk.ConstInt, value_expr: string) {
		// TODO: 
		return `encode_const_int(${value_expr})`;
	}

	export function encode_unaligned(state: CompilerState, expr: lnk.ConstInt, value_expr: string) {
		return `$state.fatal('Cannot decode unaligned const_int')`;
	}

	export function decode_aligned(state: CompilerState, expr: lnk.ConstInt) {
		// TODO:
		return `decode_const_int()`;
	}

	export function decode_unaligned(state: CompilerState, expr: lnk.ConstInt) {
		return `$state.fatal('Cannot decode unaligned const_int')`;
	}
}

export namespace const_str {
	export function field_type(state: CompilerState, expr: lnk.ConstString) : string {
		// TODO: Do something more JS-safe
		return expr.token.text;
	}

	export function encode_aligned(state: CompilerState, expr: lnk.ConstString, value_expr: string) {
		const ts_const_str = state.ts_module.add_const_str(expr);
		const ts_const_u8 = state.ts_module.add_const_str_as_byte_array(expr);
		const lines: string[] = [
			`$state.assert_str_match(${value_expr}, ${ts_const_str.ref_str});`,
			`// TODO: Write bytes in ts_const_u8`
		];
		return `{\n\t\t\t${lines.join('\n\t\t\t')}\n\t\t}`;
	}

	export function encode_unaligned(state: CompilerState, expr: lnk.ConstString, value_expr: string) {
		return `$state.fatal('Cannot decode unaligned const_str')`;
	}

	export function decode_aligned(state: CompilerState, expr: lnk.ConstString) {
		const ts_const_str = state.ts_module.add_const_str(expr);
		const ts_const_u8 = state.ts_module.add_const_str_as_byte_array(expr);
		const bytes = `$state.read_from.take_bytes(${expr.value.length}, false)`;
		return `$state.assert_u8_array_match(${bytes}, ${ts_const_u8.ref_str}, ${ts_const_str.ref_str})`;
	}

	export function decode_unaligned(state: CompilerState, expr: lnk.ConstString) {
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

	export function field_type(state: CompilerState, expr: lnk.FixedIntType) : string {
		return expr.size_bits > 32 ? 'bigint' : 'number';
	}

	export function encode_aligned(state: CompilerState, expr: lnk.FixedIntType, value_expr: string) : string {
		switch (expr.size_bits) {
			case 8: return `$state.write_to.write_${expr.is_signed ? 'i8' : 'u8'}(${value_expr});`;
			case 16: return `$state.write_to.write_${expr.is_signed ? 'i16' : 'u16'}_${expr.is_big_endian ? 'be' : 'le'}(${value_expr});`;
			case 24: return `$state.write_to.write_${expr.is_signed ? 'i24' : 'u24'}_${expr.is_big_endian ? 'be' : 'le'}(${value_expr});`;
			case 32: return `$state.write_to.write_${expr.is_signed ? 'i32' : 'u32'}_${expr.is_big_endian ? 'be' : 'le'}(${value_expr});`;
			case 64: return `$state.write_to.write_${expr.is_signed ? 'i64' : 'u64'}_${expr.is_big_endian ? 'be' : 'le'}(${value_expr});`;
			case 128: return `$state.write_to.write_${expr.is_signed ? 'i128' : 'u128'}_${expr.is_big_endian ? 'be' : 'le'}(${value_expr});`;
		}

		if (expr.size_bits < 1 || expr.size_bits > 32) {
			throw new Error(`Invalid bit size ${expr.size_bits} for fixed int`);
		}

		if (expr.size_bits < 9) {
			return `$state.write_to.write_${expr.is_signed ? 'i8' : 'u8'}(${value_expr}) & 0x${mask[expr.size_bits].toString(16)};`;
		}

		if (expr.size_bits < 17) {
			return `$state.write_to.write_${expr.is_signed ? 'i16' : 'u16'}_${expr.is_big_endian ? 'be' : 'le'}(${value_expr}) & 0x${mask[expr.size_bits].toString(16)};`;
		}

		if (expr.size_bits < 25) {
			return `$state.write_to.write_${expr.is_signed ? 'i24' : 'u24'}_${expr.is_big_endian ? 'be' : 'le'}(${value_expr}) & 0x${mask[expr.size_bits].toString(16)};`;
		}

		return `$state.write_to.write_${expr.is_signed ? 'i32' : 'u32'}_${expr.is_big_endian ? 'be' : 'le'}(${value_expr}) & 0x${mask[expr.size_bits].toString(16)};`;
	}
	
	export function decode_aligned(state: CompilerState, expr: lnk.FixedIntType) : string {
		switch (expr.size_bits) {
			case 8: return `$state.read_from.read_${expr.is_signed ? 'i8' : 'u8'}();`;
			case 16: return `$state.read_from.read_${expr.is_signed ? 'i16' : 'u16'}_${expr.is_big_endian ? 'be' : 'le'}();`;
			case 24: return `$state.read_from.read_${expr.is_signed ? 'i24' : 'u24'}_${expr.is_big_endian ? 'be' : 'le'}();`;
			case 32: return `$state.read_from.read_${expr.is_signed ? 'i32' : 'u32'}_${expr.is_big_endian ? 'be' : 'le'}();`;
			case 64: return `$state.read_from.read_${expr.is_signed ? 'i64' : 'u64'}_${expr.is_big_endian ? 'be' : 'le'}();`;
			case 128: return `$state.read_from.read_${expr.is_signed ? 'i128' : 'u128'}_${expr.is_big_endian ? 'be' : 'le'}();`;
		}

		if (expr.size_bits < 1 || expr.size_bits > 32) {
			throw new Error(`Invalid bit size ${expr.size_bits} for fixed int`);
		}

		if (expr.size_bits < 9) {
			return `$state.read_from.read_${expr.is_signed ? 'i8' : 'u8'}() & 0x${mask[expr.size_bits].toString(16)};`;
		}

		if (expr.size_bits < 17) {
			return `$state.read_from.read_${expr.is_signed ? 'i16' : 'u16'}_${expr.is_big_endian ? 'be' : 'le'}() & 0x${mask[expr.size_bits].toString(16)};`;
		}

		if (expr.size_bits < 25) {
			return `$state.read_from.read_${expr.is_signed ? 'i24' : 'u24'}_${expr.is_big_endian ? 'be' : 'le'}() & 0x${mask[expr.size_bits].toString(16)};`;
		}

		return `$state.read_from.read_${expr.is_signed ? 'i32' : 'u32'}_${expr.is_big_endian ? 'be' : 'le'}() & 0x${mask[expr.size_bits].toString(16)};`;
	}

	export function decode_unaligned(state: CompilerState, expr: lnk.FixedIntType) : string {
		return `$state.fatal('Cannot decode unaligned int field')`;
	}

	export function encode_unaligned(state: CompilerState, expr: lnk.FixedIntType, value_expr: string) : string {
		return `$state.fatal('Cannot encode unaligned int field')`;
	}
}

export namespace varint {
	export function field_type(state: CompilerState, expr: lnk.VarIntType) {
		return fixed_int.field_type(state, expr.real_type);
	}

	export function encode_aligned(state: CompilerState, expr: lnk.VarIntType) {
		// 
	}

	export function encode_unaligned(state: CompilerState, expr: lnk.VarIntType) {
		// 
	}

	export function decode_aligned(state: CompilerState, expr: lnk.VarIntType) {
		// 
	}

	export function decode_unaligned(state: CompilerState, expr: lnk.VarIntType) {
		// 
	}
}

export namespace text {
	export function field_type(state: CompilerState, expr: lnk.TextType) : string {
		return 'string';
	}

	export function encode_aligned(state: CompilerState, expr: lnk.TextType, value_expr: string) {
		switch (expr.length.length_type) {
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

	export function encode_unaligned(state: CompilerState, expr: lnk.TextType, value_expr: string) {
		return `$state.fatal('Cannot encode unaligned text field')`;
	}

	export function decode_aligned(state: CompilerState, expr: lnk.TextType) {
		switch (expr.length.length_type) {
			case 'length_field':
				return `$state.fatal('not supported')`;

			case 'length_prefix': {
				const len = builtins.decode_aligned(state, expr.length.prefix_type);
				const bytes = `$state.read_from.take_bytes(${len}, false)`;
				return `$state.read_from.${as_text(expr)}(${bytes})`;
			}

			case 'null_terminated':
				return `$state.read_from.${read_null_term(expr)}()`;

			case 'static_length': {
				const len = expr.length.value.value;
				const bytes = `$state.read_from.take_bytes(${len}, false)`;
				return `$state.read_from.${as_text(expr)}(${bytes})`;
			}

			case 'take_remaining':
				return `$state.fatal('not supported')`;
		}
	}

	export function decode_unaligned(state: CompilerState, expr: lnk.TextType) {
		return `$state.fatal('Cannot decode unaligned text field')`;
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
	export function field_type(state: CompilerState, expr: lnk.FloatType) {
		return 'number';
	}

	export function encode_aligned(state: CompilerState, expr: lnk.FloatType) {
		// 
	}

	export function encode_unaligned(state: CompilerState, expr: lnk.FloatType) {
		// 
	}

	export function decode_aligned(state: CompilerState, expr: lnk.FloatType) {
		// 
	}

	export function decode_unaligned(state: CompilerState, expr: lnk.FloatType) {
		// 
	}
}

export namespace len {
	export function field_type(state: CompilerState, expr: lnk.LengthType) {
		return builtins.field_type(state, expr.real_type);
	}

	export function encode_aligned(state: CompilerState, expr: lnk.LengthType) {
		// 
	}

	export function encode_unaligned(state: CompilerState, expr: lnk.LengthType) {
		// 
	}

	export function decode_aligned(state: CompilerState, expr: lnk.LengthType) {
		// 
	}

	export function decode_unaligned(state: CompilerState, expr: lnk.LengthType) {
		// 
	}
}

export namespace checksum {
	export function field_type(state: CompilerState, expr: lnk.ChecksumType) {
		state.on_checksum_ref(expr);
		return builtins.field_type(state, expr.real_type);
	}

	export function encode_aligned(state: CompilerState, expr: lnk.ChecksumType) {
		state.on_checksum_ref(expr);
	}

	export function encode_unaligned(state: CompilerState, expr: lnk.ChecksumType) {
		state.on_checksum_ref(expr);
	}

	export function decode_aligned(state: CompilerState, expr: lnk.ChecksumType) {
		state.on_checksum_ref(expr);
	}

	export function decode_unaligned(state: CompilerState, expr: lnk.ChecksumType) {
		state.on_checksum_ref(expr);
	}
}
