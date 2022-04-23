
interface BufferWriterTemplateOpts {
	include_i16: boolean;
	include_i24: boolean;
	include_i32: boolean;
	include_i64: boolean;
	include_i128: boolean;
	include_f32: boolean;
	include_f64: boolean;
	include_d32: boolean;
	include_d64: boolean;
	include_varint: boolean;
	include_byte_array: boolean;
	include_ascii: boolean;
	include_utf8: boolean;
	include_utf16: boolean;
	include_utf32: boolean;
	
	/**
	 * If enabled, endianness checks at write-time will be fully removed and all
	 * write functions will assume a little-endian environment.
	 * 
	 * **Default**: `false`
	 */
	assume_le?: boolean;
	
	/**
	 * If enabled, endianness checks at write-time will be fully removed and all
	 * write functions will assume a big-endian environment.
	 * 
	 * **Default**: `false`
	 */
	assume_be?: boolean;
}

export const buffer_writer_template = (tmpl: BufferWriterTemplateOpts) => `
import * as reg from './registers';

type BitSize = 1  | 2  | 3  | 4  | 5  | 6  | 7  | 8
             | 9  | 10 | 11 | 12 | 13 | 14 | 15 | 16
             | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24
             | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32;

export class $BufferWriter {
	private chunks: $BufferWriterChunk[] = [ ];
	private current: $BufferWriterChunk;

	constructor(
		public chunk_size: number = 4096
	) {
		this.grow();
	}

	public get total_used_space() {
		let total_space = 0;

		for (const chunk of this.chunks) {
			total_space += chunk.used_space;
		}

		return total_space;
	}

	public as_u8_array() : Uint8Array {
		const u8_array = new Uint8Array(this.total_used_space);

		let offset = 0;

		for (const chunk of this.chunks) {
			u8_array.set(chunk.array.subarray(0, chunk.used_space), offset);
			offset += chunk.used_space;
		}

		return u8_array;
	}
	
	private ensure_space_exists(space_needed: number) {
		if (this.current.remaining_space < space_needed) {
			this.grow(this.chunk_size < space_needed ? space_needed : this.chunk_size);
		}
	}

	private grow(size: number = this.chunk_size) {
		this.current = new $BufferWriterChunk(this.chunk_size);
		this.chunks.push(this.current);
	}



	// ===== Unaligned Bits =====

	public write_bits(count: BitSize, value: number) {
		const offset = this.current.bits_used + count;

		// TODO: This doesn't work right when a byte is already partially taken and
		// should finish getting populated (rather than immediately growing and forcing
		// byte alignment)
		this.ensure_space_exists(offset > 24 ? 4 : offset > 16 ? 3 : offset > 8 ? 2 : 1);

		this.current.write_bits(count, value);
	}



	// ===== 8-Bit Ints =====

	public write_u8(value: number) {
		this.ensure_space_exists(1);
		this.current.write_u8(value);
	}

	public write_i8(value: number) {
		this.ensure_space_exists(1);
		this.current.write_i8(value);
	}


	${tmpl.include_i16 ? i16_writer_impl(tmpl) : ''}


	${tmpl.include_i24 ? i24_writer_impl(tmpl) : ''}


	${tmpl.include_i32 ? i32_writer_impl(tmpl) : ''}


	${tmpl.include_i64 ? i64_writer_impl(tmpl) : ''}


	${tmpl.include_i128 ? i128_writer_impl(tmpl) : ''}


	${tmpl.include_f32 ? f32_writer_impl(tmpl) : ''}


	${tmpl.include_f64 ? f64_writer_impl(tmpl) : ''}


	${tmpl.include_d32 ? d32_writer_impl(tmpl) : ''}


	${tmpl.include_d64 ? d64_writer_impl(tmpl) : ''}

	
	${tmpl.include_varint ? varint_writer_impl(tmpl) : ''}


	${tmpl.include_byte_array || include_text(tmpl) ? byte_array_writer_impl(tmpl) : ''}



	// TODO: utf16
	
	
	// TODO: utf32



}

export class $BufferWriterChunk {
	public array: Uint8Array;
	public bits_used: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 = 0;
	public cursor = 0;

	constructor(
		public total_space: number
	) { }

	public get used_space() {
		return this.cursor;
	}

	public get remaining_space() {
		return this.total_space - this.cursor;
	}



	// ===== Unaligned Bits =====

	public write_bits(count: BitSize, value: number) {
		// 
	}



	// ===== 8-Bit Ints =====

	public write_u8(value: number) {
		this.array[this.cursor++] = value;
	}

	public write_i8(value: number) {
		reg.i8[0] = value;
		this.array[this.cursor++] = reg.u8[0];
	}


	${tmpl.include_i16 ? i16_chunk_impl(tmpl) : ''}


	${tmpl.include_i24 ? i24_chunk_impl(tmpl) : ''}


	${tmpl.include_i32 ? i32_chunk_impl(tmpl) : ''}


	${tmpl.include_i64 ? i64_chunk_impl(tmpl) : ''}


	${tmpl.include_i128 ? i128_chunk_impl(tmpl) : ''}


	${tmpl.include_f32 ? f32_chunk_impl(tmpl) : ''}


	${tmpl.include_f64 ? f64_chunk_impl(tmpl) : ''}


	${tmpl.include_d32 ? d32_chunk_impl(tmpl) : ''}


	${tmpl.include_d64 ? d64_chunk_impl(tmpl) : ''}
}
`;

