
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.382Z
*/

import { $State } from '../../utils';
import { ColorType } from './ColorType';
import { GreyscaleSignifigantBitsData } from './GreyscaleSignifigantBitsData';
import { ColorSignifigantBitsData } from './ColorSignifigantBitsData';


export type SignifigantBitsData<$T extends ColorType = ColorType, $V = void>
	= $T extends ColorType.greyscale ? GreyscaleSignifigantBitsData
	: $T extends ColorType.truecolor ? ColorSignifigantBitsData
	: $T extends ColorType.indexed_color ? ColorSignifigantBitsData
	: $T extends ColorType.greyscale_with_alpha ? GreyscaleSignifigantBitsData
	: $T extends ColorType.truecolor_with_alpha ? ColorSignifigantBitsData
	: never
	;
export namespace SignifigantBitsData {
	
	export function $encode<$T extends ColorType = ColorType, $V = void>($state: $State, $case: $T, $inst: SignifigantBitsData<$T, $V>) {
		switch ($case) {
			case ColorType.greyscale: return void GreyscaleSignifigantBitsData.$encode($state, $inst as GreyscaleSignifigantBitsData);
			case ColorType.truecolor: return void ColorSignifigantBitsData.$encode($state, $inst as ColorSignifigantBitsData);
			case ColorType.indexed_color: return void ColorSignifigantBitsData.$encode($state, $inst as ColorSignifigantBitsData);
			case ColorType.greyscale_with_alpha: return void GreyscaleSignifigantBitsData.$encode($state, $inst as GreyscaleSignifigantBitsData);
			case ColorType.truecolor_with_alpha: return void ColorSignifigantBitsData.$encode($state, $inst as ColorSignifigantBitsData);
			default: return void $state.fatal(`SignifigantBitsData: Encountered invalid case: ${$case}`);
		}
	}
	
	export function $decode<$T extends ColorType = ColorType, $V = void>($state: $State, $case: $T, $void: $V = void 0) : SignifigantBitsData<$T, $V> {
		switch ($case) {
			case ColorType.greyscale: return GreyscaleSignifigantBitsData.$decode($state) as SignifigantBitsData<$T, $V>;
			case ColorType.truecolor: return ColorSignifigantBitsData.$decode($state) as SignifigantBitsData<$T, $V>;
			case ColorType.indexed_color: return ColorSignifigantBitsData.$decode($state) as SignifigantBitsData<$T, $V>;
			case ColorType.greyscale_with_alpha: return GreyscaleSignifigantBitsData.$decode($state) as SignifigantBitsData<$T, $V>;
			case ColorType.truecolor_with_alpha: return ColorSignifigantBitsData.$decode($state) as SignifigantBitsData<$T, $V>;
			default: return void $state.fatal(`SignifigantBitsData: Encountered invalid case: ${$case}`);
		}
	}
}
