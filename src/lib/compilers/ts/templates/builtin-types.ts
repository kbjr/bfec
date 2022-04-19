
import * as lnk from '../../../linker';

export namespace builtins {
	const u32_max = (2 ** 32) - 1;
	const u32_max_big = BigInt(u32_max);

	export function field_type(expr: lnk.BuiltinType | lnk.ConstInt | lnk.ConstString) : string {
		switch (expr.type) {
			case 'const_int': return `0x${expr.value.toString(16)}${expr.value > u32_max_big ? 'n' : ''}`;
			// TODO: Better encode that's JS safe
			case 'const_string': return expr.token.text;
			case 'type_fixed_int': return fixed_int.field_type(expr);
			default: 'never';
		}
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

	export function field_type(expr: lnk.FixedIntType) : string {
		return expr.size_bits > 32 ? 'bigint' : 'number';
	}

	export function encode_aligned(expr: lnk.FixedIntType, value_expr: string) : string {
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
	
	export function decode(expr: lnk.FixedIntType, load_to: string) : string {
		switch (expr.size_bits) {
			case 8: return `${load_to} = $state.read_from.read_${expr.is_signed ? 'i8' : 'u8'}();`;
			case 16: return `${load_to} = $state.read_from.read_${expr.is_signed ? 'i16' : 'u16'}_${expr.is_big_endian ? 'be' : 'le'}();`;
			case 24: return `${load_to} = $state.read_from.read_${expr.is_signed ? 'i24' : 'u24'}_${expr.is_big_endian ? 'be' : 'le'}();`;
			case 32: return `${load_to} = $state.read_from.read_${expr.is_signed ? 'i32' : 'u32'}_${expr.is_big_endian ? 'be' : 'le'}();`;
			case 64: return `${load_to} = $state.read_from.read_${expr.is_signed ? 'i64' : 'u64'}_${expr.is_big_endian ? 'be' : 'le'}();`;
			case 128: return `${load_to} = $state.read_from.read_${expr.is_signed ? 'i128' : 'u128'}_${expr.is_big_endian ? 'be' : 'le'}();`;
		}

		if (expr.size_bits < 1 || expr.size_bits > 32) {
			throw new Error(`Invalid bit size ${expr.size_bits} for fixed int`);
		}

		if (expr.size_bits < 9) {
			return `${load_to} = $state.read_from.read_${expr.is_signed ? 'i8' : 'u8'}() & 0x${mask[expr.size_bits].toString(16)};`;
		}

		if (expr.size_bits < 17) {
			return `${load_to} = $state.read_from.read_${expr.is_signed ? 'i16' : 'u16'}_${expr.is_big_endian ? 'be' : 'le'}() & 0x${mask[expr.size_bits].toString(16)};`;
		}

		if (expr.size_bits < 25) {
			return `${load_to} = $state.read_from.read_${expr.is_signed ? 'i24' : 'u24'}_${expr.is_big_endian ? 'be' : 'le'}() & 0x${mask[expr.size_bits].toString(16)};`;
		}

		return `${load_to} = $state.read_from.read_${expr.is_signed ? 'i32' : 'u32'}_${expr.is_big_endian ? 'be' : 'le'}() & 0x${mask[expr.size_bits].toString(16)};`;
	}

	export function encode_unaligned(expr: lnk.FixedIntType, value_expr: string, assume_aligned?: boolean) : string {
		if (assume_aligned) {
			return fixed_int.encode_aligned(expr, value_expr);
		}
	}
};
