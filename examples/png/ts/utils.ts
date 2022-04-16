
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-16T04:13:59.810Z
*/

import * as $types from './types/$index';
import { $BufferReader } from './buffer-reader';
import { $BufferWriter } from './buffer-writer';

export { $BufferReader } from './buffer-reader';
export { $BufferWriter } from './buffer-writer';
export { $UnprocessedSlice } from './unprocessed-slice';

export const $encode = Symbol('$encode');
export const $decode = Symbol('$decode');

export type $Root = $types.png.$;

export interface $Type<$T> {
	[$encode]($inst: $T, $read_from: $BufferWriter, $root: $Root) : $T;
	[$decode]($inst: $T, $read_from: $BufferReader, $root: $Root) : $T;
}

export interface $StructType<$T> extends $Type<$T> {
	new () : $T;
}
