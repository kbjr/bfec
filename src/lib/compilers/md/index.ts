
import { URL } from 'url';
import { ast } from '../../parser';
import * as sch from '../../schema';
import { c_md as log } from '../../log';
import { WriteableDir } from '../../writeable-dir';

export interface MarkdownCompilerOptions {
	out_dir: WriteableDir;
	include_external?: boolean;
	include_remote?: boolean;
}

export async function compile_to_markdown(schema: sch.Schema, opts: MarkdownCompilerOptions) {
	await compile_schema(schema, opts.out_dir);
}

async function compile_schema(schema: sch.Schema, out_dir: WriteableDir) {
	const lines: string[] = [ ];
	const self_link = file_link(schema);

	lines.push('# Structs\n');

	for (const struct of schema.structs) {
		lines.push(
			`## \`${struct.name.text}\`\n`,
			`### Fields\n`
		);
		struct_field_list(struct, lines);
		lines.push(
			`> _Defined in ${self_link}_\n`
		);
	}

	// 

	const contents = lines.join('\n');
	await out_dir.write_file(file_name(schema), contents);
}

function struct_field_list(struct: sch.Struct, lines: string[]) {
	for (const field of struct.fields) {
		if (sch.is_struct_field(field)) {
			lines.push(`#### \`${field.name.text}\`\n`);
		}

		else if (sch.is_struct_expansion(field)) {
			// 
		}
	}
}

function file_name(schema: sch.Schema) {
	if (schema.source.startsWith('~/')) {
		return schema.source.slice(2) + '.md';
	}

	if (schema.source.startsWith('http://') || schema.source.startsWith('https://')) {
		const parsed = new URL(schema.source);
		return `${parsed.protocol}/${parsed.host}/${parsed.pathname.slice(1)}.md`;
	}
}

function file_link(schema: sch.Schema, hash?: string) {
	return `[${schema.source}](${file_name(schema)})${hash ? '#' + hash : ''}`;
}
