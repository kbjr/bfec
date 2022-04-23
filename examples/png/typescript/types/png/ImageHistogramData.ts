
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.382Z
*/

import { $State } from '../../utils';


export interface ImageHistogramData {
	frequencies: number[];
}
export namespace ImageHistogramData {
	
	export function $encode($state: $State, $inst: ImageHistogramData) {
		$state.here.node = $inst;
		$state.step_down('frequencies', $inst.frequencies);
		$state.fatal('not supported')
		$state.step_up();
	}
	
	export function $decode($state: $State) : ImageHistogramData {
		const $inst = { } as ImageHistogramData;
		$state.here.node = $inst;
		$state.step_down('frequencies');
		$inst.frequencies = $state.read_from.read_array_take_remaining(() => $state.read_from.read_u16_be())
		$state.step_up();
		return $inst;
	}
}
