
export class TSTypeParam {
	public name: string;
	public extends?: string;
	public default?: string;

	public get decl_str() {
		return this.name
			+ (this.extends ? ` extends ${this.extends}` : '')
			+ (this.default ? ` = ${this.default}` : '');
	}

	public get ref_str() {
		return this.name;
	}
}
