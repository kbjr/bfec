
import { URL } from 'url';
import * as lnk from '../../linker2';
import { c_md as log } from '../../log';
import { WriteableDir } from '../../writeable-dir';

export interface MarkdownCompilerOptions {
	out_dir: WriteableDir;
	source_url?: string;
	include_external?: boolean;
	include_remote?: boolean;
	no_generator_comment?: boolean;
}

export async function compile_to_markdown(schema: lnk.Schema, opts: MarkdownCompilerOptions) {
	const processed = new Set<lnk.Schema>();

	processed.add(schema);
	await compile_schema(schema, opts);

	for (const imported of schema.imports) {
		if (imported.schema.is_external && ! opts.include_external) {
			continue;
		}
		
		if (imported.schema.is_remote && ! opts.include_remote) {
			continue;
		}

		if (processed.has(imported.schema)) {
			continue;
		}

		processed.add(imported.schema);
		await compile_schema(imported.schema, opts);
	}
}

async function compile_schema(schema: lnk.Schema, opts: MarkdownCompilerOptions) {
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
		lines.push(`## ${struct.name}\n`);
		lines.push(`**Struct** (${struct.is_byte_aligned ? 'Byte Aligned' : 'Packed'})\n`);
		lines.push(`_Source: ${src_link(line_number(struct))}_\n`);
		lines.push(comments(struct.comments) + '\n');
		struct_param_list(struct, lines);
		struct_field_list(struct, lines);
	}

	for (const switch_node of schema.switches) {
		lines.push(`## ${switch_node.name}\n`);
		lines.push('**Switch**\n');
		lines.push(`**Type:** ${enum_ref(switch_node.arg_type)}\n`);
		lines.push(`_Source: ${src_link(line_number(switch_node))}_\n`);
		lines.push(comments(switch_node.comments) + '\n');
		switch_case_list(switch_node, lines);
	}

	for (const enum_node of schema.enums) {
		lines.push(`## ${enum_node.name}\n`);
		lines.push('**Enum**\n');
		lines.push(`**Type:** ${type_expr(enum_node.member_type)}\n`);
		lines.push(`_Source: ${src_link(line_number(enum_node))}_\n`);
		lines.push(comments(enum_node.comments) + '\n');
		enum_member_list(enum_node, lines);
	}

	const contents = lines.join('\n');
	await opts.out_dir.write_file(out_file_name(schema), contents);
}

function struct_param_list(struct: lnk.Struct, lines: string[]) {
	if (! struct.params || ! struct.params.length) {
		return;
	}

	lines.push('### Params\n');
	lines.push('| Param Name | Type | Field(s) |');
	lines.push('|------------|------|----------|');

	for (const param of struct.params) {
		const name = code(param.name);
		const type = type_expr(param.param_type);
		const fields = struct.fields
			.filter((field) : field is lnk.StructField => {
				if (field.type === 'struct_field' && field.field_value) {
					return field.field_value.type === 'param_ref' && field.field_value.name === param.name;
				}

				return false;
			})
			.map((field) => {
				return code(field.name);
			});

		lines.push(`| ${name} | ${type} | ${fields.join(', ')} |`);
	}

	lines.push('');
}

