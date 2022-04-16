
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-16T05:30:10.739Z
*/

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

export type $Root = $types.png.$;

export interface $Type<$T> {
	[$encode]($inst: $T, $state: $State) : $T;
	[$decode]($inst: $T, $state: $State) : $T;
}

export interface $StructType<$T> extends $Type<$T> {
	new () : $T;
}
