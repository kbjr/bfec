
import { URL } from 'url';
import { ast } from '../../parser';
import * as sch from '../../schema';
import { c_md as log } from '../../log';
import { WriteableDir } from '../../writeable-dir';

export interface MarkdownCompilerOptions {
	out_dir: WriteableDir;
	source_url?: string;
	include_external?: boolean;
	include_remote?: boolean;
}

export async function compile_to_markdown(schema: sch.Schema, opts: MarkdownCompilerOptions) {
	const processed = new Set<sch.Schema>();

	processed.add(schema);
	await compile_schema(schema, opts);

	for (const imported of schema.imports) {
		if (imported.source_schema.is_external && ! opts.include_external) {
			continue;
		}
		
		if (imported.source_schema.is_remote && ! opts.include_remote) {
			continue;
		}

		if (processed.has(imported.source_schema)) {
			continue;
		}

		processed.add(imported.source_schema);
		await compile_schema(imported.source_schema, opts);
	}
}

async function compile_schema(schema: sch.Schema, opts: MarkdownCompilerOptions) {
	log.info('Compiling schema to markdown', schema.source);

	const lines: string[] = [ ];
	const src_link = source_link(opts.source_url, schema);

	// 

	lines.push('# Structs\n');

	for (const struct of schema.structs) {
		lines.push(`## \`${struct.name.text}\`\n`);
		lines.push(`_Source: ${src_link}_\n`);
		lines.push(comments(struct.comments) + '\n');
		
		struct_field_list(struct, lines);
	}

	// 

	const contents = lines.join('\n');
	await opts.out_dir.write_file(out_file_name(schema), contents);
}

function struct_field_list(struct: sch.Struct, lines: string[]) {
	lines.push('| Field Name | Type | Comments |');
	lines.push('|------------|------|----------|');

	for (const field of struct.fields) {
		if (sch.is_struct_field(field)) {
			struct_field(field, lines);
		}

		else if (sch.is_struct_expansion(field)) {
			// TODO: step down and inline
		}
	}
}

function struct_field(field: sch.StructField, lines: string[]) {
	const name = code(field.name.text);
	const type = type_expr(field.field_type);
	lines.push(`| ${name} | ${type} | ${comments(field.comments)} |`);
}

function type_expr(expr: sch.TypeExpr | sch.Const, wrap = true) {
	if (sch.is_const_int(expr) || sch.is_const_str(expr)) {
		return code(expr.token.text, wrap);
	}

	if (sch.is_type_expr_fixed_int(expr)) {
		return code(expr.name, wrap);
	}

	if (sch.is_type_expr_varint(expr)) {
		return code(`varint<${expr.real_type.name}>`, wrap);
	}

	if (sch.is_type_expr_float(expr)) {
		return code(expr.name, wrap);
	}

	if (sch.is_type_expr_length(expr)) {
		return code(`len<${type_expr(expr.real_type, false)}>`, wrap);
	}

	if (sch.is_type_expr_text(expr)) {
		// 
		// expr.
	}

	if (sch.is_type_expr_array(expr)) {
		// 
	}

	return '[foo](./bar)';

	// ...

	// 
	return '(unknown)';
}

function code(content: string, wrap = true) {
	const quote = wrap ? '`' : '';
	return quote + content + quote;
}

function source_link(base_url: string, schema: sch.Schema) {
	if (schema.source.startsWith('~/')) {
		if (base_url == null) {
			return schema.source;
		}

		return `[${schema.source}](${base_url}${schema.source.slice(2)})`;
	}

	if (schema.source.startsWith('http://') || schema.source.startsWith('https://')) {
		return `[${schema.source}](${schema.source})`;
	}
}

function out_file_name(schema: sch.Schema) {
	if (schema.source.startsWith('~/')) {
		return schema.source.slice(2) + '.md';
	}

	if (schema.source.startsWith('http://') || schema.source.startsWith('https://')) {
		const parsed = new URL(schema.source);
		return `$remote/${parsed.protocol}/${parsed.host}/${parsed.pathname.slice(1)}.md`;
	}
}

function imported_ref(ref: sch.ImportedRef) {
	const name = (ref.source_token || ref.local_token).text;
	const file = out_file_name(ref.from.source_schema);
	return `[${name}](${file}#${name})`;
}

function comments(nodes: sch.Comment[]) {
	return nodes.map(process).join(' ');
	function process(comment: sch.Comment) {
		let text = comment.text;

		if (text.startsWith('#--')) {
			text = text.slice(3, -3).trim();
		}

		else {
			text = text.slice(1).trim();
		}

		return text;
	}
}
