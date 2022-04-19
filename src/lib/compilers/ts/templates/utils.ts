
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

export interface $Struct {
	readonly [$align]: boolean;
}

export interface $StructType<$T> {
	new () : $T;
	$type: 'struct';
	$align: boolean;
	$encode($state: $State, $inst: $T) : void;
	$decode($state: $State) : $T;
}

export interface $SwitchType<$T, $C> {
	$type: 'switch';
	$encode($state: $State, $case: $C, $inst: $T) : void;
	$decode($state: $State, $case: $C) : $T;
}
`;
