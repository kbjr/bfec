
interface BufferReaderTemplateOpts {
	include_i16: boolean;
	include_i24: boolean;
	include_i32: boolean;
	include_i64: boolean;
	include_i128: boolean;
	include_f32: boolean;
	include_f64: boolean;
	include_varint: boolean;
	include_byte_array: boolean;
	include_ascii: boolean;
	include_utf8: boolean;
	include_utf16: boolean;
	include_utf32: boolean;
	
	/**
	 * If enabled, bounds checks when `cursor` is moved are removed, providing
	 * potentially better performance at the cost of safety against out-of-bounds
	 * reads.
	 * 
	 * **Default**: `false`
	 * 
	 * **Recommended**: `false`
	 */
	no_bounds_checks?: boolean;

	/**
	 * If enabled, this option will cause `take_bytes()` et al perform copies
	 * under fewer circumstances, improving speed at the cost of potential
	 * memory safety.
	 * 
	 * **Default**: `false`
	 */
	default_no_copy?: boolean;

	/**
	 * If enabled, endianness checks at read-time will be fully removed and all
	 * read functions will assume a little-endian environment.
	 * 
	 * **Default**: `false`
	 */
	assume_le?: boolean;
	
	/**
	 * If enabled, endianness checks at read-time will be fully removed and all
	 * read functions will assume a big-endian environment.
	 * 
	 * **Default**: `false`
	 */
	assume_be?: boolean;
}

export const buffer_reader_template = (tmpl: BufferReaderTemplateOpts) => `
import * as reg from './registers';

export class $BufferReader {
	constructor(
		public array: Uint8Array
	) { }
	${tmpl.no_bounds_checks ? cursor_no_checks_template() : cursor_with_checks_template()}
	public get eof() {
		return this.cursor >= this.array.length;
	}


	// ===== 8-bit Ints =====

	public read_u8() {
		return this.array[this.cursor++];
	}

	public read_i8() {
		reg.u8[0] = this.read_u8();
		return reg.i8[0];
	}


	${tmpl.include_i16 ? i16_impl(tmpl) : ''}


	${tmpl.include_i24 ? i24_impl(tmpl) : ''}


	${tmpl.include_i32 ? i32_impl(tmpl) : ''}


	${tmpl.include_i64 ? i64_impl(tmpl) : ''}


	${tmpl.include_i128 ? i128_impl(tmpl) : ''}


	${tmpl.include_f32 ? f32_impl(tmpl) : ''}


	${tmpl.include_f64 ? f64_impl(tmpl) : ''}

	
	${tmpl.include_varint ? varint_impl(tmpl) : ''}


	${tmpl.include_byte_array || include_text(tmpl) ? byte_array_impl(tmpl) : ''}


	${tmpl.include_ascii ? ascii_impl(tmpl) : ''}

	
	// TODO: utf8


	// TODO: utf16
	
	
	// TODO: utf32

}
`;

const read_u8s_fw = (start: number, count: number, indent: string) => {
	const lines: string[] = [ ];

	for (let i = 0; i < count; i++) {
		lines.push(`reg.u8[${start + i}] = this.read_u8();`);
	}

	return lines.join(`\n${indent}`);
}

const read_u8s_bw = (start: number, count: number, indent: string) => {
	const lines: string[] = [ ];

	for (let i = 0; i < count; i++) {
		lines.push(`reg.u8[${start - i}] = this.read_u8();`);
	}

	return lines.join(`\n${indent}`);
}

const include_text = (tmpl: BufferReaderTemplateOpts) => (
	tmpl.include_ascii || tmpl.include_utf8 || tmpl.include_utf16 || tmpl.include_utf32
);

const endian_variant = (tmpl: BufferReaderTemplateOpts, base_name: string, little_endian: boolean) => {
	if (tmpl.assume_le) {
		return little_endian ? `this.${base_name}_fw()` : `this.${base_name}_bw()`;
	}
	
	if (tmpl.assume_be) {
		return little_endian ? `this.${base_name}_bw()` : `this.${base_name}_fw()`;
	}

	const is_fw = little_endian ? 'reg.is_le' : 'reg.is_be';
	return `${is_fw} ? this.${base_name}_fw() : this.${base_name}_bw()`;
}

const cursor_with_checks_template = () => `
	private _cursor: number = 0;
		
	public get cursor() {
		return this._cursor;
	}

	public set cursor(new_value: number) {
		if (new_value > this.array.length) {
			throw new Error(\`Cursor \${new_value} out of bounds\`);
		}

		this._cursor = new_value;
	}
`;

const cursor_no_checks_template = () => `
	public cursor: number = 0;
`;

