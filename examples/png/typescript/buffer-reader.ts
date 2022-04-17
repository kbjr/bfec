
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-17T04:06:19.177Z
*/

import * as reg from './registers';

export class $BufferReader {
	constructor(
		public array: Uint8Array
	) { }
	
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


	
	// TODO: utf8


	// TODO: utf16
	
	
	// TODO: utf32

}
