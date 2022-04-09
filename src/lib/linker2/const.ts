
import { pos } from './pos';
import { ast } from '../parser';
import { SchemaNode } from './node';

const ascii_escape = /\\(?:\\|n|r|t|b|0|x[0-9a-fA-F]{2})/g;
const unicode_escape = /\\(?:\\|n|r|t|b|0|x[0-9a-fA-F]{2}|u\{[0-9a-fA-F]{2,5}\})/g;

export class ConstInt implements SchemaNode {
	public type = 'const_int' as const;
	public value: bigint;
	public token: ast.ConstToken_int | ast.ConstToken_hex_int;

	public get pos() {
		return pos(this.token);
	}

	public toJSON() {
		return {
			type: this.type,
			value: this.value,
		};
	}

	public static from_ast(node: ast.ConstToken_int | ast.ConstToken_hex_int) {
		const int = new ConstInt();
		int.token = node;
		int.value = BigInt(node.text);
		return int;
	}
}

export class ConstString implements SchemaNode {
	public type = 'const_string' as const;
	public value: string;
	public unicode: boolean;
	public token: ast.ConstToken_ascii | ast.ConstToken_unicode;

	public get pos() {
		return pos(this.token);
	}

	public toJSON() {
		return {
			type: this.type,
			unicode: this.unicode,
			value: this.value,
		};
	}

	public static from_ast(node: ast.ConstToken_ascii | ast.ConstToken_unicode) {
		const string = new ConstString();
		string.token = node;
		string.unicode = node.type === ast.node_type.const_unicode;
		string.value = node.text.slice(1, -1);
	
		if (string.unicode) {
			string.value = string.value.replace(unicode_escape, (match: string) : string => {
				switch (match[1]) {
					case '\\': return '\\';
					case 'n': return '\n';
					case 'r': return '\r';
					case 't': return '\t';
					case 'b': return '\b';
					case '0': return '\0';
					case 'x': {
						const byte = parseInt(match.slice(2), 16);
						return String.fromCharCode(byte);
					};
					case 'u': {
						const code_point = parseInt(match.slice(3, -1), 16);
						return String.fromCodePoint(code_point);
					};
				}
			});
		}
	
		else {
			string.value = string.value.replace(ascii_escape, (match: string) : string => {
				switch (match[1]) {
					case '\\': return '\\';
					case 'n': return '\n';
					case 'r': return '\r';
					case 't': return '\t';
					case 'b': return '\b';
					case '0': return '\0';
					case 'x': {
						const byte = parseInt(match.slice(2), 16);
						return String.fromCharCode(byte);
					};
				}
			});
		}

		return string;
	}
}