const write_u8s_fw = (start: number, count: number, indent: string) => {
	const lines: string[] = [ ];

	for (let i = 0; i < count; i++) {
		lines.push(`this.write_u8(reg.u8[${start + i}])`);
	}

	return lines.join(`\n${indent}`);
}

const write_u8s_bw = (start: number, count: number, indent: string) => {
	const lines: string[] = [ ];

	for (let i = 0; i < count; i++) {
		lines.push(`this.write_u8(reg.u8[${start - i}])`);
	}

	return lines.join(`\n${indent}`);
}

const include_text = (tmpl: BufferWriterTemplateOpts) => (
	tmpl.include_ascii || tmpl.include_utf8 || tmpl.include_utf16 || tmpl.include_utf32
);

const endian_variant = (tmpl: BufferWriterTemplateOpts, base_name: string, little_endian: boolean) => {
	if (tmpl.assume_le) {
		return little_endian ? `this.current.${base_name}_fw(value)` : `this.current.${base_name}_bw(value)`;
	}
	
	if (tmpl.assume_be) {
		return little_endian ? `this.current.${base_name}_bw(value)` : `this.current.${base_name}_fw(value)`;
	}

	const is_fw = little_endian ? 'reg.is_le' : 'reg.is_be';
	return `${is_fw} ? this.current.${base_name}_fw(value) : this.current.${base_name}_bw(value)`;
};

const i16_writer_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== 16-bit Ints =====

	public write_u16_le(value: number) {
		this.ensure_space_exists(2);
		${endian_variant(tmpl, 'write_u16', true)};
	}

	public write_u16_be(value: number) {
		this.ensure_space_exists(2);
		${endian_variant(tmpl, 'write_u16', false)};
	}

	public write_i16_le(value: number) {
		this.ensure_space_exists(2);
		${endian_variant(tmpl, 'write_i16', true)};
	}

	public write_i16_be(value: number) {
		this.ensure_space_exists(2);
		${endian_variant(tmpl, 'write_i16', false)};
	}
`;

const i16_chunk_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== 16-bit Ints =====

	public write_u16_fw(value: number) {
		reg.u16[0] = value;
		${write_u8s_fw(0, 2, '\t\t')};
	}

	public write_u16_bw(value: number) {
		reg.u16[0] = value;
		${write_u8s_bw(1, 2, '\t\t')};
	}

	public write_i16_fw(value: number) {
		reg.i16[0] = value;
		${write_u8s_fw(0, 2, '\t\t')};
	}

	public write_i16_bw(value: number) {
		reg.i16[0] = value;
		${write_u8s_bw(1, 2, '\t\t')};
	}
`;

const i24_writer_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== 24-bit Ints =====

	public write_u24_le(value: number) {
		this.ensure_space_exists(3);
		${endian_variant(tmpl, 'write_u24', true)};
	}

	public write_u24_be(value: number) {
		this.ensure_space_exists(3);
		${endian_variant(tmpl, 'write_u24', false)};
	}

	public write_i24_le(value: number) {
		this.ensure_space_exists(3);
		${endian_variant(tmpl, 'write_i24', true)};
	}

	public write_i24_be(value: number) {
		this.ensure_space_exists(3);
		${endian_variant(tmpl, 'write_i24', false)};
	}
`;

const i24_chunk_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== 24-bit Ints =====
	// TODO: Verify these are implemented accurately

	public write_u24_fw(value: number) {
		reg.u32[0] = value;
		${write_u8s_fw(0, 3, '\t\t')};
	}

	public write_u24_bw(value: number) {
		reg.u32[0] = value;
		${write_u8s_bw(3, 3, '\t\t')};
	}

	public write_i24_fw(value: number) {
		reg.i32[0] = value << 8;
		${write_u8s_fw(1, 3, '\t\t')};
	}

	public write_i24_bw(value: number) {
		reg.i32[0] = value << 8;
		${write_u8s_bw(2, 3, '\t\t')};
	}
`;

