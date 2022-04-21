
export interface UtilsTemplateOpts {
	root_ns_name: string;
	root_struct_class: string;
}

export const utils_template = (tmpl: UtilsTemplateOpts) => `
import * as $types from './types/$index';
import { $State } from './state';

export { $State } from './state';
export { $BufferReader } from './buffer-reader';
export { $BufferWriter } from './buffer-writer';
export { $UnprocessedSlice } from './unprocessed-slice';

export const $align = Symbol('$align');

export type $Root = $types.${tmpl.root_ns_name}.${tmpl.root_struct_class};
`;
