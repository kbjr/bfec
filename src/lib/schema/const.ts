
import { ast } from '../parser';
import { SchemaNode } from './node';
	
const ascii_escape = /\\(?:\\|n|r|t|b|0|x[0-9a-fA-F]{2})/g;
const unicode_escape = /\\(?:\\|n|r|t|b|0|x[0-9a-fA-F]{2}|u\{[0-9a-fA-F]{2,5}\})/g;

export class Const extends SchemaNode {
	public type = 'const';
}

export class ConstInt extends Const {
	public const_type = 'int';
	public value: bigint;

	public static from_ast(node: ast.ConstToken_int | ast.ConstToken_hex_int) {
		const int = new ConstInt();
		int.value = BigInt(node.text);
		return int;
	}
}

export class ConstString extends Const {
	public const_type = 'string';
	public value: string;
	public unicode: boolean;

	public static from_ast(node: ast.ConstToken_ascii | ast.ConstToken_unicode) {
		const string = new ConstString();
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

export function is_const(node: SchemaNode) : node is Const {
	return is_const_int(node) || is_const_str(node);
}

export function is_const_int(node: SchemaNode) : node is ConstInt {
	return node instanceof ConstInt;
}

export function is_const_str(node: SchemaNode) : node is ConstString {
	return node instanceof ConstString;
}
