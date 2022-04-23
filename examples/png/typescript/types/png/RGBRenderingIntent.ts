
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.116Z
*/

import { $State } from '../../utils';

export enum RGBRenderingIntent {
	perceptual = 0,
	relative_colorimetric = 1,
	saturation = 2,
	absolute_colorimetric = 3,
}
export namespace RGBRenderingIntent {
	
	export function $encode_aligned($state: $State, $value: RGBRenderingIntent) {
		$state.write_to.write_u8($value);
	}
	
	export function $encode_unaligned($state: $State, $value: RGBRenderingIntent) {
		$state.fatal('Cannot encode unaligned int field')
	}
	
	export function $decode_aligned($state: $State) : RGBRenderingIntent {
		return $state.read_from.read_u8() as RGBRenderingIntent;
	}
	
	export function $decode_unaligned($state: $State) : RGBRenderingIntent {
		return $state.fatal('Cannot decode unaligned int field') as RGBRenderingIntent;
	}
}
