
import * as ts from '../ts-entities';
import { doc_comments_template } from './doc-comments';
import { import_template, import_type_expr_template, import_utils } from './import';

export interface SwitchFunctionTemplateOpts {
	file_path: string;
	switch_name: string;
	switch_comments: string[];
	enum_name: string;
	enum_file_path: string;
	branches: SwitchBranchOpts[];
	default: SwitchDefaultOpts;
}

export interface SwitchBranchOpts {
	enum_member: string;
	type_name?: string;
	type_file_path?: string;
	is_void: boolean;
	is_invalid: boolean;
}

export interface SwitchDefaultOpts {
	type_name?: string;
	type_file_path?: string;
	is_void: boolean;
	is_invalid: boolean;
}

export const switch_template = (tmpl: SwitchFunctionTemplateOpts) => `
${import_utils(tmpl.file_path, '{ $State, $encode, $decode }')}
${enum_import(tmpl)}

${tmpl.switch_comments.length ? doc_comments_template(tmpl.switch_comments) : ''}
export type ${tmpl.switch_name}<$T extends $Enum = $Enum>
	= ${tmpl.branches.map((branch) => switch_type_branch_template(tmpl.file_path, branch)).join('\n\t: ')}
	: ${switch_type_default_template(tmpl.file_path, tmpl.default)}
	;

export const ${tmpl.switch_name} = Object.freeze({
	[$decode]<$T extends $Enum = $Enum>($inst: null, $state: $State, $case: $T) : ${tmpl.switch_name}<$T> {
		switch ($case) {
			// TODO: switch case/default decoding
			${switch_case_default_decode_template(tmpl, tmpl.default)}
		}
	},
	[$encode]<$T extends $Enum = $Enum>($inst: ${tmpl.switch_name}<$T>, $state: $State, $case: $T) {
		switch ($case) {
			// TODO: switch case/default encoding
			${switch_case_default_encode_template(tmpl, tmpl.default)}
		}
	}
});
`;

const switch_type_branch_template = (from_path: string, tmpl: SwitchBranchOpts) => (
	tmpl.is_void ? 'void' : tmpl.is_invalid ? 'never'
	: `$T extends $Enum.${tmpl.enum_member} ? ${member_import_inline(from_path, tmpl)}`
);

const switch_type_default_template = (from_path: string, tmpl: SwitchDefaultOpts) => (
	tmpl.is_void ? 'void' : tmpl.is_invalid ? 'never'
	: member_import_inline(from_path, tmpl)
);

const switch_case_branch_encode_template = (switch_tmpl: SwitchFunctionTemplateOpts, tmpl: SwitchBranchOpts) => {
	if (tmpl.is_void) {
		return `case $Enum.${tmpl.enum_member}: return void 0 as any as ${switch_tmpl.switch_name}<$T>;`;
	}

	if (tmpl.is_invalid) {
		return 'case $Enum.${tmpl.enum_member}: ' + error_invalid(switch_tmpl.switch_name);
	}

	// 
};

const switch_case_branch_decode_template = (switch_tmpl: SwitchFunctionTemplateOpts, tmpl: SwitchBranchOpts) => {
	if (tmpl.is_void) {
		return `case $Enum.${tmpl.enum_member}: return void 0 as any as ${switch_tmpl.switch_name}<$T>;`;
	}

	if (tmpl.is_invalid) {
		return 'case $Enum.${tmpl.enum_member}: ' + error_invalid(switch_tmpl.switch_name);
	}

	// 
};

const switch_case_default_encode_template = (switch_tmpl: SwitchFunctionTemplateOpts, tmpl: SwitchDefaultOpts) => {
	if (tmpl.is_void) {
		return `default: return void 0 as any as ${switch_tmpl.switch_name}<$T>;`;
	}

	if (tmpl.is_invalid) {
		return 'default: ' + error_invalid(switch_tmpl.switch_name);
	}

	// 
};

const switch_case_default_decode_template = (switch_tmpl: SwitchFunctionTemplateOpts, tmpl: SwitchDefaultOpts) => {
	if (tmpl.is_void) {
		return `default: return void 0 as any as ${switch_tmpl.switch_name}<$T>;`;
	}

	if (tmpl.is_invalid) {
		return 'default: ' + error_invalid(switch_tmpl.switch_name);
	}

	// 
};

const enum_import = (tmpl: SwitchFunctionTemplateOpts) => import_template({
	type_name: tmpl.enum_name,
	alias_name: '$Enum',
	from_path: tmpl.file_path,
	source_path: tmpl.enum_file_path
});

const member_import_inline = (from_path: string, tmpl: SwitchDefaultOpts | SwitchBranchOpts) => import_type_expr_template({
	type_name: tmpl.type_name,
	from_path: from_path,
	source_path: tmpl.type_file_path,
});

const error_invalid = (switch_name: string) => `$state.fatal(\`${switch_name}: Encountered invalid case: \${$case}\`);`;
