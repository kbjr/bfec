
import * as ts from '../entities';
import { import_utils } from './import';

export interface EnumTemplateOpts {
	ts_enum: ts.Enum;
}

export interface EnumMemberTemplateOpts {
	name: string;
	value: string;
	comments: string;
}

export const enum_template = (tmpl: EnumTemplateOpts) => `
${import_utils(tmpl.ts_enum.file_path, '{ $State }')}
${tmpl.ts_enum.comments}
export enum ${tmpl.ts_enum.name} {
	${tmpl.ts_enum.members.map(enum_member_template).join('')}
}

export namespace ${tmpl.ts_enum.name} {
	export function $encode($state: $State, $value: ${tmpl.ts_enum.name}) {
		// 
	}

	export function $decode($state: $State) : ${tmpl.ts_enum.name} {
		// 
	}

	export const $set = new Set<${tmpl.ts_enum.name}>([
		${tmpl.ts_enum.members.map((member) => `${tmpl.ts_enum.name}.${member.name},`).join('\n\t\t')}
	]);

	export function $is_valid(value: string) : value is ${tmpl.ts_enum.name} {
		return $set.has(value as ${tmpl.ts_enum.name});
	}
}

`;

const enum_member_template = (tmpl: EnumMemberTemplateOpts) => `
	${tmpl.comments}
	${tmpl.name} = ${tmpl.value},
`.slice(1);
