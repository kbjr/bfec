
import * as ts from '../ts-entities';
import { doc_comments_template } from './doc-comments';
import { import_template, ImportTemplateOpts, import_utils } from './import';

export interface StructClassTemplateOpts {
	ts_struct: ts.Struct;
	struct_comments: string[];
	struct_fields: [ string, string ][];
	struct_encode_body: string[];
	struct_decode_body: string[];
	struct_imports: ImportTemplateOpts[];
	root_struct_type: string;
}

export const struct_template = (tmpl: StructClassTemplateOpts) => `
${import_utils(tmpl.ts_struct.file_path, '{ $State }')}
${tmpl.struct_imports.map(import_template).join('')}
export interface ${tmpl.ts_struct.name} {
	${tmpl.struct_fields.map(([ name, type ]) => struct_field_template(name, type)).join('')}
}

${tmpl.struct_comments.length ? doc_comments_template(tmpl.struct_comments) : ''}
export class ${tmpl.ts_struct.name} {
	public static $encode($state: $State, $inst: ${tmpl.ts_struct.name}) {
		${tmpl.ts_struct.is_root ? '$state.step_down(\'$\', $inst);' : ''}
		${tmpl.struct_encode_body.join('\n\t\t')}
	}
	
	// TODO: Handle variants
	public static $decode($state: $State) : ${tmpl.ts_struct.name} {
		const $inst = new ${tmpl.ts_struct.name}();
		${tmpl.ts_struct.is_root ? '$state.step_down(\'$\', $inst);' : ''}
		${tmpl.struct_decode_body.join('\n\t\t')}
		return $inst;
	}
}
`;

const struct_field_template = (name: string, type: string) => `
	${name}: ${type};`;
