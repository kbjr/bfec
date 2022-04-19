
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-19T07:40:18.194Z
*/

import * as reg from './registers';

const utf8_decode = new TextDecoder('utf-8');
const utf16_decode = new TextDecoder('utf-16');

export class $BufferReader {
	constructor(
		public array: Uint8Array
	) { }

	public unaligned_byte?: number;
	public bit_offset: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 = 0;
	
	private _cursor: number = 0;
		
	public get cursor() {
		return this._cursor;
	}

	public set cursor(new_value: number) {
		if (new_value > this.array.length) {
			throw new Error(`Cursor ${new_value} out of bounds`);
		}

		this._cursor = new_value;
	}

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


	
	// ===== 16-bit Ints =====

	public read_u16_le() {
		return reg.is_le ? this.read_u16_fw() : this.read_u16_bw();
	}

	public read_u16_be() {
		return reg.is_be ? this.read_u16_fw() : this.read_u16_bw();
	}

	public read_i16_le() {
		return reg.is_le ? this.read_i16_fw() : this.read_i16_bw();
	}

	public read_i16_be() {
		return reg.is_be ? this.read_i16_fw() : this.read_i16_bw();
	}

	private read_u16_fw() {
		reg.u8[0] = this.read_u8();
		reg.u8[1] = this.read_u8();
		return reg.u16[0];
	}

	private read_u16_bw() {
		reg.u8[1] = this.read_u8();
		reg.u8[0] = this.read_u8();
		return reg.u16[0];
	}

	private read_i16_fw() {
		reg.u8[0] = this.read_u8();
		reg.u8[1] = this.read_u8();
		return reg.i16[0];
	}

	private read_i16_bw() {
		reg.u8[1] = this.read_u8();
		reg.u8[0] = this.read_u8();
		return reg.i16[0];
	}



	
	// ===== 24-bit Ints =====

	public read_u24_le() {
		return reg.is_le ? this.read_u24_fw() : this.read_u24_bw();
	}

	public read_u24_be() {
		return reg.is_be ? this.read_u24_fw() : this.read_u24_bw();
	}

	public read_i24_le() {
		return reg.is_le ? this.read_i24_fw() : this.read_i24_bw();
	}

	public read_i24_be() {
		return reg.is_be ? this.read_i24_fw() : this.read_i24_bw();
	}

	private read_u24_fw() {
		reg.u8[0] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[3] = 0x00;
		return reg.u32[0];
	}

	private read_u24_bw() {
		reg.u8[3] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[0] = 0x00;
		return reg.u32[0];
	}

	private read_i24_fw() {
		reg.u8[0] = 0x00;
		reg.u8[1] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[3] = this.read_u8();
		return reg.i32[0] >> 8;
	}

	private read_i24_bw() {
		reg.u8[3] = 0x00;
		reg.u8[2] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[0] = this.read_u8();
		return reg.i32[0] >> 8;
	}



	
	// ===== 32-bit Ints =====

	public read_u32_le() {
		return reg.is_le ? this.read_u32_fw() : this.read_u32_bw();
	}

	public read_u32_be() {
		return reg.is_be ? this.read_u32_fw() : this.read_u32_bw();
	}

	public read_i32_le() {
		return reg.is_le ? this.read_i32_fw() : this.read_i32_bw();
	}

	public read_i32_be() {
		return reg.is_be ? this.read_i32_fw() : this.read_i32_bw();
	}

	private read_u32_fw() {
		reg.u8[0] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[3] = this.read_u8();
		return reg.u32[0];
	}

	private read_u32_bw() {
		reg.u8[3] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[0] = this.read_u8();
		return reg.u32[0];
	}

	private read_i32_fw() {
		reg.u8[0] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[3] = this.read_u8();
		return reg.i32[0];
	}

	private read_i32_bw() {
		reg.u8[3] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[0] = this.read_u8();
		return reg.i32[0];
	}



	
	// ===== 64-bit Ints =====

	public read_u64_le() {
		return reg.is_le ? this.read_u64_fw() : this.read_u64_bw();
	}

	public read_u64_be() {
		return reg.is_be ? this.read_u64_fw() : this.read_u64_bw();
	}

	public read_i64_le() {
		return reg.is_le ? this.read_i64_fw() : this.read_i64_bw();
	}

	public read_i64_be() {
		return reg.is_be ? this.read_i64_fw() : this.read_i64_bw();
	}

