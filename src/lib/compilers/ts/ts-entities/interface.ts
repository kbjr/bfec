
import * as lnk from '../../../linker';
import { builtins } from './builtins';
import { TSEntity } from './entity';
import { TSEnumRef } from './enum-module';
import { TSTypeParam } from './type-param';
import { TSSwitchRef } from './switch-module';
import { TSStructField, TSStructRef } from './struct-module';
import { create_ts_field_type } from './types';

export class TSInterface extends TSEntity {
	public extends: string;
	public type_params: TSTypeParam[] = [ ];
	public fields: TSInterfaceField[] = [ ];

	public add_field(struct_field: TSStructField) {
		const field = new TSInterfaceField();
		field.name = struct_field.name;
		field.iface = this;
		field.comments = struct_field.bfec_field.comments.map((comment) => comment.content);

		if (struct_field.bfec_field.has_field_value) {
			// 
		}

		field.type = struct_field;
		this.fields.push(field);
		return field;
	}

	public ref_str(params: string[]) {
		return params.length ? `${this.name}<${params.join(', ')}>` : this.name;
	}

	public get decl_str() {
		const extend = this.extends ? ` extends ${this.extends}` : '';
		return `${this.comments_str('')}\nexport interface ${this.name}${this.decl_type_params_str}${extend} {\n\t${this.decl_fields_str}\n}`;
	}

	private get decl_type_params_str() {
		if (! this.type_params.length) {
			return '';
		}

		return `<${this.type_params.map((param) => param.decl_str).join(', ')}>`;
	}

	private get decl_fields_str() {
		return this.fields.map((field) => field.decl_str).join('\n\t');
	}
}

export class TSInterfaceField {
	public name: string;
	public iface: TSInterface;
	public comments: string[] = [ ];
	public type: TSStructField;

	public get field_type() {
		return typeof this.type.field_type === 'string' ? this.type.field_type : this.type.field_type.field_type();
	}

	public get decl_str() {
		return `${this.name}: ${this.field_type};`;
	}
}
