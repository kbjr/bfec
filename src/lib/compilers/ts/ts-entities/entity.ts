
import { TSModule } from './module';
import * as tmpl from '../templates';

export abstract class TSEntity {
	public module: TSModule;
	public name: string;
	public comments: string[] = [ ];

	public comments_str(indent: string) {
		return this.comments.length ? tmpl.doc_comments_template(this.comments, indent) : '';
	}

	public import(from: string, alias?: string) : tmpl.ImportTemplateOpts {
		return {
			from_path: from,
			source_path: this.module.file_path,
			type_name: this.name,
			alias_name: alias,
		};
	}
}
