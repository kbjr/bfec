
import { TSEntity } from './entity';

export class TSTypeBranchAlias extends TSEntity {
	public type: string;
	public cases: [ sub_type: string, result_type: string ][];
	public default_type: string;

	public get decl_str() {
		return `${this.comments_str('')}\nexport type ${this.name}<$T extends ${this.type} = ${this.type}>\n\t= ${this.cases_str}\n\t: ${this.default_type}\n\t;`;
	}

	private get cases_str() {
		return this.cases.map(([ sub_type, result_type ]) => `$T extends ${sub_type} ? ${result_type}`).join('\n\t: ');
	}
}
