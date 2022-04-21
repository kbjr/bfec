
import { TSEntity } from './entity';

export class TSEnum extends TSEntity {
	public members: [ name: string, value: string ][] = [ ];

	public get decl_str() {
		// TODO: enum comments
		// TODO: member comments
		return `export enum ${this.name} {\n\t${this.members.map(([ name, value ]) => `${name} = ${value},`).join('\n\t')}\n}`;
	}
}
