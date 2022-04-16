
export interface SchemaIndexTemplateOpts {
	exports: SchemaExportTemplateOpts[];
}

export interface SchemaExportTemplateOpts {
	type_name: string;
	file_name: string;
}

export const schema_index_template = (tmpl: SchemaIndexTemplateOpts) => `
${tmpl.exports.map((exp) => export_template(exp)).join('')}
`;

const export_template = (exp: SchemaExportTemplateOpts) => `
export { ${exp.type_name} } from './${exp.file_name}';`