	private read_u64_fw() {
		reg.u8[0] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[3] = this.read_u8();
		reg.u8[4] = this.read_u8();
		reg.u8[5] = this.read_u8();
		reg.u8[6] = this.read_u8();
		reg.u8[7] = this.read_u8();
		return reg.u64[0];
	}

	private read_u64_bw() {
		reg.u8[7] = this.read_u8();
		reg.u8[6] = this.read_u8();
		reg.u8[5] = this.read_u8();
		reg.u8[4] = this.read_u8();
		reg.u8[3] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[0] = this.read_u8();
		return reg.u64[0];
	}

	private read_i64_fw() {
		reg.u8[0] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[3] = this.read_u8();
		reg.u8[4] = this.read_u8();
		reg.u8[5] = this.read_u8();
		reg.u8[6] = this.read_u8();
		reg.u8[7] = this.read_u8();
		return reg.i64[0];
	}

	private read_i64_bw() {
		reg.u8[7] = this.read_u8();
		reg.u8[6] = this.read_u8();
		reg.u8[5] = this.read_u8();
		reg.u8[4] = this.read_u8();
		reg.u8[3] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[0] = this.read_u8();
		return reg.i64[0];
	}



	
	// ===== 128-bit Ints =====

	public read_u128_le() {
		return reg.is_le ? this.read_u128_fw() : this.read_u128_bw();
	}

	public read_u128_be() {
		return reg.is_be ? this.read_u128_fw() : this.read_u128_bw();
	}

	public read_i128_le() {
		return reg.is_le ? this.read_i128_fw() : this.read_i128_bw();
	}

	public read_i128_be() {
		return reg.is_be ? this.read_i128_fw() : this.read_i128_bw();
	}

	private read_u128_fw() {
		reg.u8[0] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[3] = this.read_u8();
		reg.u8[4] = this.read_u8();
		reg.u8[5] = this.read_u8();
		reg.u8[6] = this.read_u8();
		reg.u8[7] = this.read_u8();
		reg.u8[8] = this.read_u8();
		reg.u8[9] = this.read_u8();
		reg.u8[10] = this.read_u8();
		reg.u8[11] = this.read_u8();
		reg.u8[12] = this.read_u8();
		reg.u8[13] = this.read_u8();
		reg.u8[14] = this.read_u8();
		reg.u8[15] = this.read_u8();
		return reg.u128[0];
	}

	private read_u128_bw() {
		reg.u8[15] = this.read_u8();
		reg.u8[14] = this.read_u8();
		reg.u8[13] = this.read_u8();
		reg.u8[12] = this.read_u8();
		reg.u8[11] = this.read_u8();
		reg.u8[10] = this.read_u8();
		reg.u8[9] = this.read_u8();
		reg.u8[8] = this.read_u8();
		reg.u8[7] = this.read_u8();
		reg.u8[6] = this.read_u8();
		reg.u8[5] = this.read_u8();
		reg.u8[4] = this.read_u8();
		reg.u8[3] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[0] = this.read_u8();
		return reg.u128[0];
	}

	private read_i128_fw() {
		reg.u8[0] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[3] = this.read_u8();
		reg.u8[4] = this.read_u8();
		reg.u8[5] = this.read_u8();
		reg.u8[6] = this.read_u8();
		reg.u8[7] = this.read_u8();
		reg.u8[8] = this.read_u8();
		reg.u8[9] = this.read_u8();
		reg.u8[10] = this.read_u8();
		reg.u8[11] = this.read_u8();
		reg.u8[12] = this.read_u8();
		reg.u8[13] = this.read_u8();
		reg.u8[14] = this.read_u8();
		reg.u8[15] = this.read_u8();
		return reg.i128[0];
	}

	private read_i128_bw() {
		reg.u8[15] = this.read_u8();
		reg.u8[14] = this.read_u8();
		reg.u8[13] = this.read_u8();
		reg.u8[12] = this.read_u8();
		reg.u8[11] = this.read_u8();
		reg.u8[10] = this.read_u8();
		reg.u8[9] = this.read_u8();
		reg.u8[8] = this.read_u8();
		reg.u8[7] = this.read_u8();
		reg.u8[6] = this.read_u8();
		reg.u8[5] = this.read_u8();
		reg.u8[4] = this.read_u8();
		reg.u8[3] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[0] = this.read_u8();
		return reg.u128[0];
	}



	
	// ===== 32-bit Binary Floats =====

