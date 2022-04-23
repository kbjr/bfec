
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.382Z
*/

import { $State } from '../../utils';
import { ColorType } from './ColorType';
import { GreyscaleBackgroundData } from './GreyscaleBackgroundData';
import { TruecolorBackgroundData } from './TruecolorBackgroundData';
import { IndexedColorBackgroundData } from './IndexedColorBackgroundData';


export type BackgroundColorData<$T extends ColorType = ColorType, $V = void>
	= $T extends ColorType.greyscale ? GreyscaleBackgroundData
	: $T extends ColorType.greyscale_with_alpha ? GreyscaleBackgroundData
	: $T extends ColorType.truecolor ? TruecolorBackgroundData
	: $T extends ColorType.truecolor_with_alpha ? TruecolorBackgroundData
	: $T extends ColorType.indexed_color ? IndexedColorBackgroundData
	: never
	;
export namespace BackgroundColorData {
	
	export function $encode<$T extends ColorType = ColorType, $V = void>($state: $State, $case: $T, $inst: BackgroundColorData<$T, $V>) {
		switch ($case) {
			case ColorType.greyscale: return void GreyscaleBackgroundData.$encode($state, $inst as GreyscaleBackgroundData);
			case ColorType.greyscale_with_alpha: return void GreyscaleBackgroundData.$encode($state, $inst as GreyscaleBackgroundData);
			case ColorType.truecolor: return void TruecolorBackgroundData.$encode($state, $inst as TruecolorBackgroundData);
			case ColorType.truecolor_with_alpha: return void TruecolorBackgroundData.$encode($state, $inst as TruecolorBackgroundData);
			case ColorType.indexed_color: return void IndexedColorBackgroundData.$encode($state, $inst as IndexedColorBackgroundData);
			default: return void $state.fatal(`BackgroundColorData: Encountered invalid case: ${$case}`);
		}
	}
	
	export function $decode<$T extends ColorType = ColorType, $V = void>($state: $State, $case: $T, $void: $V = void 0) : BackgroundColorData<$T, $V> {
		switch ($case) {
			case ColorType.greyscale: return GreyscaleBackgroundData.$decode($state) as BackgroundColorData<$T, $V>;
			case ColorType.greyscale_with_alpha: return GreyscaleBackgroundData.$decode($state) as BackgroundColorData<$T, $V>;
			case ColorType.truecolor: return TruecolorBackgroundData.$decode($state) as BackgroundColorData<$T, $V>;
			case ColorType.truecolor_with_alpha: return TruecolorBackgroundData.$decode($state) as BackgroundColorData<$T, $V>;
			case ColorType.indexed_color: return IndexedColorBackgroundData.$decode($state) as BackgroundColorData<$T, $V>;
			default: return void $state.fatal(`BackgroundColorData: Encountered invalid case: ${$case}`);
		}
	}
}
