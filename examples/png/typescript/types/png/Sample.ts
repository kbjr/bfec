
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.382Z
*/

import { $State } from '../../utils';
import { SampleDepth } from './SampleDepth';
import { Sample8Bit } from './Sample8Bit';
import { Sample16Bit } from './Sample16Bit';


export type Sample<$T extends SampleDepth = SampleDepth, $V = void>
	= $T extends SampleDepth.b8 ? Sample8Bit
	: $T extends SampleDepth.b16 ? Sample16Bit
	: never
	;
export namespace Sample {
	
	export function $encode<$T extends SampleDepth = SampleDepth, $V = void>($state: $State, $case: $T, $inst: Sample<$T, $V>) {
		switch ($case) {
			case SampleDepth.b8: return void Sample8Bit.$encode($state, $inst as Sample8Bit);
			case SampleDepth.b16: return void Sample16Bit.$encode($state, $inst as Sample16Bit);
			default: return void $state.fatal(`Sample: Encountered invalid case: ${$case}`);
		}
	}
	
	export function $decode<$T extends SampleDepth = SampleDepth, $V = void>($state: $State, $case: $T, $void: $V = void 0) : Sample<$T, $V> {
		switch ($case) {
			case SampleDepth.b8: return Sample8Bit.$decode($state) as Sample<$T, $V>;
			case SampleDepth.b16: return Sample16Bit.$decode($state) as Sample<$T, $V>;
			default: return void $state.fatal(`Sample: Encountered invalid case: ${$case}`);
		}
	}
}
