
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.112Z
*/

import { $State } from '../../utils';
import { Chunk } from './Chunk';
const $const_str$_0 = "\x89\x50\x4e\x47\x0d\x0a\x1a\x0a";
const $const_u8_array$_0 = new Uint8Array([
	0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a
]);

export interface $ {
	magic_number: "\x89\x50\x4e\x47\x0d\x0a\x1a\x0a";
	header: Chunk;
	chunks: Chunk[];
}
export namespace $ {
	
	export function $encode($state: $State, $inst: $) {
		$state.step_down('$', $inst);
		$state.step_down('magic_number', $inst.magic_number);
		$state.assert_match($inst.magic_number, $const_str$_0);
		// TODO: Write bytes in ts_const_u8
		$state.step_up();
		$state.step_down('header', $inst.header);
		Chunk.$encode($state, $inst.header)
		$state.step_up();
		$state.step_down('chunks', $inst.chunks);
		$state.fatal('not supported')
		$state.step_up();
		$state.step_up();
	}
	
	export function $decode($state: $State) : $ {
		const $inst = { } as $;
		$state.step_down('$', $inst);
		$state.step_down('magic_number');
		$inst.magic_number = $state.assert_u8_array_match($state.read_from.take_bytes(8, false), $const_u8_array$_0, $const_str$_0)
		$state.step_up();
		$state.step_down('header');
		$inst.header = Chunk.$decode($state)
		$state.step_up();
		$state.step_down('chunks');
		$inst.chunks = $state.read_from.read_array_take_remaining(() => Chunk.$decode($state))
		$state.step_up();
		$state.step_up();
		return $inst;
	}
}