	public read_f32_le() {
		return reg.is_le ? this.read_f32_fw() : this.read_f32_bw();
	}

	public read_f32_be() {
		return reg.is_be ? this.read_f32_fw() : this.read_f32_bw();
	}

	private read_f32_fw() {
		reg.u8[0] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[3] = this.read_u8();
		return reg.f32[0];
	}

	private read_f32_bw() {
		reg.u8[3] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[0] = this.read_u8();
		return reg.f32[0];
	}



	
	// ===== 64-bit Binary Floats =====

	public read_f64_le() {
		return reg.is_le ? this.read_f64_fw() : this.read_f64_bw();
	}

	public read_f64_be() {
		return reg.is_be ? this.read_f64_fw() : this.read_f64_bw();
	}

	private read_f64_fw() {
		reg.u8[0] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[3] = this.read_u8();
		reg.u8[4] = this.read_u8();
		reg.u8[5] = this.read_u8();
		reg.u8[6] = this.read_u8();
		reg.u8[7] = this.read_u8();
		return reg.f64[0];
	}

	private read_f64_bw() {
		reg.u8[7] = this.read_u8();
		reg.u8[6] = this.read_u8();
		reg.u8[5] = this.read_u8();
		reg.u8[4] = this.read_u8();
		reg.u8[3] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[0] = this.read_u8();
		return reg.f64[0];
	}



	
	// ===== 32-bit Decimal Floats =====

	public read_d32_le() {
		return reg.is_le ? this.read_d32_fw() : this.read_d32_bw();
	}

	public read_d32_be() {
		return reg.is_be ? this.read_d32_fw() : this.read_d32_bw();
	}

	private read_d32_fw() {
		reg.u8[0] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[3] = this.read_u8();
		return reg.d32[0];
	}

	private read_d32_bw() {
		reg.u8[3] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[0] = this.read_u8();
		return reg.d32[0];
	}



	
	// ===== 64-bit Decimal Floats =====

	public read_d64_le() {
		return reg.is_le ? this.read_d64_fw() : this.read_d64_bw();
	}

	public read_d64_be() {
		return reg.is_be ? this.read_d64_fw() : this.read_d64_bw();
	}

	private read_d64_fw() {
		reg.u8[0] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[3] = this.read_u8();
		reg.u8[4] = this.read_u8();
		reg.u8[5] = this.read_u8();
		reg.u8[6] = this.read_u8();
		reg.u8[7] = this.read_u8();
		return reg.d64[0];
	}

	private read_d64_bw() {
		reg.u8[7] = this.read_u8();
		reg.u8[6] = this.read_u8();
		reg.u8[5] = this.read_u8();
		reg.u8[4] = this.read_u8();
		reg.u8[3] = this.read_u8();
		reg.u8[2] = this.read_u8();
		reg.u8[1] = this.read_u8();
		reg.u8[0] = this.read_u8();
		return reg.d64[0];
	}


	
	
	// ===== Variable-Width Ints =====

	public read_varint_u_le(max_bits: number) : number {
		return Number(this.read_varint_big_u_le(max_bits));
	}

	public read_varint_u_be(max_bits: number) : number {
		return Number(this.read_varint_big_u_be(max_bits));
	}

	public read_varint_s_le(max_bits: number) : number {
		return Number(this.read_varint_big_s_le(max_bits));
	}

	public read_varint_s_be(max_bits: number) : number {
		return Number(this.read_varint_big_s_be(max_bits));
	}

	private read_varint_big_u_le(max_bits: number) : bigint {
		return BigInt.asUintN(max_bits, this.read_varint_big_le(max_bits));
	}

	private read_varint_big_u_be(max_bits: number) : bigint {
		return BigInt.asUintN(max_bits, this.read_varint_big_be(max_bits));
	}

	private read_varint_big_s_le(max_bits: number) : bigint {
		return BigInt.asIntN(max_bits, this.read_varint_big_le(max_bits));
	}

	private read_varint_big_s_be(max_bits: number) : bigint {
		return BigInt.asIntN(max_bits, this.read_varint_big_be(max_bits));
	}

