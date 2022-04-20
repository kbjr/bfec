
import * as tmpl from '../templates';

export abstract class TSEntity {
	public name: string;
	public file_path: string;
	public comments: string[] = [ ];

	public comments_str(indent: string) {
		return tmpl.doc_comments_template(this.comments, indent);
	}

	public import(from: string, alias?: string) : tmpl.ImportTemplateOpts {
		return {
			from_path: from,
			source_path: this.file_path,
			type_name: this.name,
			alias_name: alias,
		};
	}
}
