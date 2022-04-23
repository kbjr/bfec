
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.371Z
*/

import * as $types from './types/$index';
import { $State, $BufferWriter, $BufferReader } from './utils';

export * as types from './types/$index';

export function encode($inst: $types.png.$) : Uint8Array {
	const $state = new $State();
	$state.write_to = new $BufferWriter();
	$types.png.$.$encode($state, $inst);
	return $state.write_to.as_u8_array();
}

export function decode($array: Uint8Array) : $types.png.$ {
	const $state = new $State();
	$state.read_from = new $BufferReader($array);
	return $types.png.$.$decode($state);
}
