
import { doc_comments_template } from './doc-comments';

export interface EnumTemplateOpts {
	enum_name: string;
	enum_members: EnumMemberTemplateOpts[];
	enum_comments: string[];
}

export interface EnumMemberTemplateOpts {
	name: string;
	value: string;
	comments: string[];
}

export const enum_template = (tmpl: EnumTemplateOpts) => `
${doc_comments_template(tmpl.enum_comments)}
export enum ${tmpl.enum_name} {
	${tmpl.enum_members.map(enum_member_template).join('')}
}
`;

const enum_member_template = (tmpl: EnumMemberTemplateOpts) => `
	${doc_comments_template(tmpl.comments, '\t')}
	${tmpl.name} = ${tmpl.value},
`;
