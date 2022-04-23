
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.115Z
*/

import { $State } from '../../utils';

export enum BitDepth {
	b1 = 1,
	b2 = 2,
	b4 = 4,
	b8 = 8,
	b16 = 16,
}
export namespace BitDepth {
	
	export function $encode_aligned($state: $State, $value: BitDepth) {
		$state.write_to.write_u8($value);
	}
	
	export function $encode_unaligned($state: $State, $value: BitDepth) {
		$state.fatal('Cannot encode unaligned int field')
	}
	
	export function $decode_aligned($state: $State) : BitDepth {
		return $state.read_from.read_u8() as BitDepth;
	}
	
	export function $decode_unaligned($state: $State) : BitDepth {
		return $state.fatal('Cannot decode unaligned int field') as BitDepth;
	}
}