const i16_impl = (tmpl: BufferReaderTemplateOpts) => `
	// ===== 16-bit Ints =====

	public read_u16_le() {
		return ${endian_variant(tmpl, 'read_u16', true)};
	}

	public read_u16_be() {
		return ${endian_variant(tmpl, 'read_u16', false)};
	}

	public read_i16_le() {
		return ${endian_variant(tmpl, 'read_i16', true)};
	}

	public read_i16_be() {
		return ${endian_variant(tmpl, 'read_i16', false)};
	}

	private read_u16_fw() {
		${read_u8s_fw(0, 2, '\t\t')}
		return reg.u16[0];
	}

	private read_u16_bw() {
		${read_u8s_bw(1, 2, '\t\t')}
		return reg.u16[0];
	}

	private read_i16_fw() {
		${read_u8s_fw(0, 2, '\t\t')}
		return reg.i16[0];
	}

	private read_i16_bw() {
		${read_u8s_bw(1, 2, '\t\t')}
		return reg.i16[0];
	}
`;

const i24_impl = (tmpl: BufferReaderTemplateOpts) => `
	// ===== 24-bit Ints =====

	public read_u24_le() {
		return ${endian_variant(tmpl, 'read_u24', true)};
	}

	public read_u24_be() {
		return ${endian_variant(tmpl, 'read_u24', false)};
	}

	public read_i24_le() {
		return ${endian_variant(tmpl, 'read_i24', true)};
	}

	public read_i24_be() {
		return ${endian_variant(tmpl, 'read_i24', false)};
	}

	private read_u24_fw() {
		${read_u8s_fw(0, 3, '\t\t')}
		reg.u8[3] = 0x00;
		return reg.u32[0];
	}

	private read_u24_bw() {
		${read_u8s_bw(3, 3, '\t\t')}
		reg.u8[0] = 0x00;
		return reg.u32[0];
	}

	private read_i24_fw() {
		reg.u8[0] = 0x00;
		${read_u8s_fw(1, 3, '\t\t')}
		return reg.i32[0] >> 8;
	}

	private read_i24_bw() {
		reg.u8[3] = 0x00;
		${read_u8s_bw(2, 3, '\t\t')}
		return reg.i32[0] >> 8;
	}
`;

const i32_impl = (tmpl: BufferReaderTemplateOpts) => `
	// ===== 32-bit Ints =====

	public read_u32_le() {
		return ${endian_variant(tmpl, 'read_u32', true)};
	}

	public read_u32_be() {
		return ${endian_variant(tmpl, 'read_u32', false)};
	}

	public read_i32_le() {
		return ${endian_variant(tmpl, 'read_i32', true)};
	}

	public read_i32_be() {
		return ${endian_variant(tmpl, 'read_i32', false)};
	}

	private read_u32_fw() {
		${read_u8s_fw(0, 4, '\t\t')}
		return reg.u32[0];
	}

	private read_u32_bw() {
		${read_u8s_bw(3, 4, '\t\t')}
		return reg.u32[0];
	}

	private read_i32_fw() {
		${read_u8s_fw(0, 4, '\t\t')}
		return reg.i32[0];
	}

	private read_i32_bw() {
		${read_u8s_bw(3, 4, '\t\t')}
		return reg.i32[0];
	}
`;

const i64_impl = (tmpl: BufferReaderTemplateOpts) => `
	// ===== 64-bit Ints =====

	public read_u64_le() {
		return ${endian_variant(tmpl, 'read_u64', true)};
	}

	public read_u64_be() {
		return ${endian_variant(tmpl, 'read_u64', false)};
	}

	public read_i64_le() {
		return ${endian_variant(tmpl, 'read_i64', true)};
	}

	public read_i64_be() {
		return ${endian_variant(tmpl, 'read_i64', false)};
	}

	private read_u64_fw() {
		${read_u8s_fw(0, 8, '\t\t')}
		return reg.u64[0];
	}

	private read_u64_bw() {
		${read_u8s_bw(7, 8, '\t\t')}
		return reg.u64[0];
	}

	private read_i64_fw() {
		${read_u8s_fw(0, 8, '\t\t')}
		return reg.i64[0];
	}

	private read_i64_bw() {
		${read_u8s_bw(7, 8, '\t\t')}
		return reg.i64[0];
	}
`;

