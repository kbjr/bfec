
import * as ts from '../entities';
import { Interface } from '../ts-entities/interface';
import { import_template, import_utils } from './import';

export interface StructClassTemplateOpts {
	ts_struct: ts.Struct;
	struct_iface: Interface;
	root_struct_type: string;
}

// TODO: Only import `$UnprocessedSlice` if needed
export const struct_template = (tmpl: StructClassTemplateOpts) => `
${import_utils(tmpl.ts_struct.file_path, '{ $State, $align, $UnprocessedSlice }')}
${tmpl.ts_struct.imports.map(import_template).join('')}

${tmpl.struct_iface.decl_str}

export interface ${tmpl.ts_struct.name}${tmpl.ts_struct.params} {
	${tmpl.ts_struct.interface_fields.join('\n\t')}
}

${tmpl.ts_struct.comments}
export class ${tmpl.ts_struct.name} {
	public [$align] : ${tmpl.ts_struct.node.is_byte_aligned ? 'true' : 'false'} = ${tmpl.ts_struct.node.is_byte_aligned ? 'true' : 'false'};

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
