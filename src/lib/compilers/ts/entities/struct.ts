
import * as lnk from '../../../linker';
import * as tmpl from '../templates';
import { CompilerState } from '../state';
import { builtins } from '../templates/builtin-types';

export class Struct {
	constructor(
		public out_dir: string,
		public name: string,
		public node: lnk.Struct,
		public state: CompilerState
	) { }

	public fields: StructField[] = this.node.fields.map((field) => new StructField(this, field));

	public get is_root() {
		return this.node.name === '$';
	}

	public get file_path() {
		return `${this.out_dir}/${this.name}`;
	}

	public get imports() : tmpl.ImportTemplateOpts[] {
		return [ ];
	}

	public get comments() {
		const comments = (this.node.comments || [ ]).map((comment) => comment.content);
		comments.push(`@bfec_type \`${this.node.is_byte_aligned ? 'struct' : 'bin'} ${this.node.name}\``);
		return comments.length ? tmpl.doc_comments_template(comments) : '';
	}

	public get interface_fields() : string[] {
		return this.fields.flatMap((field) => field.interface_fields);
	}

	public get encode_body() {
		return [ ];
	}

	public get decode_body() {
		return [ ];
	}

	public emit() {
		const generator_comment = tmpl.generator_comment_template(this.state.opts.no_generator_comment);

		const type_ts
			= generator_comment
			+ tmpl.struct_template({
				ts_struct: this,
				root_struct_type: this.state.root_class_name,
			});

		return this.state.opts.out_dir.write_file(`${this.file_path}.ts`, type_ts);
	}
}

export class StructField {
	constructor(
		public struct: Struct,
		public node: lnk.StructField | lnk.StructExpansion
	) { }

	public get comments() {
		if (this.node.type === 'struct_expansion') {
			return '';
		}

		const comments = (this.node.comments || [ ]).map((comment) => comment.content);
		comments.push(`@bfec_type \`${field_type_expr(this.node.field_type)}\``);
		return comments.length ? tmpl.doc_comments_template(comments, '\t') : '';
	}

	public get interface_fields() : string | string[] {
		if (this.node.type === 'struct_field') {
			switch (this.node.field_type.type) {
				case 'enum_ref':
					// 
					break;

				case 'switch_ref':
					// 
					break;

				case 'struct_ref':
					// 
					break;
				
				case 'type_refinement':
					// 
					break;

				default: return [ this.comments, `${this.node.name}: ${builtins.field_type(this.node.field_type)};` ];
			}

			return [
				this.comments,
				`${this.node.name}: undefined;`,
				'// TODO: struct fields not yet implemented',
			];
		}

		if (this.node.type === 'struct_expansion') {
			return [
				'// TODO: struct expansions not yet implemented',
				`// ${this.node.expanded_type.name}`
			];
		}
	}
}

function field_type_expr(type: lnk.FieldType) {
	switch (type.type) {
		case 'const_int':
		case 'const_string':
			return `${type.token.text}`

		case 'enum_ref':
			return `${type.name}`

		case 'type_fixed_int':
			return `${type.name}`

		case 'type_checksum':
			const checksum_real = type.real_type.type === 'type_fixed_int' ? type.real_type.name : 'never';
			return `checksum<${checksum_real}>(${type.data_field.name}, ${type.checksum_func.token.text})`

		case 'type_refinement':
			switch (type.refined_type.type) {
				case 'struct_ref':
				case 'switch_ref':
					return `${field_type_expr(type.base_type)} -> ${field_type_expr(type.refined_type)}`;

				case 'struct':
					return `${field_type_expr(type.base_type)} -> ${type.refined_type.is_byte_aligned ? 'struct' : 'bin'} { ... }`;

				case 'switch':
					return `${field_type_expr(type.base_type)} -> switch <${field_type_expr(type.refined_type.arg_type)}> (${type.refined_type.arg_value.name}) { ... }`;
			}
			

		// TODO: More types
	}
}
