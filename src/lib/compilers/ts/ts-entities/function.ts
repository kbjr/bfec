
import { TSEntity } from './entity';
import { TSTypeParam } from './type-param';

export class TSFunction extends TSEntity {
	public params: [ name: string, type: string ][] = [ ];
	public type_params: TSTypeParam[] = [ ];
	public return_type?: string;
	public statements: string[] = [ ];

	public get decl_ns_str() {
		return `${this.comments_str('')}\nexport function ${this.name}${this.type_param_str}(${this.param_str})${this.return_type_str} {\n\t\t${this.stmt_str}\n\t}`;
	}

	public get decl_obj_str() {
		return `${this.name}${this.type_param_str}(${this.param_str})${this.return_type_str} {\n\t\t${this.stmt_str}\n\t}`;
	}

	public get type_param_str() {
		return this.type_params.length
			? `<${this.type_params.map((param) => param.decl_str).join(', ')}>`
			: '';
	}

	public get param_str() {
		return this.params.map(([ name, type ]) => `${name}: ${type}`).join(', ');
	}

	public get return_type_str() {
		return this.return_type ? ` : ${this.return_type}` : '';
	}

	public get stmt_str() {
		return this.statements.join('\n\t\t');
	}
}
