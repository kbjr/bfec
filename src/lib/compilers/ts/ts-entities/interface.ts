
import * as tmpl from '../templates';
import { TSEntity } from './entity';
import { TypeParam } from './type-param';

export class Interface extends TSEntity {
	public extends?: Interface;
	public type_params: TypeParam[] = [ ];
	public fields: InterfaceField[] = [ ];

	public add_field(name: string) {
		const field = new InterfaceField();
		field.name = name;
		field.iface = this;
		this.fields.push(field);
		return field;
	}

	public ref_str(params: string[]) {
		return params.length ? `${this.name}<${params.join(', ')}>` : this.name;
	}

	public get decl_str() {
		const extend = this.extends ? ` extends ${this.extends.name}` : '';
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

export class InterfaceField {
	public name: string;
	public iface: Interface;
	public comments: string[] = [ ];
	public type: InterfaceRef

	public get decl_str() {
		// TODO: Other field types
		return `${this.name}: any;`;
	}
}

export class InterfaceRef {
	public iface: Interface;
	public params: string[] = [ ];

	public get ref_str() {
		return `${this.iface.name}${this.params_str}`;
	}

	private get params_str() {
		if (! this.params.length) {
			return '';
		}

		return `<${this.params.join(', ')}>`;
	}
}