const i32_writer_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== 32-bit Ints =====

	public write_u32_le(value: number) {
		this.ensure_space_exists(4);
		${endian_variant(tmpl, 'write_u32', true)};
	}

	public write_u32_be(value: number) {
		this.ensure_space_exists(4);
		${endian_variant(tmpl, 'write_u32', false)};
	}

	public write_i32_le(value: number) {
		this.ensure_space_exists(4);
		${endian_variant(tmpl, 'write_i32', true)};
	}

	public write_i32_be(value: number) {
		this.ensure_space_exists(4);
		${endian_variant(tmpl, 'write_i32', false)};
	}
`;

const i32_chunk_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== 32-bit Ints =====

	public write_u32_fw(value: number) {
		reg.u32[0] = value;
		${write_u8s_fw(0, 4, '\t\t')};
	}

	public write_u32_bw(value: number) {
		reg.u32[0] = value;
		${write_u8s_bw(3, 4, '\t\t')};
	}

	public write_i32_fw(value: number) {
		reg.i32[0] = value;
		${write_u8s_fw(0, 4, '\t\t')};
	}

	public write_i32_bw(value: number) {
		reg.i32[0] = value;
		${write_u8s_bw(3, 4, '\t\t')};
	}
`;

const i64_writer_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== 64-bit Ints =====

	public write_u64_le(value: bigint) {
		this.ensure_space_exists(8);
		return ${endian_variant(tmpl, 'write_u64', true)};
	}

	public write_u64_be(value: bigint) {
		this.ensure_space_exists(8);
		return ${endian_variant(tmpl, 'write_u64', false)};
	}

	public write_i64_le(value: bigint) {
		this.ensure_space_exists(8);
		return ${endian_variant(tmpl, 'write_i64', true)};
	}

	public write_i64_be(value: bigint) {
		this.ensure_space_exists(8);
		return ${endian_variant(tmpl, 'write_i64', false)};
	}
`;

const i64_chunk_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== 64-bit Ints =====

	public write_u64_fw(value: bigint) {
		reg.u64[0] = value;
		${write_u8s_fw(0, 8, '\t\t')}
	}

	public write_u64_bw(value: bigint) {
		reg.u64[0] = value;
		${write_u8s_bw(7, 8, '\t\t')}
	}

	public write_i64_fw(value: bigint) {
		reg.i64[0] = value;
		${write_u8s_fw(0, 8, '\t\t')}
	}

	public write_i64_bw(value: bigint) {
		reg.i64[0] = value;
		${write_u8s_bw(7, 8, '\t\t')}
	}
`;

const i128_writer_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== 128-bit Ints =====

	public write_u128_le(value: bigint) {
		this.ensure_space_exists(8);
		return ${endian_variant(tmpl, 'write_u128', true)};
	}

	public write_u128_be(value: bigint) {
		this.ensure_space_exists(8);
		return ${endian_variant(tmpl, 'write_u128', false)};
	}

	public write_i128_le(value: bigint) {
		this.ensure_space_exists(8);
		return ${endian_variant(tmpl, 'write_i128', true)};
	}

	public write_i128_be(value: bigint) {
		this.ensure_space_exists(8);
		return ${endian_variant(tmpl, 'write_i128', false)};
	}
`;

const i128_chunk_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== 128-bit Ints =====

	public write_u128_fw(value: bigint) {
		reg.u128[0] = value;
		${write_u8s_fw(0, 16, '\t\t')}
	}

	public write_u128_bw(value: bigint) {
		reg.u128[0] = value;
		${write_u8s_bw(15, 16, '\t\t')}
	}

	public write_i128_fw(value: bigint) {
		reg.i128[0] = value;
		${write_u8s_fw(0, 16, '\t\t')}
	}

	public write_i128_bw(value: bigint) {
		reg.i128[0] = value;
		${write_u8s_bw(15, 16, '\t\t')}
	}
`;

const f32_writer_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== 32-bit Binary Floats =====

	public write_f32_le(value: number) {
		this.ensure_space_exists(4);
		${endian_variant(tmpl, 'write_f32', true)};
	}

	public write_f32_be(value: number) {
		this.ensure_space_exists(4);
		${endian_variant(tmpl, 'write_f32', false)};
	}
`;

const f32_chunk_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== 32-bit Binary Floats =====

	public write_f32_fw(value: number) {
		reg.f32[0] = value;
		${write_u8s_fw(0, 4, '\t\t')};
	}

	public write_f32_bw(value: number) {
		reg.f32[0] = value;
		${write_u8s_bw(3, 4, '\t\t')};
	}
`;

const f64_writer_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== 64-bit Binary Floats =====

	public write_f64_le(value: number) {
		this.ensure_space_exists(8);
		return ${endian_variant(tmpl, 'write_f64', true)};
	}

	public write_f64_be(value: number) {
		this.ensure_space_exists(8);
		return ${endian_variant(tmpl, 'write_f64', false)};
	}
