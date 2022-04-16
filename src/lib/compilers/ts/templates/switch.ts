
import * as ts from '../ts-entities';
import { doc_comments_template } from './doc-comments';
import { import_template, import_type_expr_template, import_utils } from './import';

export interface SwitchFunctionTemplateOpts {
	ts_switch: ts.Switch;
	switch_comments: string[];
	enum_name: string;
	enum_file_path: string;
	branches: SwitchBranchOpts[];
	default: SwitchDefaultOpts;
}

export type SwitchBranchResult
	= { branch_type: 'void' }
	| { branch_type: 'invalid' }
	| { branch_type: 'builtin'; type: string; encode: string; decode: string }
	| { branch_type: 'struct'; type: string; file: string /*; params */ }
	| { branch_type: 'switch'; type: string; file: string }
	| { branch_type: 'enum'; type: string; file: string }
	;

export type SwitchBranchOpts = { enum_member: string } & SwitchBranchResult;

export type SwitchDefaultOpts = SwitchBranchResult;

export const switch_template = (tmpl: SwitchFunctionTemplateOpts) => `
${import_utils(tmpl.ts_switch.file_path, '{ $State }')}
${enum_import(tmpl)}

${tmpl.switch_comments.length ? doc_comments_template(tmpl.switch_comments) : ''}
export type ${tmpl.ts_switch.name}<$T extends $Enum = $Enum>
	= ${tmpl.branches.map((branch) => switch_type_branch_template(tmpl.ts_switch.file_path, branch)).join('\n\t: ')}
	: ${switch_type_template(tmpl.ts_switch.file_path, tmpl.default)}
	;

export const ${tmpl.ts_switch.name} = Object.freeze({
	$decode<$T extends $Enum = $Enum>($state: $State, $case: $T) : ${tmpl.ts_switch.name}<$T> {
		switch ($case) {
			${tmpl.branches.map((branch) => switch_case_branch_decode_template(tmpl, branch)).join('\n\t\t\t')}
			${switch_case_default_decode_template(tmpl, tmpl.default)}
		}
	},

	$encode<$T extends $Enum = $Enum>($state: $State, $case: $T, $inst: ${tmpl.ts_switch.name}<$T>) {
		switch ($case) {
			${tmpl.branches.map((branch) => switch_case_branch_encode_template(tmpl, branch)).join('\n\t\t\t')}
			${switch_case_default_encode_template(tmpl, tmpl.default)}
		}
	}
});
`;

const switch_type_branch_template = (from_path: string, br: SwitchBranchOpts) => (
	`$T extends $Enum.${br.enum_member} ? ${switch_type_template(from_path, br)}`
);

const switch_type_template = (from_path: string, tmpl: SwitchDefaultOpts) =>
	( tmpl.branch_type === 'void' ? 'void'
	: tmpl.branch_type === 'invalid' ? 'never'
	: tmpl.branch_type === 'builtin' ? tmpl.type
	: import_type_expr_template({
		type_name: tmpl.type,
		from_path: from_path,
		source_path: tmpl.file,
	})
);

const switch_case_branch_encode_template = (switch_tmpl: SwitchFunctionTemplateOpts, tmpl: SwitchBranchOpts) => {
	if (tmpl.branch_type === 'void') {
		return `case $Enum.${tmpl.enum_member}: return void 0;`;
	}

	if (tmpl.branch_type === 'invalid') {
		return `case $Enum.${tmpl.enum_member}: ` + error_invalid(switch_tmpl.ts_switch.name);
	}

	return `case $Enum.${tmpl.enum_member}: $state.fatal('Not yet implemented');`;
};

const switch_case_branch_decode_template = (switch_tmpl: SwitchFunctionTemplateOpts, tmpl: SwitchBranchOpts) => {
	if (tmpl.branch_type === 'void') {
		return `case $Enum.${tmpl.enum_member}: return void 0;`;
	}

	if (tmpl.branch_type === 'invalid') {
		return `case $Enum.${tmpl.enum_member}: ` + error_invalid(switch_tmpl.ts_switch.name);
	}

	return `case $Enum.${tmpl.enum_member}: $state.fatal('Not yet implemented');`;
};

const switch_case_default_encode_template = (switch_tmpl: SwitchFunctionTemplateOpts, tmpl: SwitchDefaultOpts) => {
	if (tmpl.branch_type === 'void') {
		return `default: return void 0;`;
	}

	if (tmpl.branch_type === 'invalid') {
		return 'default: ' + error_invalid(switch_tmpl.ts_switch.name);
	}

	return 'default: $state.fatal(`Not yet implemented`);';
};

const switch_case_default_decode_template = (switch_tmpl: SwitchFunctionTemplateOpts, tmpl: SwitchDefaultOpts) => {
	if (tmpl.branch_type === 'void') {
		return `default: return void 0;`;
	}

	if (tmpl.branch_type === 'invalid') {
		return 'default: ' + error_invalid(switch_tmpl.ts_switch.name);
	}

	return 'default: $state.fatal(`Not yet implemented`);';
};

const enum_import = (tmpl: SwitchFunctionTemplateOpts) => import_template({
	type_name: tmpl.enum_name,
	alias_name: '$Enum',
	from_path: tmpl.ts_switch.file_path,
	source_path: tmpl.enum_file_path
});

const error_invalid = (switch_name: string) => `$state.fatal(\`${switch_name}: Encountered invalid case: \${$case}\`);`;