function struct_field_list(struct: lnk.Struct, lines: string[]) {
	lines.push('### Fields\n');
	let line1 = '| Field Name | Type |';
	let line2 = '|------------|------|';

	let has_comments = false;
	let has_conditions = false;

	for (const field of struct.fields) {
		// TODO: Check nested/inline structs
		// TODO: Check expansions
		if (field.type === 'struct_field') {
			if (field.comments.length) {
				has_comments = true;
			}

			// TODO: Conditions
			// if (field.condition) {
			// 	has_conditions = true;
			// }
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
		if (field.type === 'struct_field') {
			struct_field(field, lines, has_comments, has_conditions, '');
		}

		else if (field.type === 'struct_expansion') {
			// TODO: step down and inline
			lines.push(`| (todo: struct expansion) | ${type_expr(field.expanded_type)} | |`);
		}
	}

	lines.push('');
}

function struct_field(field: lnk.StructField, lines: string[], has_comments: boolean, has_conditions: boolean, name_prefix = '') {
	const name = code(name_prefix + field.name);
	const type = type_expr(field.field_type);
	let line = `| ${name} | ${type} |`;

	if (has_comments) {
		line += ` ${comments(field.comments)} |`;
	}

	if (has_conditions) {
		line += ` ${field.condition ? bool_expr(field.condition) : ''} |`;
	}

	lines.push(line);

	if (field.field_type.type === 'type_refinement') {
		let struct: lnk.Struct;
		const refined = field.field_type.refined_type;

		if (refined.type === 'struct_ref') {
			struct = refined.points_to;
		}

		else if (refined.type === 'struct') {
			struct = refined;
		}

		if (struct) {
			for (const sub_field of struct.fields) {
				if (sub_field.type === 'struct_field') {
					struct_field(sub_field, lines, has_comments, has_conditions, `${name_prefix}${field.name}.`);
				}
		
				else if (sub_field.type === 'struct_expansion') {
					// TODO: step down and inline
					lines.push(`| (todo: struct expansion) | ${type_expr(sub_field.expanded_type)} | |`)
				}
			}
		}
	}
}

function switch_case_list(switch_node: lnk.Switch, lines: string[]) {
	lines.push('### Members\n');
	let line1 = '| Case | Value |';
	let line2 = '|------|-------|';

	let has_comments = false;

	for (const case_node of switch_node.cases) {
		if (case_node.comments.length) {
			has_comments = true;
		}
	}

	if (switch_node.default && switch_node.default.comments.length) {
		has_comments = true;
	}

	if (has_comments) {
		line1 += ' Comments |';
		line2 += '----------|';
	}

	lines.push(line1);
	lines.push(line2);

	for (const case_node of switch_node.cases) {
		const name = code(case_node.case_value.name);
		const value = switch_value(case_node);
		let line = `| ${name} | ${value} |`;

		if (has_comments) {
			line += ` ${comments(case_node.comments)} |`;
		}

		lines.push(line);
	}
	
	if (switch_node.default) {
		const case_node = switch_node.default;
		const value = switch_value(case_node);
		let line = `| **default** | ${value} |`;

		if (has_comments) {
			line += ` ${comments(case_node.comments)} |`;
		}

		lines.push(line);
	}
}

function switch_value(case_node: lnk.SwitchCase | lnk.SwitchDefault) {
	if (case_node.is_void) {
		return '<code><b>void</b></code>';
	}

	if (case_node.is_invalid) {
		return '<code><b>invalid</b></code>';
	}

	const type = case_node.type === 'switch_case' ? case_node.case_type : case_node.default_type;
	return type_expr(type);
}

function enum_member_list(enum_node: lnk.Enum, lines: string[]) {
	lines.push('### Members\n');
	let line1 = '| Name | Value |';
	let line2 = '|------|-------|';

	let has_comments = false;

	for (const member of enum_node.members) {
		if (member.comments.length) {
			has_comments = true;
		}
	}

	if (has_comments) {
		line1 += ' Comments |';
		line2 += '----------|';
	}

	lines.push(line1);
	lines.push(line2);

	for (const member of enum_node.members) {
		const name = code(member.name);
		const value = code(String(member.value.value));
		let line = `| ${name} | ${value} |`;

		if (has_comments) {
			line += ` ${comments(member.comments)} |`;
		}

		lines.push(line);
	}
}

function enum_ref(ref: lnk.EnumRef) {
	let url = '#';

	if (ref.imported) {
		url = out_file_name(ref.imported.from.schema) + '#' + ref.imported.source_name.toLowerCase();
	}

	else {
		url = '#' + ref.name.toLowerCase();
	}

	return code(`<a href="${url}">${ref.name}</a>`);
}

type Const = lnk.ConstInt | lnk.ConstString;

function const_value(expr: Const, wrap = true) {
	return code(expr.token.text, wrap);
}

type TypeExpr = lnk.BuiltinType | lnk.StructRef | lnk.SwitchRef | lnk.EnumRef | lnk.TypeRefinement | Const;

function type_expr(expr: TypeExpr, wrap = true) {
	switch (expr.type) {
		case 'const_int':
		case 'const_string':
			return const_value(expr, wrap);

		case 'type_fixed_int':
			return code(expr.name, wrap);

		case 'type_var_int':
			return code(`varint<${expr.real_type.name}>`, wrap);

		case 'type_float':
			return code(expr.name, wrap);

		case 'type_len':
			return code(`len<${type_expr(expr.real_type, false)}>`, wrap);

		case 'type_text':
			return code(`${expr.name}<${length(expr.length)}>`, wrap);

		case 'type_array':
			return code(`${type_expr(expr.elem_type, false)}[${length(expr.length)}]`, wrap);

		case 'type_checksum': {
			const real_type = type_expr(expr.real_type, false);
			const func_name = expr.checksum_func.token.text;
			const data_expr = value_expr(expr.data_field);
			return code(`checksum<${real_type}>(${data_expr}, ${func_name})`, wrap);
		}

		case 'enum_ref': {
			const url = expr.imported
				? out_file_name(expr.imported.from.schema) + '#' + expr.name.toLowerCase()
				: '#' + expr.name.toLowerCase();

			return code(`<a href="${url}">${expr.name}</a>`, wrap);
		}

		case 'struct_ref': {
			const url = expr.imported
				? out_file_name(expr.imported.from.schema) + '#' + expr.name.toLowerCase()
				: '#' + expr.name.toLowerCase();

			let params = '';
	
			if (expr.params && expr.params.length) {
				params = `(${expr.params.map(value_expr).join(', ')})`;
			}
		
			return code(`<a href="${url}">${expr.name}${params}</a>`, wrap);
		}
			
		case 'switch_ref': {
			const url = expr.imported
				? out_file_name(expr.imported.from.schema) + '#' + expr.name.toLowerCase()
				: '#' + expr.name.toLowerCase();

			// return code(`<a href="${url}">${expr.name}(${value_expr(expr.param)})</a>`, wrap);
			return code(`<a href="${url}">${expr.name}(todo: switch param)</a>`, wrap);
		}

		case 'type_refinement': {
			const base_type = type_expr(expr.base_type, false);
			
			switch (expr.refined_type.type) {
				case 'struct_ref':
				case 'switch_ref':
					const refined_type = type_expr(expr.refined_type, false);
					return code(`${base_type} -> ${refined_type}`, wrap);

				case 'struct':
					const struct_kw = expr.refined_type.is_byte_aligned ? 'struct' : 'bin';
					return code(`${base_type} -> ${struct_kw} { ... }`, wrap);

				case 'switch':
					const param_type = type_expr(expr.refined_type.arg_type, false);
					const param_expr = value_expr(expr.refined_type.arg_value);
					return code(`${base_type} -> switch <${param_type}> (${param_expr})`, wrap);
			}
		}

		default:
			return code('(unknown)', wrap);
	}
}

function length(expr: lnk.Length) {
	switch (expr.length_type) {
		case 'null_terminated':
			return 'null';

		case 'take_remaining':
			return '...';

		case 'static_length':
			return expr.value.value;
			
		case 'length_prefix':
			return type_expr(expr.prefix_type, false);
			
		case 'length_field':
			// return value_expr(expr.field);
            return '(todo: length field)';
	}
}

function value_expr(expr: lnk.StructFieldRef | lnk.EnumMemberRef | lnk.ParamRef | Const) {
	switch (expr.type) {
		case 'const_int':
		case 'const_string':
			return const_value(expr, false);

		case 'local_field_ref':
		case 'global_field_ref':
		case 'param_ref':
			return expr.name;

		case 'enum_member_ref':
			if (! expr.enum_ref) {
				return expr.name;
			}

			let url = '#';

			const enum_name = expr.points_to.parent.name;
			const member_name = expr.name;

			if (expr.enum_ref.imported) {
				url = out_file_name(expr.enum_ref.imported.from.schema) + '#' + enum_name.toLowerCase();
			}
		
			else {
				url = '#' + enum_name.toLowerCase();
			}
		
			return `<a href="${url}">${enum_name}</a>.${member_name}`;
	}
}

function bool_expr(expr: lnk.BoolExpr) {
	switch (expr.operator) {
		case 'not':
			return `! ${bool_expr(expr.operand)}`;
			
		case 'and':
			return `${bool_expr(expr.lh_operand)} & ${bool_expr(expr.rh_operand)}`;
			
		case 'or':
			return `${bool_expr(expr.lh_operand)} | ${bool_expr(expr.rh_operand)}`;
			
		case 'xor':
			return `${bool_expr(expr.lh_operand)} ^ ${bool_expr(expr.rh_operand)}`;
			
		case 'eq':
			return `${value_expr(expr.lh_operand)} == ${value_expr(expr.rh_operand)}`;
			
		case 'neq':
			return `${value_expr(expr.lh_operand)} != ${value_expr(expr.rh_operand)}`;

		default:
			return '(unknown)';
	}
}

function code(content: string, wrap = true) {
	if (! wrap) {
		return content;
	}

	return `<code>${content}</code>`;
}

function source_link(base_url: string, schema: lnk.Schema) {
	return function(line_suffix?: string) {
		const source = schema.source.source;

		if (source.startsWith('~/')) {
			if (base_url == null) {
				return source + line_suffix;
			}
	
			return `[${source}${line_suffix}](${base_url}${source.slice(2)}${line_suffix})`;
		}
	
		if (source.startsWith('http://') || source.startsWith('https://')) {
			return `[${source}${line_suffix}](${source}${line_suffix})`;
		}
	};
}

function line_number(node: lnk.SchemaNode) {
	return `#L${node.pos.start.line}`;
}

function out_file_name(schema: lnk.Schema) {
	if (schema.source.source.startsWith('~/')) {
		return schema.source.source.slice(2) + '.md';
	}

	if (schema.source.source.startsWith('http://') || schema.source.source.startsWith('https://')) {
		const parsed = new URL(schema.source.source);
		return `$remote/${parsed.protocol}/${parsed.host}/${parsed.pathname.slice(1)}.md`;
	}
}

function comments(nodes: lnk.Comment[]) {
	return nodes.map(process).join(' ');
	function process(comment: lnk.Comment) {
		return comment.content.trim();
	}
}
