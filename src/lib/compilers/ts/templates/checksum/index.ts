
import { crc32_template } from './crc32';

export interface ChecksumTemplateOpts {
	checksums: string[];
}

export const checksum_index_template = (tmpl: ChecksumTemplateOpts) => `
${tmpl.checksums.map((checksum) => `export { ${checksum} } from './${checksum}';`).join('\n')}
`;

export const checksum_funcs: Record<string, () => string> = {
	crc32: crc32_template
};
