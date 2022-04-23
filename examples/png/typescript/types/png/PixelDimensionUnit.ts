
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.383Z
*/

import { $State } from '../../utils';

export enum PixelDimensionUnit {
	unknown = 0,
	meter = 1,
}
export namespace PixelDimensionUnit {
	
	export function $encode_aligned($state: $State, $value: PixelDimensionUnit) {
		$state.write_to.write_u8($value);
	}
	
	export function $encode_unaligned($state: $State, $value: PixelDimensionUnit) {
		$state.fatal('Cannot encode unaligned int field')
	}
	
	export function $decode_aligned($state: $State) : PixelDimensionUnit {
		return $state.read_from.read_u8() as PixelDimensionUnit;
	}
	
	export function $decode_unaligned($state: $State) : PixelDimensionUnit {
		return $state.fatal('Cannot decode unaligned int field') as PixelDimensionUnit;
	}
}
