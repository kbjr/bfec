
import { TSEnum } from './enum';
import { TSImportedRef } from './import';

export class TSSwitchStatement {
	public param: string;
	public ts_enum: TSImportedRef<TSEnum>;
	public cases: [ name: string, case_expr: string ][];
	public default_expr: string;

	public get stmt_str() {
		return `switch (${this.param}) {\n\t\t\t${this.cases_str}\n\t\t${this.default_str}\n\t\t}`;
	}

	private get cases_str() {
		const enum_ref = this.ts_enum.ref_str;
		return this.cases.map(([ name, case_expr ]) => `case ${enum_ref}.${name}: ${case_expr}`).join('\n\t\t\t');
	}

	private get default_str() {
		return `default: ${this.default_expr}`;
	}
}
