
export class TSLocal {
	public name: string;
	public type: string;
	public initial?: string;

	public get decl_str() {
		const assign = this.initial ? ` = ${this.initial}` : '';
		return `let ${this.name}: ${this.type}${assign};`;
	}

	public get ref_str() {
		return this.name;
	}
}
