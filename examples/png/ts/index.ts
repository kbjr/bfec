
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-14T04:19:42.138Z
*/

import * as $types from './types/$index';
import { $encode, $decode, $BufferWriter, $BufferReader } from './utils';

export * as types from './types/$index';

export function encode($inst: $types.RootStruct) : Uint8Array {
	const $write_to = new $BufferWriter();
	$types.RootStruct[$encode]($inst, $write_to, $inst);
	return $write_to.as_u8_array();
}

export function decode(array: Uint8Array) : $types.RootStruct {
	const $read_from = new $BufferReader(array);
	const $inst = new $types.RootStruct();
	return $types.RootStruct[$decode]($inst, $read_from, $inst);
}
