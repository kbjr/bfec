
import { path_relative_to } from './import';

export interface TypesIndexTemplateOpts {
	exports: ExportTemplateOpts[];
}

export interface ExportTemplateOpts {
	ns_name: string;
	from_path: string;
	source_path: string;
}

export const types_index_template = (tmpl: TypesIndexTemplateOpts) => `
${tmpl.exports.map((exp) => export_template(exp)).join('')}
`;

const export_template = (exp: ExportTemplateOpts) => `
export * as ${exp.ns_name} from './${path_relative_to(exp.from_path, exp.source_path)}';`