	private read_varint_big_le(max_bits: number) : bigint {
		let size = 0;
		let result = 0n;

		while (true) {
			size += 7;
			const byte = this.read_u8();
			const bits = BigInt(byte & 0x7f);

			result |= bits << BigInt(size);

			if (byte & 0x80) {
				continue;
			}

			if (size >= max_bits) {
				throw new Error(`varint<${max_bits}> size exceeded`);
			}

			break;
		}

		return result;
	}

	private read_varint_big_be(max_bits: number) : bigint {
		let size = 0;
		let result = 0n;

		while (true) {
			size += 7;
			const byte = this.read_u8();
			const bits = BigInt(byte & 0x7f);

			result = (result << 7n) | bits;

			if (byte & 0x80) {
				continue;
			}

			if (size >= max_bits) {
				throw new Error(`varint<${max_bits}> size exceeded`);
			}

			break;
		}

		return result;
	}



	
	// ===== Byte Arrays =====

	public take_bytes(len: number, copy = true) : Uint8Array {
		return copy
			? this.array.slice(this.cursor, this.cursor += len)
			: this.array.subarray(this.cursor, this.cursor += len);
	}

	public take_bytes_big(len: bigint, copy = true) : Uint8Array {
		if (len > Number.MAX_SAFE_INTEGER) {
			throw new Error('Cannot support array sizes larger than Number.MAX_SAFE_INTEGER');
		}

		return this.take_bytes(Number(len), copy);
	}

	public take_bytes_null_term(copy = true) : Uint8Array {
		const start = this.cursor;
		while (this.read_u8()) /* pass */ ;
		
		return copy
			? this.array.slice(start, this.cursor - 1)
			: this.array.subarray(start, this.cursor - 1);
	}

	public take_bytes_remaining(copy = true) : Uint8Array {
		return copy
			? this.array.slice(this.cursor, this.array.length)
			: this.array.subarray(this.cursor, this.array.length);
	}



	
	// ===== ASCII Text =====

	public as_ascii(array: Uint8Array) : string {
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


	
	
	// ===== UTF-8 Text =====

	public as_utf8(array: Uint8Array) : string {
		return utf8_decode.decode(array);
	}

	// Modified from: https://rosettacode.org/wiki/UTF-8_encode_and_decode#JavaScript
	public read_utf8_null_term() : string {
		let hi_end = 0;
		let hi_mid = 0;
		let lo_mid = 0;
		let lo_end = 0;

		const chars: string[] = [ ];
		const char = (code_point: number) => chars.push(String.fromCodePoint(code_point));

		while (hi_end = this.read_u8()) {
			if (hi_end < 0x80) {
				char((hi_end & 0x7f) << 0);
				continue;
			}

			hi_mid = this.read_u8();

			if (0xc1 < hi_end && hi_end < 0xe0 && hi_mid === (hi_mid & 0xbf)) {
				char((hi_end & 0x1f) << 6 | (hi_mid & 0x3f) << 0);
				continue;
			}

			lo_mid = this.read_u8();

			if ((hi_end === 0xe0 && 0x9f < hi_mid && hi_mid < 0xc0
			  || 0xe0 < hi_end && hi_end < 0xed && 0x7f < hi_mid && hi_mid < 0xc0
			  || hi_end === 0xed && 0x7f < hi_mid && hi_mid < 0xa0
			  || 0xed < hi_end && hi_end < 0xf0 && 0x7f < hi_mid && hi_mid < 0xc0)
			  && lo_mid === (lo_mid & 0xbf))
			{
				char((hi_end & 0x0f) << 12 | (hi_mid & 0x3f) << 6 | (lo_mid & 0x3f) << 0);
				continue;
			}

			lo_end = this.read_u8();

			if ((hi_end === 0xf0 && 0x8f < hi_mid && hi_mid < 0xc0
			  || hi_end === 0xf4 && 0x7f < hi_mid && hi_mid < 0x90
			  || 0xf0 < hi_end && hi_end < 0xf4 && 0x7f < hi_mid && hi_mid < 0xc0)
			  && lo_mid === (lo_mid & 0xbf) && lo_end === (lo_end & 0xbf))
			{
				char((hi_end & 0x07) << 18 | (hi_mid & 0x3f) << 12 | (lo_mid & 0x3f) << 6 | (lo_end & 0x3f) << 0);
				continue;
			}

			throw new Error('Encountered invalid utf8 encoding');
		}

		return chars.join('');
	}



	// TODO: utf16
	
	
	// TODO: utf32

}
