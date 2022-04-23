
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.115Z
*/

import { $State } from '../../utils';

export enum ColorType {
	greyscale = 0,
	truecolor = 2,
	indexed_color = 3,
	greyscale_with_alpha = 4,
	truecolor_with_alpha = 6,
}
export namespace ColorType {
	
	export function $encode_aligned($state: $State, $value: ColorType) {
		$state.write_to.write_u8($value);
	}
	
	export function $encode_unaligned($state: $State, $value: ColorType) {
		$state.fatal('Cannot encode unaligned int field')
	}
	
	export function $decode_aligned($state: $State) : ColorType {
		return $state.read_from.read_u8() as ColorType;
	}
	
	export function $decode_unaligned($state: $State) : ColorType {
		return $state.fatal('Cannot decode unaligned int field') as ColorType;
	}
}
