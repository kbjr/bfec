
import * as ts from '../entities';
import { import_template, import_utils } from './import';

export interface StructClassTemplateOpts {
	ts_struct: ts.Struct;
	root_struct_type: string;
}

export const struct_template = (tmpl: StructClassTemplateOpts) => `
${import_utils(tmpl.ts_struct.file_path, '{ $State }')}
${tmpl.ts_struct.imports.map(import_template).join('')}
export interface ${tmpl.ts_struct.name} {
	${tmpl.ts_struct.fields.join('\n\t\t')}
}

${tmpl.ts_struct.comments}
export class ${tmpl.ts_struct.name} {
	public static $encode($state: $State, $inst: ${tmpl.ts_struct.name}) {
		${tmpl.ts_struct.is_root ? '$state.step_down(\'$\', $inst);' : ''}
		${tmpl.ts_struct.encode_body.join('\n\t\t')}
	}
	
	// TODO: Handle variants
	public static $decode($state: $State) : ${tmpl.ts_struct.name} {
		const $inst = new ${tmpl.ts_struct.name}();
		${tmpl.ts_struct.is_root ? '$state.step_down(\'$\', $inst);' : ''}
		${tmpl.ts_struct.decode_body.join('\n\t\t')}
		return $inst;
	}
}
`;

const struct_field_template = (name: string, type: string) => `
	${name}: ${type};`;
