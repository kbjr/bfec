
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.115Z
*/

import { $State } from '../../utils';
import { ColorType } from './ColorType';


export type SignifigantBitsData<$T extends ColorType = ColorType, $V = void>
	= $T extends ColorType.greyscale ? GreyscaleSignifigantBitsData
	: $T extends ColorType.truecolor ? ColorSignifigantBitsData
	: $T extends ColorType.indexed_color ? ColorSignifigantBitsData
	: $T extends ColorType.greyscale_with_alpha ? GreyscaleSignifigantBitsData
	: $T extends ColorType.truecolor_with_alpha ? ColorSignifigantBitsData
	: never
	;
export namespace SignifigantBitsData {
	
	export function $encode<$T extends ColorType = ColorType>($state: $State, $case: $T, $inst: SignifigantBitsData<$T>) {
		switch ($case) {
			case ColorType.greyscale: GreyscaleSignifigantBitsData.$encode($state, $inst)
			case ColorType.truecolor: ColorSignifigantBitsData.$encode($state, $inst)
			case ColorType.indexed_color: ColorSignifigantBitsData.$encode($state, $inst)
			case ColorType.greyscale_with_alpha: GreyscaleSignifigantBitsData.$encode($state, $inst)
			case ColorType.truecolor_with_alpha: ColorSignifigantBitsData.$encode($state, $inst)
			default: $state.fatal(`SignifigantBitsData: Encountered invalid case: ${$case}`);
		}
	}
	
	export function $decode<$T extends ColorType = ColorType>($state: $State, $case: $T) : SignifigantBitsData<$T> {
		switch ($case) {
			case ColorType.greyscale: return GreyscaleSignifigantBitsData.$decode($state);
			case ColorType.truecolor: return ColorSignifigantBitsData.$decode($state);
			case ColorType.indexed_color: return ColorSignifigantBitsData.$decode($state);
			case ColorType.greyscale_with_alpha: return GreyscaleSignifigantBitsData.$decode($state);
			case ColorType.truecolor_with_alpha: return ColorSignifigantBitsData.$decode($state);
			default: $state.fatal(`SignifigantBitsData: Encountered invalid case: ${$case}`);
		}
	}
}
