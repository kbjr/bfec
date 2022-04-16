
export interface UtilsTemplateOpts {
	root_ns_name: string;
	root_struct_class: string;
}

export const utils_template = (tmpl: UtilsTemplateOpts) => `
import * as $types from './types/$index';
import { $BufferReader } from './buffer-reader';
import { $State } from './state';
import { $BufferWriter } from './buffer-writer';

export { $BufferReader } from './buffer-reader';
export { $BufferWriter } from './buffer-writer';
export { $State } from './state';
export { $UnprocessedSlice } from './unprocessed-slice';

export const $encode = Symbol('$encode');
export const $decode = Symbol('$decode');

export type $Root = $types.${tmpl.root_ns_name}.${tmpl.root_struct_class};

export interface $Type<$T> {
	[$encode]($inst: $T, $state: $State) : $T;
	[$decode]($inst: $T, $state: $State) : $T;
}

export interface $StructType<$T> extends $Type<$T> {
	new () : $T;
}
`;
