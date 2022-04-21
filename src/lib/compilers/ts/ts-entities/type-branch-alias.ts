
import { builtins } from './builtins';
import { TSEntity } from './entity';
import { TSEnumRef } from './enum-module';
import { TSStructRef } from './struct-module';
import { TSSwitchRef } from './switch-module';

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
		return `${this.comments_str('')}\nexport type ${this.name}<$T extends ${this.type} = ${this.type}, $V = void>\n\t= ${this.cases_str}\n\t: ${this.default_type.result_type_str}\n\t;`;
	}

	private get cases_str() {
		return this.cases.map((branch) => {
			return `$T extends ${branch.sub_type} ? ${branch.result_type_str}`;
		}).join('\n\t: ');
	}
}

export class TSTypeBranch {
	public alias: TSTypeBranchAlias;
	public sub_type: string;
	public result_type: TSStructRef | TSSwitchRef | TSEnumRef | builtins.Builtin | string;

	public get result_type_str() {
		if (this.result_type instanceof TSStructRef) {
			return this.result_type.ts_struct.name;
		}

		else if (this.result_type instanceof TSSwitchRef) {
			return this.result_type.ts_switch.name;
		}

		else if (this.result_type instanceof TSEnumRef) {
			return this.result_type.ts_enum.name;
		}

		else if (typeof this.result_type === 'string') {
			return this.result_type;
		}

		else if (! this.result_type) {
			return 'unknown';
		}

		else {
			return builtins.field_type(this.alias.module.state, this.result_type);
		}
	}
}