`;

const f64_chunk_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== 64-bit Binary Floats =====

	public write_f64_fw(value: number) {
		reg.f64[0] = value;
		${write_u8s_fw(0, 8, '\t\t')}
	}

	public write_f64_bw(value: number) {
		reg.f64[0] = value;
		${write_u8s_bw(7, 8, '\t\t')}
	}
`;

const d32_writer_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== 32-bit Decimal Floats =====

	public write_d32_le(value: number) {
		this.ensure_space_exists(4);
		${endian_variant(tmpl, 'write_d32', true)};
	}

	public write_d32_be(value: number) {
		this.ensure_space_exists(4);
		${endian_variant(tmpl, 'write_d32', false)};
	}
`;

const d32_chunk_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== 32-bit Decimal Floats =====

	public write_d32_fw(value: number) {
		reg.d32[0] = value;
		${write_u8s_fw(0, 4, '\t\t')};
	}

	public write_d32_bw(value: number) {
		reg.d32[0] = value;
		${write_u8s_bw(3, 4, '\t\t')};
	}
`;

const d64_writer_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== 64-bit Decimal Floats =====

	public write_d64_le(value: number) {
		this.ensure_space_exists(8);
		return ${endian_variant(tmpl, 'write_d64', true)};
	}

	public write_d64_be(value: number) {
		this.ensure_space_exists(8);
		return ${endian_variant(tmpl, 'write_d64', false)};
	}
`;

const d64_chunk_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== 64-bit Decimal Floats =====

	public write_d64_fw(value: number) {
		reg.d64[0] = value;
		${write_u8s_fw(0, 8, '\t\t')}
	}

	public write_d64_bw(value: number) {
		reg.d64[0] = value;
		${write_u8s_bw(7, 8, '\t\t')}
	}
`;

const varint_writer_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== Variable-Width Ints =====

	public write_varint_u_le(max_bits: number, value: number) {
		this.write_varint_big_u_le(max_bits, BigInt(value));
	}

	public write_varint_u_be(max_bits: number, value: number) {
		this.write_varint_big_u_be(max_bits, BigInt(value));
	}

	public write_varint_s_le(max_bits: number, value: number) {
		this.write_varint_big_s_le(max_bits, BigInt(value));
	}

	public write_varint_s_be(max_bits: number, value: number) {
		this.write_varint_big_s_be(max_bits, BigInt(value));
	}

	public write_varint_big_u_le(max_bits: number, value: bigint) {
		value = BigInt.asUintN(max_bits, value);

		let bits = 0n;

		while (true) {
			bits = value & 0x7fn;
			value >>= 7n;

			if (value) {
				bits |= 0x80n;
				this.write_u8(Number(bits));
				continue;
			}

			this.write_u8(Number(bits));
			break;
		}
	}

	public write_varint_big_u_be(max_bits: number, value: bigint) {
		value = BigInt.asUintN(max_bits, value);

		// TODO: Is this even worth supporting?
	}

	public write_varint_big_s_le(max_bits: number, value: bigint) {
		this.write_varint_big_u_le(max_bits, BigInt.asIntN(max_bits, value));
	}

	public write_varint_big_s_be(max_bits: number, value: bigint) {
		this.write_varint_big_be(max_bits, BigInt.asIntN(max_bits, value));
	}
`;

const byte_array_writer_impl = (tmpl: BufferWriterTemplateOpts) => `
	// ===== Byte Arrays =====

	public write_bytes(bytes: Uint8Array) {
		const space = this.current.remaining_space;

		// If we have enough remaining space in the current chunk, just copy the
		// contents of the array in
		if (space >= bytes.length) {
			this.current.array.set(bytes, this.current.cursor);
			this.current.cursor += bytes.length;
		}
		
		// Otherwise, we'll need to grow the buffer after (maybe) filling out
		// whatever space is left in the current chunk
		else {
			// Don't bother filling out the last remaining space if its very small.
			// TODO: Is this a worth-while check? What would be a reasonable limit
			// for defining "very small"?
			if (space >= 20) {
				const start = bytes.subarray(0, space);
				bytes = bytes.subarray(space);
				this.current.array.set(start, this.current.cursor);
				this.current.cursor += bytes.length;
			}

			this.grow(this.chunk_size < bytes.length ? bytes.length : this.chunk_size);
			this.current.array.set(bytes, this.current.cursor);
			this.current.cursor += bytes.length;
		}
	}
`;


/*

	${tmpl.include_ascii ? ascii_writer_impl(tmpl) : ''}

	
	${tmpl.include_utf8 ? utf8_writer_impl(tmpl) : ''}*/
