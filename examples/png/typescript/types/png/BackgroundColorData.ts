
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.115Z
*/

import { $State } from '../../utils';
import { ColorType } from './ColorType';


export type BackgroundColorData<$T extends ColorType = ColorType, $V = void>
	= $T extends ColorType.greyscale ? GreyscaleBackgroundData
	: $T extends ColorType.greyscale_with_alpha ? GreyscaleBackgroundData
	: $T extends ColorType.truecolor ? TruecolorBackgroundData
	: $T extends ColorType.truecolor_with_alpha ? TruecolorBackgroundData
	: $T extends ColorType.indexed_color ? IndexedColorBackgroundData
	: never
	;
export namespace BackgroundColorData {
	
	export function $encode<$T extends ColorType = ColorType>($state: $State, $case: $T, $inst: BackgroundColorData<$T>) {
		switch ($case) {
			case ColorType.greyscale: GreyscaleBackgroundData.$encode($state, $inst)
			case ColorType.greyscale_with_alpha: GreyscaleBackgroundData.$encode($state, $inst)
			case ColorType.truecolor: TruecolorBackgroundData.$encode($state, $inst)
			case ColorType.truecolor_with_alpha: TruecolorBackgroundData.$encode($state, $inst)
			case ColorType.indexed_color: IndexedColorBackgroundData.$encode($state, $inst)
			default: $state.fatal(`BackgroundColorData: Encountered invalid case: ${$case}`);
		}
	}
	
	export function $decode<$T extends ColorType = ColorType>($state: $State, $case: $T) : BackgroundColorData<$T> {
		switch ($case) {
			case ColorType.greyscale: return GreyscaleBackgroundData.$decode($state);
			case ColorType.greyscale_with_alpha: return GreyscaleBackgroundData.$decode($state);
			case ColorType.truecolor: return TruecolorBackgroundData.$decode($state);
			case ColorType.truecolor_with_alpha: return TruecolorBackgroundData.$decode($state);
			case ColorType.indexed_color: return IndexedColorBackgroundData.$decode($state);
			default: $state.fatal(`BackgroundColorData: Encountered invalid case: ${$case}`);
		}
	}
}
