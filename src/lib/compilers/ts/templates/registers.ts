
interface RegistersTemplateOpts {
	assume_le?: boolean;
	assume_be?: boolean;
	i128_shim?: boolean;
	dec_shim?: boolean;
}

export const registers_template = (tmpl: RegistersTemplateOpts) => `
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

${tmpl.assume_le ? assume_le_template() : tmpl.assume_be ? assume_be_template() : ''}

${tmpl.i128_shim ? i128_shim(tmpl.assume_be, tmpl.assume_le) : ''}

${tmpl.dec_shim ? dec_shim(tmpl.assume_be, tmpl.assume_le) : ''}

export function reset() {
	u8.fill(0);
}
`;

const assume_le_template = () => `
// (compiled with 'assume_le' flag)
if (is_be) {
	throw new Error('Big-endian byte order not supported');
}
`;

const assume_be_template = () => `
// (compiled with 'assume_be' flag)
if (is_le) {
	throw new Error('Little-endian byte order not supported');
}
`;



// ===== 128-bit Int Shim =====

const i128_shim = (assume_be: boolean, assume_le: boolean) => `
// 128-bit int shim
export const u128_max = 0n;
export const u128 = ${
	  assume_be ? u128_be_shim()
	: assume_le ? u128_le_shim()
	: `is_le ? (${u128_le_shim()}) : (${u128_be_shim()})`
};

export const i128_max = 0n;
export const i128 = ${
	  assume_be ? i128_be_shim()
	: assume_le ? i128_le_shim()
	: `is_le ? (${i128_le_shim()}) : (${i128_be_shim()})`
};
`;

const u128_le_shim = () => `{
	get [0]() {
		return BigInt.asUintN(128, u64[0] | (u64[1] << 64n));
	},
	set [0](value: bigint) {
		u64[0] = (value) & u64_max;
		u64[1] = (value >> 64n) & u64_max;
	}
}`;

const u128_be_shim = () => `{
	get [0]() {
		return BigInt.asUintN(128, u64[1] | (u64[0] << 64n));
	},
	set [0](value: bigint) {
		u64[1] = (value) & u64_max;
		u64[0] = (value >> 64n) & u64_max;
	}
}`;

const i128_le_shim = () => `{
	get [0]() {
		return BigInt.asIntN(128, u64[0] | (u64[1] << 64n));
	},
	set [0](value: bigint) {
		value = BigInt.asUintN(128, value);
		u64[0] = (value) & u64_max;
		u64[1] = (value >> 64n) & u64_max;
	}
}`;

const i128_be_shim = () => `{
	get [0]() {
		return BigInt.asIntN(128, u64[1] | (u64[0] << 64n));
	},
	set [0](value: bigint) {
		value = BigInt.asUintN(128, value);
		u64[1] = (value) & u64_max;
		u64[0] = (value >> 64n) & u64_max;
	}
}`;



// ===== 32/64-Bit Decimal Float Shim =====

const dec_shim = (assume_be: boolean, assume_le: boolean) => `
// 32/64-bit decimal float shim
export const d32_max = 0n;
export const d32 = ${
	  assume_be ? d32_be_shim()
	: assume_le ? d32_le_shim()
	: `is_le ? (${d32_le_shim()}) : (${d32_be_shim()})`
};

export const d64_max = 0n;
export const d64 = ${
	  assume_be ? d64_be_shim()
	: assume_le ? d64_le_shim()
	: `is_le ? (${d64_le_shim()}) : (${d64_be_shim()})`
};
`;

const d32_le_shim = () => `{
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
}`;

const d32_be_shim = () => `{
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
}`;

const d64_le_shim = () => `{
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
}`;

const d64_be_shim = () => `{
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
}`;
