
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
	log.verbose('Compiling schema to markdown', schema.source);

	const lines: string[] = [ ];
	const src_link = source_link(opts.source_url, schema);

	// 

	lines.push('## Structs\n');

	for (const struct of schema.structs) {
		lines.push(`### ${struct.name.text}\n`);
		lines.push(`_Source: ${src_link(line_number(schema, struct))}_\n`);
		lines.push(comments(struct.comments) + '\n');
		struct_param_list(struct, lines);
		struct_field_list(struct, lines);
	}

	// 

	const contents = lines.join('\n');
	await opts.out_dir.write_file(out_file_name(schema), contents);
}

function struct_param_list(struct: sch.Struct, lines: string[]) {
	if (! struct.params || ! struct.params.length) {
		return;
	}

	lines.push('#### Params\n');
	lines.push('| Field Name | Type |');
	lines.push('|------------|------|');

	for (const param of struct.params) {
		const name = code(param.name.text);
		const type = type_expr(param.param_type);
		lines.push(`| ${name} | ${type} |`);
	}
}

function struct_field_list(struct: sch.Struct, lines: string[]) {
	lines.push('#### Fields\n');
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
		switch (expr.length_type) {
			case sch.len_type.null_terminated:
				return code(`${expr.encoding}<null>`, wrap);

			case sch.len_type.take_remaining:
				return code(`${expr.encoding}<...>`, wrap);

			case sch.len_type.static_length:
				return code(`${expr.encoding}<${expr.static_length.value}>`, wrap);
				
			case sch.len_type.length_prefix:
				return code(`${expr.encoding}<${type_expr(expr.length_prefix, false)}>`, wrap);
				
			case sch.len_type.length_field:
				return code(`${expr.encoding}<(todo: length field)>`, wrap);
				// return code(`${expr.encoding}<${expr.length_field}>`, wrap);
		}
	}

	if (sch.is_type_expr_array(expr)) {
		const elem_type = type_expr(expr.element_type, false);
		switch (expr.length_type) {
			case sch.len_type.null_terminated:
				return code(`${elem_type}[null]`, wrap);

			case sch.len_type.take_remaining:
				return code(`${elem_type}[...]`, wrap);

			case sch.len_type.static_length:
				return code(`${elem_type}[${expr.static_length.value}]`, wrap);
				
			case sch.len_type.length_prefix:
				return code(`${elem_type}[${type_expr(expr.length_prefix, false)}]`, wrap);
				
			case sch.len_type.length_field:
				return code(`${elem_type}[(todo: length field)]`, wrap);
				// return code(`${expr.encoding}<${expr.length_field}>`, wrap);
		}
	}

	if (sch.is_type_expr_checksum(expr)) {
		// TODO:
		return code('checksum', wrap);
	}

	if (sch.is_type_expr_named(expr)) {
		let url = '#';
		const name = expr.name.name;
		const refed = expr.name.points_to;

		// if (expr.params && expr.params.length) {
		// 	// TODO:
		// 	`<code><a href=""></a></code>`
		// 	return '';
		// }

		if (sch.is_imported_ref(refed)) {
			url = out_file_name(refed.from.source_schema) + '#' + name;
		}

		else if (sch.is_struct(refed) || sch.is_enum(refed) || sch.is_switch(refed)) {
			url = out_file_name(refed.parent_schema) + '#' + name;
		}

		return code(`<a href="${url}">${expr.name.name}</a>`, wrap);
	}

	if (sch.is_type_expr_named_refine(expr)) {
		const parent_type = type_expr(expr.parent_type, false);
		const refined_type = type_expr(expr.refined_type, false);
		return code(`${parent_type} -> ${refined_type}`, wrap);
	}

	if (sch.is_type_expr_struct_refine(expr)) {
		// 
	}

	if (sch.is_type_expr_switch_refine(expr)) {
		// 
	}

	return code('(unknown)', wrap);
}

function code(content: string, wrap = true) {
	if (! wrap) {
		return content;
	}

	return `<code>${content}</code>`;
}

function source_link(base_url: string, schema: sch.Schema) {
	return function(line_suffix?: string) {
		if (schema.source.startsWith('~/')) {
			if (base_url == null) {
				return schema.source + line_suffix;
			}
	
			return `[${schema.source}${line_suffix}](${base_url}${schema.source.slice(2)}${line_suffix})`;
		}
	
		if (schema.source.startsWith('http://') || schema.source.startsWith('https://')) {
			return `[${schema.source}${line_suffix}](${schema.source}${line_suffix})`;
		}
	};
}

function line_number(schema: sch.Schema, node: sch.SchemaNode) {
	if (! schema.include_source_maps) {
		return '';
	}

	const ast_node = schema.source_map.get(node);

	if (! ast_node) {
		return '';
	}

	return `#L${ast_node.pos()[0]}`;
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
