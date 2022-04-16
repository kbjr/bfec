
export interface UtilsTemplateOpts {
	root_ns_name: string;
	root_struct_class: string;
}

export const utils_template = (tmpl: UtilsTemplateOpts) => `
import * as $types from './types/$index';
import { $State } from './state';

export { $BufferReader } from './buffer-reader';
export { $BufferWriter } from './buffer-writer';
export { $State } from './state';
export { $UnprocessedSlice } from './unprocessed-slice';

export type $Root = $types.${tmpl.root_ns_name}.${tmpl.root_struct_class};

export interface $StructType<$T> {
	new () : $T;
	$encode($state: $State, $inst: $T) : void;
	$decode($state: $State) : $T;
}

export interface $SwitchType<$T, $C> {
	$encode($state: $State, $case: $C, $inst: $T) : void;
	$decode($state: $State, $case: $C) : $T;
}
`;
