
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.383Z
*/

import { $State } from '../../utils';

export enum InterlaceMethod {
	no_interlace = 0,
	adam7_interlace = 1,
}
export namespace InterlaceMethod {
	
	export function $encode_aligned($state: $State, $value: InterlaceMethod) {
		$state.write_to.write_u8($value);
	}
	
	export function $encode_unaligned($state: $State, $value: InterlaceMethod) {
		$state.fatal('Cannot encode unaligned int field')
	}
	
	export function $decode_aligned($state: $State) : InterlaceMethod {
		return $state.read_from.read_u8() as InterlaceMethod;
	}
	
	export function $decode_unaligned($state: $State) : InterlaceMethod {
		return $state.fatal('Cannot decode unaligned int field') as InterlaceMethod;
	}
}
