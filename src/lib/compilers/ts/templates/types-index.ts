
export interface TypesIndexTemplateOpts {
	root_struct_class: string;
	exports: string[];
}

export const types_index_template = (tmpl: TypesIndexTemplateOpts) => `

export { ${tmpl.root_struct_class} as $Root } from './${tmpl.root_struct_class}';

${tmpl.exports.map((exp) => export_template(exp))}
`;

export const export_template = (exp: string) => `
export { ${exp} } from './${exp}';`
