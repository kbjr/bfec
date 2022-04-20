
import { TSEntity } from './entity';

export class TSClass extends TSEntity {
	public members: string[] = [ ];

	public get decl_str() {
		return `${this.comments_str('')}\nexport class ${this.name} {\n\t${this.members_str}\n}`;
	}

	public get members_str() {
		return this.members.join('\n\t');
	}
}
