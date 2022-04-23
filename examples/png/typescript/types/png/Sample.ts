
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.115Z
*/

import { $State } from '../../utils';
import { SampleDepth } from './SampleDepth';


export type Sample<$T extends SampleDepth = SampleDepth, $V = void>
	= $T extends SampleDepth.b8 ? Sample8Bit
	: $T extends SampleDepth.b16 ? Sample16Bit
	: never
	;
export namespace Sample {
	
	export function $encode<$T extends SampleDepth = SampleDepth>($state: $State, $case: $T, $inst: Sample<$T>) {
		switch ($case) {
			case SampleDepth.b8: Sample8Bit.$encode($state, $inst)
			case SampleDepth.b16: Sample16Bit.$encode($state, $inst)
			default: $state.fatal(`Sample: Encountered invalid case: ${$case}`);
		}
	}
	
	export function $decode<$T extends SampleDepth = SampleDepth>($state: $State, $case: $T) : Sample<$T> {
		switch ($case) {
			case SampleDepth.b8: return Sample8Bit.$decode($state);
			case SampleDepth.b16: return Sample16Bit.$decode($state);
			default: $state.fatal(`Sample: Encountered invalid case: ${$case}`);
		}
	}
}
