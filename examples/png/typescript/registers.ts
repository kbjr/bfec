
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T05:05:33.444Z
*/

export const u8_max  = (2 ** 8) - 1;
export const u8      = new Uint8Array(32);

export const i8_max  = (2 ** 7) - 1;
export const i8      = new Int8Array(u8.buffer);

export const u16_max = (2 ** 16) - 1;
export const u16     = new Uint16Array(u8.buffer);

export const i16_max = (2 ** 15) - 1;
export const i16     = new Int16Array(u8.buffer);

export const u32_max = (2 ** 32) - 1;
export const u32     = new Uint32Array(u8.buffer);

export const i32_max = (2 ** 31) - 1;
export const i32     = new Int32Array(u8.buffer);

export const u64_max = (2n ** 64n) - 1n;
export const u64     = new BigUint64Array(u8.buffer);

export const i64_max = (2n ** 63n) - 1n;
export const i64     = new BigInt64Array(u8.buffer);

export const f32_max = (2 - (2 ** -23)) * (2 ** 127);
export const f32     = new Float32Array(u8.buffer);

export const f64_max = Number.MAX_VALUE;
export const f64     = new Float64Array(u8.buffer);

// Endian-ness check
u8[0] = 0xab; u8[1] = 0xcd;
export const is_le = u16[0] === 0xcdab;
export const is_be = ! is_le;
u8[0] = 0x00; u8[1] = 0x00;




// 128-bit int shim
export const u128_max = 0n;
export const u128 = is_le ? ({
	get [0]() {
		return BigInt.asUintN(128, u64[0] | (u64[1] << 64n));
	},
	set [0](value: bigint) {
		u64[0] = (value) & u64_max;
		u64[1] = (value >> 64n) & u64_max;
	}
}) : ({
	get [0]() {
		return BigInt.asUintN(128, u64[1] | (u64[0] << 64n));
	},
	set [0](value: bigint) {
		u64[1] = (value) & u64_max;
		u64[0] = (value >> 64n) & u64_max;
	}
});

export const i128_max = 0n;
export const i128 = is_le ? ({
	get [0]() {
		return BigInt.asIntN(128, u64[0] | (u64[1] << 64n));
	},
	set [0](value: bigint) {
		value = BigInt.asUintN(128, value);
		u64[0] = (value) & u64_max;
		u64[1] = (value >> 64n) & u64_max;
	}
}) : ({
	get [0]() {
		return BigInt.asIntN(128, u64[1] | (u64[0] << 64n));
	},
	set [0](value: bigint) {
		value = BigInt.asUintN(128, value);
		u64[1] = (value) & u64_max;
		u64[0] = (value >> 64n) & u64_max;
	}
});



// 32/64-bit decimal float shim
export const d32_max = 0n;
export const d32 = is_le ? ({
	// TODO: d32 shim implementation
	get [0]() {
		return 0;
	},
	set [0](value: number) {
		// 
	},
	get [1]() {
		return 0;
	},
	set [1](value: number) {
		// 
	},
	get [2]() {
		return 0;
	},
	set [2](value: number) {
		// 
	},
	get [3]() {
		return 0;
	},
	set [3](value: number) {
		// 
	},
}) : ({
	// TODO: d32 shim implementation
	get [0]() {
		return 0;
	},
	set [0](value: number) {
		// 
	},
	get [1]() {
		return 0;
	},
	set [1](value: number) {
		// 
	},
	get [2]() {
		return 0;
	},
	set [2](value: number) {
		// 
	},
	get [3]() {
		return 0;
	},
	set [3](value: number) {
		// 
	},
});

export const d64_max = 0n;
export const d64 = is_le ? ({
	// TODO: d64 shim implementation
	get [0]() {
		return 0;
	},
	set [0](value: number) {
		// 
	},
	get [1]() {
		return 0;
	},
	set [1](value: number) {
		// 
	},
}) : ({
	// TODO: d64 shim implementation
	get [0]() {
		return 0;
	},
	set [0](value: number) {
		// 
	},
	get [1]() {
		return 0;
	},
	set [1](value: number) {
		// 
	},
});


export function reset() {
	u8.fill(0);
}
