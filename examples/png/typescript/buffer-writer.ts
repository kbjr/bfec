
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.371Z
*/

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


	
	// ===== 16-bit Ints =====

	public write_u16_le(value: number) {
		this.ensure_space_exists(2);
		reg.is_le ? this.current.write_u16_fw(value) : this.current.write_u16_bw(value);
	}

	public write_u16_be(value: number) {
		this.ensure_space_exists(2);
		reg.is_be ? this.current.write_u16_fw(value) : this.current.write_u16_bw(value);
	}

	public write_i16_le(value: number) {
		this.ensure_space_exists(2);
		reg.is_le ? this.current.write_i16_fw(value) : this.current.write_i16_bw(value);
	}

	public write_i16_be(value: number) {
		this.ensure_space_exists(2);
		reg.is_be ? this.current.write_i16_fw(value) : this.current.write_i16_bw(value);
	}



	
	// ===== 24-bit Ints =====

	public write_u24_le(value: number) {
		this.ensure_space_exists(3);
		reg.is_le ? this.current.write_u24_fw(value) : this.current.write_u24_bw(value);
	}

	public write_u24_be(value: number) {
		this.ensure_space_exists(3);
		reg.is_be ? this.current.write_u24_fw(value) : this.current.write_u24_bw(value);
	}

	public write_i24_le(value: number) {
		this.ensure_space_exists(3);
		reg.is_le ? this.current.write_i24_fw(value) : this.current.write_i24_bw(value);
	}

	public write_i24_be(value: number) {
		this.ensure_space_exists(3);
		reg.is_be ? this.current.write_i24_fw(value) : this.current.write_i24_bw(value);
	}



	
	// ===== 32-bit Ints =====

	public write_u32_le(value: number) {
		this.ensure_space_exists(4);
		reg.is_le ? this.current.write_u32_fw(value) : this.current.write_u32_bw(value);
	}

	public write_u32_be(value: number) {
		this.ensure_space_exists(4);
		reg.is_be ? this.current.write_u32_fw(value) : this.current.write_u32_bw(value);
	}

	public write_i32_le(value: number) {
		this.ensure_space_exists(4);
		reg.is_le ? this.current.write_i32_fw(value) : this.current.write_i32_bw(value);
	}

	public write_i32_be(value: number) {
		this.ensure_space_exists(4);
		reg.is_be ? this.current.write_i32_fw(value) : this.current.write_i32_bw(value);
	}



	
	// ===== 64-bit Ints =====

	public write_u64_le(value: bigint) {
		this.ensure_space_exists(8);
		return reg.is_le ? this.current.write_u64_fw(value) : this.current.write_u64_bw(value);
	}

	public write_u64_be(value: bigint) {
		this.ensure_space_exists(8);
		return reg.is_be ? this.current.write_u64_fw(value) : this.current.write_u64_bw(value);
	}

	public write_i64_le(value: bigint) {
		this.ensure_space_exists(8);
		return reg.is_le ? this.current.write_i64_fw(value) : this.current.write_i64_bw(value);
	}

	public write_i64_be(value: bigint) {
		this.ensure_space_exists(8);
		return reg.is_be ? this.current.write_i64_fw(value) : this.current.write_i64_bw(value);
	}



	
	// ===== 128-bit Ints =====

	public write_u128_le(value: bigint) {
		this.ensure_space_exists(8);
		return reg.is_le ? this.current.write_u128_fw(value) : this.current.write_u128_bw(value);
	}

	public write_u128_be(value: bigint) {
		this.ensure_space_exists(8);
		return reg.is_be ? this.current.write_u128_fw(value) : this.current.write_u128_bw(value);
	}

	public write_i128_le(value: bigint) {
		this.ensure_space_exists(8);
		return reg.is_le ? this.current.write_i128_fw(value) : this.current.write_i128_bw(value);
	}

	public write_i128_be(value: bigint) {
		this.ensure_space_exists(8);
		return reg.is_be ? this.current.write_i128_fw(value) : this.current.write_i128_bw(value);
	}



	
	// ===== 32-bit Binary Floats =====

	public write_f32_le(value: number) {
		this.ensure_space_exists(4);
		reg.is_le ? this.current.write_f32_fw(value) : this.current.write_f32_bw(value);
	}

	public write_f32_be(value: number) {
		this.ensure_space_exists(4);
		reg.is_be ? this.current.write_f32_fw(value) : this.current.write_f32_bw(value);
	}



	
	// ===== 64-bit Binary Floats =====

	public write_f64_le(value: number) {
		this.ensure_space_exists(8);
		return reg.is_le ? this.current.write_f64_fw(value) : this.current.write_f64_bw(value);
	}

	public write_f64_be(value: number) {
		this.ensure_space_exists(8);
		return reg.is_be ? this.current.write_f64_fw(value) : this.current.write_f64_bw(value);
	}



	
	// ===== 32-bit Decimal Floats =====

	public write_d32_le(value: number) {
		this.ensure_space_exists(4);
		reg.is_le ? this.current.write_d32_fw(value) : this.current.write_d32_bw(value);
	}

	public write_d32_be(value: number) {
		this.ensure_space_exists(4);
		reg.is_be ? this.current.write_d32_fw(value) : this.current.write_d32_bw(value);
	}



	
	// ===== 64-bit Decimal Floats =====

	public write_d64_le(value: number) {
		this.ensure_space_exists(8);
		return reg.is_le ? this.current.write_d64_fw(value) : this.current.write_d64_bw(value);
	}

	public write_d64_be(value: number) {
		this.ensure_space_exists(8);
		return reg.is_be ? this.current.write_d64_fw(value) : this.current.write_d64_bw(value);
	}


	
	
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


	
	// ===== 16-bit Ints =====

	public write_u16_fw(value: number) {
		reg.u16[0] = value;
		this.write_u8(reg.u8[0])
		this.write_u8(reg.u8[1]);
	}

	public write_u16_bw(value: number) {
		reg.u16[0] = value;
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[0]);
	}

	public write_i16_fw(value: number) {
		reg.i16[0] = value;
		this.write_u8(reg.u8[0])
		this.write_u8(reg.u8[1]);
	}

	public write_i16_bw(value: number) {
		reg.i16[0] = value;
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[0]);
	}



	
	// ===== 24-bit Ints =====
	// TODO: Verify these are implemented accurately

	public write_u24_fw(value: number) {
		reg.u32[0] = value;
		this.write_u8(reg.u8[0])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[2]);
	}

	public write_u24_bw(value: number) {
		reg.u32[0] = value;
		this.write_u8(reg.u8[3])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[1]);
	}

	public write_i24_fw(value: number) {
		reg.i32[0] = value << 8;
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[3]);
	}

	public write_i24_bw(value: number) {
		reg.i32[0] = value << 8;
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[0]);
	}



	
	// ===== 32-bit Ints =====

	public write_u32_fw(value: number) {
		reg.u32[0] = value;
		this.write_u8(reg.u8[0])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[3]);
	}

	public write_u32_bw(value: number) {
		reg.u32[0] = value;
		this.write_u8(reg.u8[3])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[0]);
	}

	public write_i32_fw(value: number) {
		reg.i32[0] = value;
		this.write_u8(reg.u8[0])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[3]);
	}

	public write_i32_bw(value: number) {
		reg.i32[0] = value;
		this.write_u8(reg.u8[3])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[0]);
	}



	
	// ===== 64-bit Ints =====

	public write_u64_fw(value: bigint) {
		reg.u64[0] = value;
		this.write_u8(reg.u8[0])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[3])
		this.write_u8(reg.u8[4])
		this.write_u8(reg.u8[5])
		this.write_u8(reg.u8[6])
		this.write_u8(reg.u8[7])
	}

	public write_u64_bw(value: bigint) {
		reg.u64[0] = value;
		this.write_u8(reg.u8[7])
		this.write_u8(reg.u8[6])
		this.write_u8(reg.u8[5])
		this.write_u8(reg.u8[4])
		this.write_u8(reg.u8[3])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[0])
	}

	public write_i64_fw(value: bigint) {
		reg.i64[0] = value;
		this.write_u8(reg.u8[0])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[3])
		this.write_u8(reg.u8[4])
		this.write_u8(reg.u8[5])
		this.write_u8(reg.u8[6])
		this.write_u8(reg.u8[7])
	}

	public write_i64_bw(value: bigint) {
		reg.i64[0] = value;
		this.write_u8(reg.u8[7])
		this.write_u8(reg.u8[6])
		this.write_u8(reg.u8[5])
		this.write_u8(reg.u8[4])
		this.write_u8(reg.u8[3])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[0])
	}



	
	// ===== 128-bit Ints =====

	public write_u128_fw(value: bigint) {
		reg.u128[0] = value;
		this.write_u8(reg.u8[0])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[3])
		this.write_u8(reg.u8[4])
		this.write_u8(reg.u8[5])
		this.write_u8(reg.u8[6])
		this.write_u8(reg.u8[7])
		this.write_u8(reg.u8[8])
		this.write_u8(reg.u8[9])
		this.write_u8(reg.u8[10])
		this.write_u8(reg.u8[11])
		this.write_u8(reg.u8[12])
		this.write_u8(reg.u8[13])
		this.write_u8(reg.u8[14])
		this.write_u8(reg.u8[15])
	}

	public write_u128_bw(value: bigint) {
		reg.u128[0] = value;
		this.write_u8(reg.u8[15])
		this.write_u8(reg.u8[14])
		this.write_u8(reg.u8[13])
		this.write_u8(reg.u8[12])
		this.write_u8(reg.u8[11])
		this.write_u8(reg.u8[10])
		this.write_u8(reg.u8[9])
		this.write_u8(reg.u8[8])
		this.write_u8(reg.u8[7])
		this.write_u8(reg.u8[6])
		this.write_u8(reg.u8[5])
		this.write_u8(reg.u8[4])
		this.write_u8(reg.u8[3])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[0])
	}

	public write_i128_fw(value: bigint) {
		reg.i128[0] = value;
		this.write_u8(reg.u8[0])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[3])
		this.write_u8(reg.u8[4])
		this.write_u8(reg.u8[5])
		this.write_u8(reg.u8[6])
		this.write_u8(reg.u8[7])
		this.write_u8(reg.u8[8])
		this.write_u8(reg.u8[9])
		this.write_u8(reg.u8[10])
		this.write_u8(reg.u8[11])
		this.write_u8(reg.u8[12])
		this.write_u8(reg.u8[13])
		this.write_u8(reg.u8[14])
		this.write_u8(reg.u8[15])
	}

	public write_i128_bw(value: bigint) {
		reg.i128[0] = value;
		this.write_u8(reg.u8[15])
		this.write_u8(reg.u8[14])
		this.write_u8(reg.u8[13])
		this.write_u8(reg.u8[12])
		this.write_u8(reg.u8[11])
		this.write_u8(reg.u8[10])
		this.write_u8(reg.u8[9])
		this.write_u8(reg.u8[8])
		this.write_u8(reg.u8[7])
		this.write_u8(reg.u8[6])
		this.write_u8(reg.u8[5])
		this.write_u8(reg.u8[4])
		this.write_u8(reg.u8[3])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[0])
	}



	
	// ===== 32-bit Binary Floats =====

	public write_f32_fw(value: number) {
		reg.f32[0] = value;
		this.write_u8(reg.u8[0])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[3]);
	}

	public write_f32_bw(value: number) {
		reg.f32[0] = value;
		this.write_u8(reg.u8[3])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[0]);
	}



	
	// ===== 64-bit Binary Floats =====

	public write_f64_fw(value: number) {
		reg.f64[0] = value;
		this.write_u8(reg.u8[0])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[3])
		this.write_u8(reg.u8[4])
		this.write_u8(reg.u8[5])
		this.write_u8(reg.u8[6])
		this.write_u8(reg.u8[7])
	}

	public write_f64_bw(value: number) {
		reg.f64[0] = value;
		this.write_u8(reg.u8[7])
		this.write_u8(reg.u8[6])
		this.write_u8(reg.u8[5])
		this.write_u8(reg.u8[4])
		this.write_u8(reg.u8[3])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[0])
	}



	
	// ===== 32-bit Decimal Floats =====

	public write_d32_fw(value: number) {
		reg.d32[0] = value;
		this.write_u8(reg.u8[0])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[3]);
	}

	public write_d32_bw(value: number) {
		reg.d32[0] = value;
		this.write_u8(reg.u8[3])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[0]);
	}



	
	// ===== 64-bit Decimal Floats =====

	public write_d64_fw(value: number) {
		reg.d64[0] = value;
		this.write_u8(reg.u8[0])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[3])
		this.write_u8(reg.u8[4])
		this.write_u8(reg.u8[5])
		this.write_u8(reg.u8[6])
		this.write_u8(reg.u8[7])
	}

	public write_d64_bw(value: number) {
		reg.d64[0] = value;
		this.write_u8(reg.u8[7])
		this.write_u8(reg.u8[6])
		this.write_u8(reg.u8[5])
		this.write_u8(reg.u8[4])
		this.write_u8(reg.u8[3])
		this.write_u8(reg.u8[2])
		this.write_u8(reg.u8[1])
		this.write_u8(reg.u8[0])
	}

}
