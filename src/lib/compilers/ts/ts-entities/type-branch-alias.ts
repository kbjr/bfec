
import { TSEntity } from './entity';
import { TSFieldType } from './types';

export class TSTypeBranchAlias extends TSEntity {
	public type: string;
	public cases: TSTypeBranch[] = [ ];
	public default_type: TSTypeBranch;

	public add_case(sub_type: string) {
		const branch = new TSTypeBranch();
		branch.alias = this;
		branch.sub_type = sub_type;
		this.cases.push(branch);
		return branch;
	}

	public add_default() {
		const branch = new TSTypeBranch();
		branch.alias = this;
		this.default_type = branch;
		return branch;
	}

	public get decl_str() {
		const defaul_result = this.default_type.field_type();
		return `${this.comments_str('')}\nexport type ${this.name}<$T extends ${this.type} = ${this.type}, $V = void>\n\t= ${this.cases_str}\n\t: ${defaul_result}\n\t;`;
	}

	private get cases_str() {
		return this.cases.map((branch) => {
			return `$T extends ${branch.sub_type} ? ${branch.field_type()}`;
		}).join('\n\t: ');
	}
}

export class TSTypeBranch {
	public alias: TSTypeBranchAlias;
	public sub_type: string;
	public result_type: TSFieldType | '$V';

	public field_type() {
		return typeof this.result_type === 'string' ? this.result_type : this.result_type.field_type();
	}
}
