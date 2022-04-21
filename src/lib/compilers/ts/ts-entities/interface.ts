
import * as lnk from '../../../linker';
import { builtins } from './builtins';
import { TSEntity } from './entity';
import { TSEnumRef } from './enum-module';
import { TSTypeParam } from './type-param';
import { TSSwitchRef } from './switch-module';
import { TSStructRef } from './struct-module';
import { field_type } from './types';

export class TSInterface extends TSEntity {
	public extends: string;
	public type_params: TSTypeParam[] = [ ];
	public fields: TSInterfaceField[] = [ ];

	public add_field(bfec_field: lnk.StructField) {
		const field = new TSInterfaceField();
		field.name = bfec_field.name;
		field.iface = this;
		field.comments = bfec_field.comments.map((comment) => comment.content);

		if (bfec_field.has_field_value) {
			// 
		}

		field.type = field_type(this.module.state, bfec_field.field_type, this.module);
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
	public type: TSStructRef | TSSwitchRef | TSEnumRef | builtins.Builtin | string;

	public get decl_str() {
		if (this.type instanceof TSStructRef) {
			return `${this.name}: ${this.type.ts_struct.name}`;
		}

		else if (this.type instanceof TSSwitchRef) {
			return `${this.name}: ${this.type.ts_switch.name}`;
		}

		else if (this.type instanceof TSEnumRef) {
			return `${this.name}: ${this.type.ts_enum.name}`;
		}

		else if (! this.type) {
			return `${this.name}: unknown;`;
		}

		else if (typeof this.type === 'string') {
			return `${this.name}: ${this.type};`
		}

		else {
			return `${this.name}: ${builtins.field_type(this.iface.module.state, this.type)};`;
		}
	}
}
