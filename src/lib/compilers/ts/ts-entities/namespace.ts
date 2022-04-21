
import { TSEntity } from './entity';

export class TSNamespace extends TSEntity {
	public contents: string[] = [ ];

	public get decl_str() {
		return `export namespace ${this.name} {\n\t${this.contents.join('\n\t')}\n}`;
	}
}
