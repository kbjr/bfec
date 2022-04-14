
import { doc_comments_template } from './doc-comments';
import { import_template, ImportTemplateOpts, utils_path_from } from './import';

export interface StructClassTemplateOpts {
	file_path: string;
	class_name: string;
	class_comments: string[];
	class_fields: [ string, string ][];
	class_encode_body: string[];
	class_decode_body: string[];
	class_imports: ImportTemplateOpts[];
	root_struct_type: string;
}

export const struct_class_template = (tmpl: StructClassTemplateOpts) => `
import { $BufferReader, $BufferWriter, $encode, $decode } from '${utils_path_from(tmpl.file_path)}';
${tmpl.class_imports.map(import_template).join('')}
${tmpl.class_comments.length ? doc_comments_template(tmpl.class_comments) : ''}
export class ${tmpl.class_name} {
	${tmpl.class_fields.map(([ name, type ]) => struct_field_template(name, type)).join('')}

	public static [$encode]($inst: ${tmpl.class_name}, $write_to: $BufferWriter, $root: ${tmpl.root_struct_type}) {
		${tmpl.class_encode_body.join('\n\t\t')}
	}
	
	public static [$decode]($inst: ${tmpl.class_name}, $read_from: $BufferReader, $root: ${tmpl.root_struct_type}) : ${tmpl.class_name} {
		${tmpl.class_decode_body.join('\n\t\t')}
	}
}
`;

const struct_field_template = (name: string, type: string) => `
	public ${name}: ${type};`;