const i128_impl = (tmpl: BufferReaderTemplateOpts) => `
	// ===== 128-bit Ints =====

	public read_u128_le() {
		return ${endian_variant(tmpl, 'read_u128', true)};
	}

	public read_u128_be() {
		return ${endian_variant(tmpl, 'read_u128', false)};
	}

	public read_i128_le() {
		return ${endian_variant(tmpl, 'read_i128', true)};
	}

	public read_i128_be() {
		return ${endian_variant(tmpl, 'read_i128', false)};
	}

	private read_u128_fw() {
		let result = 0n;

		for (let bits = 0n; bits < 128n; bits += 8n) {
			result |= BigInt(this.read_u8()) << bits;
		}

		return BigInt.asUintN(128, result);
	}

	private read_u128_bw() {
		let result = 0n;

		for (let bits = 0n; bits < 128n; bits += 8n) {
			result <<= 8n;
			result |= BigInt(this.read_u8());
		}

		return BigInt.asUintN(128, result);
	}

	private read_i128_fw() {
		let result = 0n;

		for (let bits = 0n; bits < 128n; bits += 8n) {
			result |= BigInt(this.read_u8()) << bits;
		}

		return BigInt.asIntN(128, result);
	}

	private read_i128_bw() {
		let result = 0n;

		for (let bits = 0n; bits < 128n; bits += 8n) {
			result <<= 8n;
			result |= BigInt(this.read_u8());
		}

		return BigInt.asIntN(128, result);
	}
`;

const f32_impl = (tmpl: BufferReaderTemplateOpts) => `
	// ===== 32-bit Binary Floats =====

	public read_f32_le() {
		return ${endian_variant(tmpl, 'read_f32', true)};
	}

	public read_f32_be() {
		return ${endian_variant(tmpl, 'read_f32', false)};
	}

	private read_f32_fw() {
		${read_u8s_fw(0, 4, '\t\t')}
		return reg.f32[0];
	}

	private read_f32_bw() {
		${read_u8s_bw(3, 4, '\t\t')}
		return reg.f32[0];
	}
`;

const f64_impl = (tmpl: BufferReaderTemplateOpts) => `
	// ===== 64-bit Binary Floats =====

	public read_f64_le() {
		return ${endian_variant(tmpl, 'read_f64', true)};
	}

	public read_f64_be() {
		return ${endian_variant(tmpl, 'read_f64', false)};
	}

	private read_f64_fw() {
		${read_u8s_fw(0, 8, '\t\t')}
		return reg.f64[0];
	}

	private read_f64_bw() {
		${read_u8s_bw(7, 8, '\t\t')}
		return reg.f64[0];
	}
`;

const varint_impl = (tmpl: BufferReaderTemplateOpts) => `
	// ===== Variable-Width Ints =====

	public read_varint_u_le(max_bits: number) : number {
		const big = this.read_varint_big(BigInt(max_bits));
	}

	public read_varint_u_be(max_bits: number) : number {
		const big = this.read_varint_big(BigInt(max_bits));
	}

	public read_varint_s_le(max_bits: number) : number {
		const big = this.read_varint_big(BigInt(max_bits));
	}

	public read_varint_s_be(max_bits: number) : number {
		const big = this.read_varint_big(BigInt(max_bits));
	}

	public read_varint_big_u_le(max_bits: bigint) : bigint {
		// 
	}

	public read_varint_big_u_be(max_bits: bigint) : bigint {
		// 
	}

	public read_varint_big_s_le(max_bits: bigint) : bigint {
		// 
	}

	public read_varint_big_s_be(max_bits: bigint) : bigint {
		// 
	}
`;

const byte_array_impl = (tmpl: BufferReaderTemplateOpts) => `
	// ===== Byte Arrays =====

	public take_bytes(len: number, copy = ${tmpl.default_no_copy ? 'false' : 'true'}) : Uint8Array {
		return copy
			? this.array.slice(this.cursor, this.cursor += len)
			: this.array.subarray(this.cursor, this.cursor += len);
	}

	public take_bytes_big(len: bigint, copy = ${tmpl.default_no_copy ? 'false' : 'true'}) : Uint8Array {
		if (len > Number.MAX_SAFE_INTEGER) {
			throw new Error('Cannot support array sizes larger than Number.MAX_SAFE_INTEGER');
		}

		return this.take_bytes(Number(len), copy);
	}

	public take_bytes_null_term(copy = ${tmpl.default_no_copy ? 'false' : 'true'}) : Uint8Array {
		const start = this.cursor;
		while (this.read_u8()) /* pass */ ;
		
		return copy
			? this.array.slice(start, this.cursor - 1)
			: this.array.subarray(start, this.cursor - 1);
	}

	public take_bytes_remaining(copy = ${tmpl.default_no_copy ? 'false' : 'true'}) : Uint8Array {
		return copy
			? this.array.slice(this.cursor, this.array.length)
			: this.array.subarray(this.cursor, this.array.length);
	}
`;

const ascii_impl = (tmpl: BufferReaderTemplateOpts) => `
	// ===== ASCII Text =====

	public static as_ascii(array: Uint8Array) : string {
		const len = array.length;
		const chars: string[] = new Array(len);

		for (let i = 0; i < len; i++) {
			chars[i] = String.fromCharCode(array[i]);
		}

		return chars.join('');
	}

	public read_ascii_null_term() : string {
		const chars: string[] = [ ];

		let byte: number;

		while (byte = this.read_u8()) {
			chars.push(String.fromCharCode(byte));
		}

		return chars.join('');
	}
`;
