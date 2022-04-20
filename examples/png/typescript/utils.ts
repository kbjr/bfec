
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-20T02:57:14.571Z
*/

import * as $types from './types/$index';
import { $State } from './state';

export { $State } from './state';
export { $BufferReader } from './buffer-reader';
export { $BufferWriter } from './buffer-writer';
export { $UnprocessedSlice } from './unprocessed-slice';

export const $align = Symbol('$align');

export type $Root = $types.png.$;

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
