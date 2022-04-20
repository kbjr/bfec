
import { TSEntity } from './entity';
import { TSTypeParam } from './type-param';

export class TSInterface extends TSEntity {
	public extends?: TSInterface;
	public type_params: TSTypeParam[] = [ ];
	public fields: TSInterfaceField[] = [ ];

	public add_field(name: string) {
		const field = new TSInterfaceField();
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

export class TSInterfaceField {
	public name: string;
	public iface: TSInterface;
	public comments: string[] = [ ];
	// public type: TSInterfaceRef

	public get decl_str() {
		// TODO: Other field types
		return `${this.name}: any;`;
	}
}

export class TSInterfaceRef {
	public iface: TSInterface;
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
