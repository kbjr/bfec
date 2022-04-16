
import { doc_comments_template } from './doc-comments';
import { import_template, ImportTemplateOpts, path_relative_to } from './import';

export interface StructClassTemplateOpts {
	file_path: string;
	struct_name: string;
	struct_comments: string[];
	struct_fields: [ string, string ][];
	struct_encode_body: string[];
	struct_decode_body: string[];
	struct_imports: ImportTemplateOpts[];
	root_struct_type: string;
}

export const struct_template = (tmpl: StructClassTemplateOpts) => `
import { $BufferReader, $BufferWriter, $Root, $encode, $decode } from '${path_relative_to(tmpl.file_path, 'utils')}';
${tmpl.struct_imports.map(import_template).join('')}
${tmpl.struct_comments.length ? doc_comments_template(tmpl.struct_comments) : ''}
export class ${tmpl.struct_name} {
	${tmpl.struct_fields.map(([ name, type ]) => struct_field_template(name, type)).join('')}

	public static [$encode]($inst: ${tmpl.struct_name}, $write_to: $BufferWriter, $root: $Root) {
		//
		${tmpl.struct_encode_body.join('\n\t\t')}
	}
	
	public static [$decode]($inst: ${tmpl.struct_name}, $read_from: $BufferReader, $root: $Root) : ${tmpl.struct_name} {
		//
		${tmpl.struct_decode_body.join('\n\t\t')}
		return $inst;
	}
}
`;

const struct_field_template = (name: string, type: string) => `
	public ${name}: ${type};`;
