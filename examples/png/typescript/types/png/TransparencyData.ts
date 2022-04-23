
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.382Z
*/

import { $State } from '../../utils';
import { ColorType } from './ColorType';
import { GreyscaleTransparencyData } from './GreyscaleTransparencyData';
import { TruecolorTransparencyData } from './TruecolorTransparencyData';
import { IndexedColorTransparencyData } from './IndexedColorTransparencyData';


export type TransparencyData<$T extends ColorType = ColorType, $V = void>
	= $T extends ColorType.greyscale ? GreyscaleTransparencyData
	: $T extends ColorType.truecolor ? TruecolorTransparencyData
	: $T extends ColorType.indexed_color ? IndexedColorTransparencyData
	: never
	;
export namespace TransparencyData {
	
	export function $encode<$T extends ColorType = ColorType, $V = void>($state: $State, $case: $T, $inst: TransparencyData<$T, $V>) {
		switch ($case) {
			case ColorType.greyscale: return void GreyscaleTransparencyData.$encode($state, $inst as GreyscaleTransparencyData);
			case ColorType.truecolor: return void TruecolorTransparencyData.$encode($state, $inst as TruecolorTransparencyData);
			case ColorType.indexed_color: return void IndexedColorTransparencyData.$encode($state, $inst as IndexedColorTransparencyData);
			default: return void $state.fatal(`TransparencyData: Encountered invalid case: ${$case}`);
		}
	}
	
	export function $decode<$T extends ColorType = ColorType, $V = void>($state: $State, $case: $T, $void: $V = void 0) : TransparencyData<$T, $V> {
		switch ($case) {
			case ColorType.greyscale: return GreyscaleTransparencyData.$decode($state) as TransparencyData<$T, $V>;
			case ColorType.truecolor: return TruecolorTransparencyData.$decode($state) as TransparencyData<$T, $V>;
			case ColorType.indexed_color: return IndexedColorTransparencyData.$decode($state) as TransparencyData<$T, $V>;
			default: return void $state.fatal(`TransparencyData: Encountered invalid case: ${$case}`);
		}
	}
}
