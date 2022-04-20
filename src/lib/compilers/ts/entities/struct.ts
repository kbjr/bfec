
import * as lnk from '../../../linker';
import * as tmpl from '../templates';
import { CompilerState } from '../state';
import { builtins, fixed_int } from '../templates/builtin-types';
import { Enum } from './enum';
import { Switch } from './switch';
import { Interface } from '../ts-entities/interface';

export class Struct {
	constructor(
		public out_dir: string,
		public name: string,
		public node: lnk.Struct,
		public state: CompilerState
	) { }

	// public iface: Interface;
	// public class: Class;

	public params = '';
	public imports: tmpl.ImportTemplateOpts[] = [ ];
	public fields: StructField[] = this.node.fields.map((field) => new StructField(this, field));

	public get is_root() {
		return this.node.name === '$';
	}

	public get file_path() {
		return `${this.out_dir}/${this.name}`;
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

	private build_info() {
		if (this.node.params && this.node.params.length) {
			const params: string[] = [ ];

			for (const param of this.node.params) {
				const type = field_type_expr(param.param_type);
				params.push(`${param.name} extends ${type} = ${type}`);

				if (param.param_type.type === 'enum_ref') {
					const ts_enum = this.state.ts_enums.get(param.param_type.points_to);

					this.imports.push({
						from_path: this.file_path,
						source_path: ts_enum.file_path,
						type_name: ts_enum.name
					});
				}
			}

			this.params = `<${params.join(', ')}>`;
		}

	}

	public emit() {
		const generator_comment = tmpl.generator_comment_template(this.state.opts.no_generator_comment);

		this.build_info();
		this.fields.forEach((field) => {
			field.build_info();
			this.imports.push(...field.imports);
		});

		const iface = new Interface();
		iface.name = this.name;
		// iface.comments.push(this.comments);
		iface.file_path = this.file_path;

		const type_ts
			= generator_comment
			+ tmpl.struct_template({
				ts_struct: this,
				struct_iface: iface,
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

	public imports: tmpl.ImportTemplateOpts[] = [ ];
	public interface_fields: string[] = [ ];

	public get comments() {
		if (this.node.type === 'struct_expansion') {
			return '';
		}

		const comments = (this.node.comments || [ ]).map((comment) => comment.content);
		comments.push(`@bfec_type \`${field_type_expr(this.node.field_type)}\``);
		return comments.length ? tmpl.doc_comments_template(comments, '\t') : '';
	}

	public get type_param() {
		if (this.node.type === 'struct_field') {
			if (this.node.field_value.type === 'param_ref') {
				return this.node.field_value.name;
			}
		}
	}

	public build_info() {
		const { state } = this.struct;

		this.interface_fields.push(this.comments);

		if (this.node.type === 'struct_field') {
			const type = this.node.field_type;

			switch (type.type) {
				case 'enum_ref':
					// 
					break;

				case 'switch_ref': {
					const ts_switch = state.ts_switches.get(type.points_to);

					if (! ts_switch) {
						// state.error(type.refined_type.points_to, 'Encountered reference to uncollected type');
						break;
					}

					import_type(this.imports, this.struct.file_path, ts_switch);

					let params = '';

					switch (type.param.type) {
						case 'enum_member_ref': {
							const ts_enum = state.ts_enums.get(type.param.enum_ref.points_to);

							if (! ts_enum) {
								// state.error(type.param.enum_ref.points_to, 'Encountered reference to uncollected type');
								break;
							}

							params = `<${type.param.name}>`;
							import_type(this.imports, this.struct.file_path, ts_enum);
							break;
						}

						case 'local_field_ref':
							// 
							break;

						case 'global_field_ref':
							// 
							break;
					}

					this.interface_fields.push(
						`${this.node.name}: ${ts_switch.name}${params};`
					);
					break;
				}

				case 'struct_ref': {
					const ts_struct = state.ts_structs.get(type.points_to);

					if (! ts_struct) {
						// state.error(type.refined_type.points_to, 'Encountered reference to uncollected type');
						break;
					}

					import_type(this.imports, this.struct.file_path, ts_struct);

					let params = '';

					if (type.params && type.params.length) {
						const param_strings: string[] = [ ];

						for (const param of type.params) {
							switch (param.type) {
								case 'enum_member_ref': {
									const ts_enum = state.ts_enums.get(param.enum_ref.points_to);
		
									if (! ts_enum) {
										// state.error(param.enum_ref.points_to, 'Encountered reference to uncollected type');
										break;
									}

									param_strings.push(param.name);
									import_type(this.imports, this.struct.file_path, ts_enum);
									break;
								}
		
								case 'local_field_ref':
									// TODO: Can we access the type/value of the referenced field?
									break;
		
								case 'global_field_ref':
									// TODO: Can we access the type/value of the referenced field?
									break;
							}
						}

						params = `<${param_strings.join(', ')}>`;
					}

					this.interface_fields.push(
						`${this.node.name}: ${ts_struct.name}${params};`
					);
					break;
				}
				
				case 'type_refinement': {
					let refined_type: string;

					switch (type.refined_type.type) {
						case 'struct_ref': {
							const ts_struct = state.ts_structs.get(type.refined_type.points_to);

							if (! ts_struct) {
								// state.error(type.refined_type.points_to, 'Encountered reference to uncollected type');
								break;
							}

							// TODO: Params
							refined_type = ts_struct.name;
							import_type(this.imports, this.struct.file_path, ts_struct);
							break;
						}

						case 'switch_ref': {
							const ts_switch = state.ts_switches.get(type.refined_type.points_to);

							if (! ts_switch) {
								// state.error(type.refined_type.points_to, 'Encountered reference to uncollected type');
								break;
							}

							// TODO: Params
							refined_type = ts_switch.name;
							import_type(this.imports, this.struct.file_path, ts_switch);
							break;
						}

						case 'struct': {
							refined_type = 'null';
							this.interface_fields.push(
								'// TODO: generate inline struct'
							);
							break;
						}

						case 'switch': {
							refined_type = 'null';
							this.interface_fields.push(
								'// TODO: generate inline switch'
							);
							break;
						}
					}

					this.interface_fields.push(
						`${this.node.name}: $UnprocessedSlice<${refined_type}> | ${refined_type};`
					);

					break;
				}

				case 'type_array': {
					this.interface_fields.push(
						`${this.node.name}: [];`
					);
					//
					break; 
				}

				default:
					this.interface_fields.push(
						`${this.node.name}: ${builtins.field_type(type)};`
					);
			}
		}

		if (this.node.type === 'struct_expansion') {
			this.interface_fields.push(
				'// TODO: struct expansions not yet implemented',
				`// ${this.node.expanded_type.name}`
			)
		}
	}
}

function field_type_expr(type: lnk.FieldType) {
	switch (type.type) {
		case 'const_int':
		case 'const_string':
			return type.token.text;

		case 'enum_ref':
			return type.name;

		case 'type_fixed_int':
			return type.name;

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
			break;

		case 'struct_ref': {
			// TODO: Params
			return type.name;
		}
			

		// TODO: More types
	}
}

function import_type(imports: tmpl.ImportTemplateOpts[], from: string, ts_type: Enum | Switch | Struct) {
	imports.push({
		source_path: ts_type.file_path,
		from_path: from,
		type_name: ts_type.name,
	});
}
