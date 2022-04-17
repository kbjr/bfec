
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-17T04:06:19.177Z
*/

import * as $types from './types/$index';
import { $State } from './state';

export { $BufferReader } from './buffer-reader';
export { $BufferWriter } from './buffer-writer';
export { $State } from './state';
export { $UnprocessedSlice } from './unprocessed-slice';

export type $Root = $types.png.$;

export interface $StructType<$T> {
	new () : $T;
	$encode($state: $State, $inst: $T) : void;
	$decode($state: $State) : $T;
}

export interface $SwitchType<$T, $C> {
	$encode($state: $State, $case: $C, $inst: $T) : void;
	$decode($state: $State, $case: $C) : $T;
}
