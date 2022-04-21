
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-21T06:09:08.778Z
*/

import { $State } from '../../utils';
import { Chunk } from './Chunk';
const $const_str$_0 = "\x89\x50\x4e\x47\x0d\x0a\x1a\x0a";
const $const_u8_array$_0 = new Uint8Array([
	0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a
]);

export interface $ {
	magic_number: "\x89\x50\x4e\x47\x0d\x0a\x1a\x0a";
	header: Chunk
	chunks: never;
}
export namespace $ {
	
	export function $encode($state: $State, $inst: $) {
		$state.step_down('$', $inst);
		$state.step_down('magic_number', $inst.magic_number);
		{
			$state.assert_str_match($inst.magic_number, $const_str$_0);
			// TODO: Write bytes in ts_const_u8
		};
		$state.step_up();
		$state.step_down('header', $inst.header);
		$state.fatal('Failed to compile struct encoder');
		$state.step_up();
		$state.step_down('chunks', $inst.chunks);
		$state.fatal('Do not know how to encode type_array');
		$state.step_up();
		$state.step_up();
	}
	
	export function $decode($state: $State) : $ {
		const $inst = { } as $;
		$state.step_down('$', $inst);
		$state.step_down('magic_number');
		$inst.magic_number = $state.assert_u8_array_match($state.read_from.take_bytes(8, false), $const_u8_array$_0, $const_str$_0);
		$state.step_up();
		$state.step_down('header');
		$inst.header = $state.fatal('Failed to compile struct decoder');
		$state.step_up();
		$state.step_down('chunks');
		$inst.chunks = $state.fatal('Do not know how to decode type_array');
		$state.step_up();
		$state.step_up();
		return $inst;
	}
}
