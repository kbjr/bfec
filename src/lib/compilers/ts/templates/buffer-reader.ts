
export const buffer_reader_template = () => `
export class $BufferReader {
	constructor(
		public array: Uint8Array
	) { }

	public read_u8() {
		// 
	}

	public read_u16() {
		// 
	}

	public read_u16_le() {
		// 
	}

	public read_u16_be() {
		// 
	}

	// ....

	public read_var_int() {
		// 
	}

	// ....

	public read_text_ascii() {
		// 
	}

	public read_text_unicode() {
		// 
	}

	// ....


}
`;
