
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-16T05:30:10.739Z
*/

import * as $types from './types/$index';
import { $encode, $decode, $State, $BufferWriter, $BufferReader } from './utils';

export * as types from './types/$index';

export function encode($inst: $types.png.$) : Uint8Array {
	const $state = new $State();
	$state.root = $inst;
	$state.write_to = new $BufferWriter();
	$types.png.$[$encode]($inst, $state);
	return $state.write_to.as_u8_array();
}

export function decode($array: Uint8Array) : $types.png.$ {
	const $state = new $State();
	$state.root = new $types.png.$();
	$state.read_from = new $BufferReader($array);
	return $types.png.$[$decode]($state.root, $state);
}
