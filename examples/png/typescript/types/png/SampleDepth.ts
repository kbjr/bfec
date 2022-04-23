
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.116Z
*/

import { $State } from '../../utils';

export enum SampleDepth {
	b8 = 8,
	b16 = 16,
}
export namespace SampleDepth {
	
	export function $encode_aligned($state: $State, $value: SampleDepth) {
		$state.write_to.write_u8($value);
	}
	
	export function $encode_unaligned($state: $State, $value: SampleDepth) {
		$state.fatal('Cannot encode unaligned int field')
	}
	
	export function $decode_aligned($state: $State) : SampleDepth {
		return $state.read_from.read_u8() as SampleDepth;
	}
	
	export function $decode_unaligned($state: $State) : SampleDepth {
		return $state.fatal('Cannot decode unaligned int field') as SampleDepth;
	}
}
