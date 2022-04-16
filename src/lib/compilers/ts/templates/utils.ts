
export interface UtilsTemplateOpts {
	root_ns_name: string;
	root_struct_class: string;
}

export const utils_template = (tmpl: UtilsTemplateOpts) => `
import * as $types from './types/$index';
import { $BufferReader } from './buffer-reader';
import { $BufferWriter } from './buffer-writer';

export { $BufferReader } from './buffer-reader';
export { $BufferWriter } from './buffer-writer';
export { $UnprocessedSlice } from './unprocessed-slice';

export const $encode = Symbol('$encode');
export const $decode = Symbol('$decode');

export type $Root = $types.${tmpl.root_ns_name}.${tmpl.root_struct_class};

export interface $Type<$T> {
	[$encode]($inst: $T, $read_from: $BufferWriter, $root: $Root) : $T;
	[$decode]($inst: $T, $read_from: $BufferReader, $root: $Root) : $T;
}

export interface $StructType<$T> extends $Type<$T> {
	new () : $T;
}
`;
