
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.115Z
*/

import { $State } from '../../utils';
import { ColorType } from './ColorType';


export type TransparencyData<$T extends ColorType = ColorType, $V = void>
	= $T extends ColorType.greyscale ? GreyscaleTransparencyData
	: $T extends ColorType.truecolor ? TruecolorTransparencyData
	: $T extends ColorType.indexed_color ? IndexedColorTransparencyData
	: never
	;
export namespace TransparencyData {
	
	export function $encode<$T extends ColorType = ColorType>($state: $State, $case: $T, $inst: TransparencyData<$T>) {
		switch ($case) {
			case ColorType.greyscale: GreyscaleTransparencyData.$encode($state, $inst)
			case ColorType.truecolor: TruecolorTransparencyData.$encode($state, $inst)
			case ColorType.indexed_color: IndexedColorTransparencyData.$encode($state, $inst)
			default: $state.fatal(`TransparencyData: Encountered invalid case: ${$case}`);
		}
	}
	
	export function $decode<$T extends ColorType = ColorType>($state: $State, $case: $T) : TransparencyData<$T> {
		switch ($case) {
			case ColorType.greyscale: return GreyscaleTransparencyData.$decode($state);
			case ColorType.truecolor: return TruecolorTransparencyData.$decode($state);
			case ColorType.indexed_color: return IndexedColorTransparencyData.$decode($state);
			default: $state.fatal(`TransparencyData: Encountered invalid case: ${$case}`);
		}
	}
}
