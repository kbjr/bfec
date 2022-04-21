
import { ConstString } from '../../../linker';

export type TSConstType = 'string' | 'u8_array';

export class TSConst<T extends TSConstType = TSConstType> {
	public name: string;
	public type: T;
	public value: string;

	public get decl_str() {
		return `const ${this.name} = ${this.value};`;
	}

	public get ref_str() {
		return this.name;
	}
}

export function const_from_const_str(str: ConstString) : string {
	// TODO: Something more js-safe
	return str.token.text;
}

export function const_from_const_str_as_byte_array(str: ConstString) : string {
	const line: string[] = [ ];
	const lines: string[] = [ ];

	for (let i = 0; i < str.value.length; i++) {
		line.push(`0x${str.value.charCodeAt(i).toString(16).padStart(2, '0')}`);
		
		if (line.length === 16) {
			lines.push(line.join(', '));
			line.length = 0;
		}
	}

	if (line.length) {
		lines.push(line.join(', '));
	}

	return `new Uint8Array([\n\t${lines.join('\n\t')}\n])`;
}
