
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.114Z
*/

import { $State } from '../../utils';


export interface SuggestedPalleteData extends Sample {
	pallete_name: string;
	sample_depth: SampleDepth;
	frequencies: number[];
}
export namespace SuggestedPalleteData {
	
	export function $encode($state: $State, $inst: SuggestedPalleteData) {
		$state.step_down('pallete_name', $inst.pallete_name);
		$state.fatal('not supported')
		$state.step_up();
		$state.step_down('sample_depth', $inst.sample_depth);
		SampleDepth.$encode_aligned($state, $inst.sample_depth);
		$state.step_up();
		// struct expansion not yet implemented
		$state.step_down('frequencies', $inst.frequencies);
		$state.fatal('not supported')
		$state.step_up();
		// struct expansion not yet implemented
	}
	
	export function $decode($state: $State) : SuggestedPalleteData {
		const $inst = { } as SuggestedPalleteData;
		$state.step_down('pallete_name');
		$inst.pallete_name = $state.read_from.read_ascii_null_term()
		$state.step_up();
		$state.step_down('sample_depth');
		$inst.sample_depth = SampleDepth.$decode_aligned($state)
		$state.step_up();
		$state.step_down('frequencies');
		$inst.frequencies = $state.read_from.read_array_take_remaining(() => $state.read_from.read_u16_be())
		$state.step_up();
		return $inst;
	}
}
