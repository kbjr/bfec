
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.114Z
*/

import { $State } from '../../utils';


export interface ImageHistogramData {
	frequencies: number[];
}
export namespace ImageHistogramData {
	
	export function $encode($state: $State, $inst: ImageHistogramData) {
		$state.step_down('frequencies', $inst.frequencies);
		$state.fatal('not supported')
		$state.step_up();
	}
	
	export function $decode($state: $State) : ImageHistogramData {
		const $inst = { } as ImageHistogramData;
		$state.step_down('frequencies');
		$inst.frequencies = $state.read_from.read_array_take_remaining(() => $state.read_from.read_u16_be())
		$state.step_up();
		return $inst;
	}
}
