
import { URL } from 'url';
import * as sch from '../../schema';
import { c_md as log } from '../../log';
import { WriteableDir } from '../../writeable-dir';

export interface MarkdownCompilerOptions {
	out_dir: WriteableDir;
	source_url?: string;
	include_external?: boolean;
	include_remote?: boolean;
	no_generator_comment?: boolean;
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

	const lines: string[] = opts.no_generator_comment ? [ ] : [
		'',
		'<!--',
		' THIS FILE WAS AUTOMATICALLY GENERATED',
		` ${(new Date).toISOString()}`,
		'-->',
		''
	];

	const src_link = source_link(opts.source_url, schema);

	for (const struct of schema.structs) {
		lines.push(`## ${struct.name.text}\n`);
		lines.push(`**Struct** (${struct.byte_aligned ? 'Byte Aligned' : 'Packed'})\n`);
		lines.push(`_Source: ${src_link(line_number(schema, struct))}_\n`);
		lines.push(comments(struct.comments) + '\n');
		struct_param_list(struct, lines);
		struct_field_list(struct, lines);
	}

	for (const switch_node of schema.switches) {
		lines.push(`## ${switch_node.name.text}\n`);
		lines.push('**Switch**\n');
		lines.push(`**Type:** ${enum_ref(switch_node.arg_type)}\n`);
		lines.push(`_Source: ${src_link(line_number(schema, switch_node))}_\n`);
		lines.push(comments(switch_node.comments) + '\n');
		// TODO: Cases / Default
	}

	for (const enum_node of schema.enums) {
		lines.push(`## ${enum_node.name.text}\n`);
		lines.push('**Enum**\n');
		lines.push(`**Type:** ${type_expr(enum_node.member_type)}\n`);
		lines.push(`_Source: ${src_link(line_number(schema, enum_node))}_\n`);
		lines.push(comments(enum_node.comments) + '\n');
		// TODO: Members
	}

	const contents = lines.join('\n');
	await opts.out_dir.write_file(out_file_name(schema), contents);
}

function struct_param_list(struct: sch.Struct, lines: string[]) {
	if (! struct.params || ! struct.params.length) {
		return;
	}

	lines.push('### Params\n');
	lines.push('| Param Name | Type | Field(s) |');
	lines.push('|------------|------|----------|');

	for (const param of struct.params) {
		const name = code(param.name.text);
		const type = type_expr(param.param_type);
		const fields = struct.fields
			.filter((field) : field is sch.StructField => {
				if (sch.is_struct_field(field) && field.field_value) {
					return field.field_value.name === param.name.text;
				}

				return false;
			})
			.map((field) => {
				return code(field.name.text);
			});

		lines.push(`| ${name} | ${type} | ${fields.join(', ')} |`);
	}

	lines.push('');
}

function struct_field_list(struct: sch.Struct, lines: string[]) {
	lines.push('### Fields\n');
	let line1 = '| Field Name | Type |';
	let line2 = '|------------|------|';

	let has_comments = false;
	let has_conditions = false;

	for (const field of struct.fields) {
		// TODO: Check nested/inline structs
		// TODO: Check expansions
		if (sch.is_struct_field(field)) {
			if (field.comments.length) {
				has_comments = true;
			}

			if (field.condition) {
				has_conditions = true;
			}
		}
	}

	if (has_comments) {
		line1 += ' Comments |';
		line2 += '----------|';
	}

	if (has_conditions) {
		line1 += ' Condition |';
		line2 += '-----------|';
	}

	lines.push(line1);
	lines.push(line2);

	for (const field of struct.fields) {
		if (sch.is_struct_field(field)) {
			struct_field(field, lines, has_comments, has_conditions, '');
		}

		else if (sch.is_struct_expansion(field)) {
			// TODO: step down and inline
			lines.push(`| (todo: struct expansion) | ${type_expr(field.expanded_type)} | |`)
		}
	}

	lines.push('');
}

function struct_field(field: sch.StructField, lines: string[], has_comments: boolean, has_conditions: boolean, name_prefix = '') {
	const name = code(name_prefix + field.name.text);
	const type = type_expr(field.field_type);
	let line = `| ${name} | ${type} |`;

	if (has_comments) {
		line += ` ${comments(field.comments)} |`;
	}

	if (has_conditions) {
		line += ` ${field.condition ? bool_expr(field.condition) : ''} |`;
	}

	lines.push(line);

	if (sch.is_type_expr_struct_refine(field.field_type)) {
		const struct = field.field_type.refined_type;

		for (const sub_field of struct.fields) {
			if (sch.is_struct_field(sub_field)) {
				struct_field(sub_field, lines, has_comments, has_conditions, `${name_prefix}${field.name.text}.`);
			}
	
			else if (sch.is_struct_expansion(sub_field)) {
				// TODO: step down and inline
				lines.push(`| (todo: struct expansion) | ${type_expr(sub_field.expanded_type)} | |`)
			}
		}
		// 
	}
}

function enum_ref(ref: sch.NamedRef<sch.Enum>) {
	const name = ref.name;
	const refed = ref.points_to;
	
	let url = '#';

	if (sch.is_imported_ref(refed)) {
		url = out_file_name(refed.from.source_schema) + '#' + name;
	}

	else if (sch.is_enum(refed)) {
		url = '#' + name.toLowerCase();
	}

	return code(`<a href="${url}">${name}</a>`);
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
		const real_type = type_expr(expr.real_type, false);
		const func_name = expr.func_name.token.text;
		// TODO:
		const data_expr = '(todo: value expr)';
		return code(`checksum<${real_type}>(${data_expr}, ${func_name})`, wrap);
	}

	if (sch.is_type_expr_named(expr)) {
		const name = expr.name.name;
		const refed = expr.name.points_to;
		
		if (expr.params && expr.params.length) {
			// TODO:
		}
		
		let url = '#';

		if (sch.is_imported_ref(refed)) {
			url = out_file_name(refed.from.source_schema) + '#' + name;
		}

		else if (sch.is_struct(refed) || sch.is_enum(refed) || sch.is_switch(refed)) {
			url = '#' + name.toLowerCase();
		}

		return code(`<a href="${url}">${expr.name.name}</a>`, wrap);
	}

	if (sch.is_type_expr_named_refine(expr)) {
		const parent_type = type_expr(expr.parent_type, false);
		const refined_type = type_expr(expr.refined_type, false);
		return code(`${parent_type} -> ${refined_type}`, wrap);
	}

	if (sch.is_type_expr_struct_refine(expr)) {
		const parent_type = type_expr(expr.parent_type, false);
		const struct_kw = expr.refined_type.byte_aligned ? 'struct' : 'bin';
		return code(`${parent_type} -> ${struct_kw} { ... }`, wrap);
	}

	if (sch.is_type_expr_switch_refine(expr)) {
		const parent_type = type_expr(expr.parent_type, false);
		const param_type = type_expr(expr.refined_type.arg_type, false);
		// TODO:
		// expr.param_expr
		return code(`${parent_type} -> switch <${param_type}> ((todo: param expr))`, wrap);
	}

	return code('(unknown)', wrap);
}

function value_expr() {
	// TODO:
	return '(todo: value expr)';
}

function bool_expr(expr: sch.BoolExpr) {
	// TODO:
	return '(todo: bool expr)';
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
