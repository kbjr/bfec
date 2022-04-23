
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.116Z
*/

import { $State } from '../../../../../../../utils';

export enum bool {
	false = 0,
	true = 1,
}
export namespace bool {
	
	export function $encode_aligned($state: $State, $value: bool) {
		$state.write_to.write_u8($value) & 0x1;
	}
	
	export function $encode_unaligned($state: $State, $value: bool) {
		$state.fatal('Cannot encode unaligned int field')
	}
	
	export function $decode_aligned($state: $State) : bool {
		return $state.read_from.read_u8() & 0x1 as bool;
	}
	
	export function $decode_unaligned($state: $State) : bool {
		return $state.fatal('Cannot decode unaligned int field') as bool;
	}
}
