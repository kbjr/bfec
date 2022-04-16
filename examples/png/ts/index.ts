
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-16T04:13:59.810Z
*/

import * as $types from './types/$index';
import { $encode, $decode, $BufferWriter, $BufferReader } from './utils';

export * as types from './types/$index';

export function encode($inst: $types.png.$) : Uint8Array {
	const $write_to = new $BufferWriter();
	$types.png.$[$encode]($inst, $write_to, $inst);
	return $write_to.as_u8_array();
}

export function decode($array: Uint8Array) : $types.png.$ {
	const $read_from = new $BufferReader($array);
	const $inst = new $types.png.$();
	return $types.png.$[$decode]($inst, $read_from, $inst);
}
