
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.113Z
*/

import { $State } from '../../utils';


export interface IndexedColorTransparencyData {
	alpha_values: number[];
}
export namespace IndexedColorTransparencyData {
	
	export function $encode($state: $State, $inst: IndexedColorTransparencyData) {
		$state.step_down('alpha_values', $inst.alpha_values);
		$state.fatal('not supported')
		$state.step_up();
	}
	
	export function $decode($state: $State) : IndexedColorTransparencyData {
		const $inst = { } as IndexedColorTransparencyData;
		$state.step_down('alpha_values');
		$inst.alpha_values = $state.read_from.read_array_take_remaining(() => $state.read_from.read_u8())
		$state.step_up();
		return $inst;
	}
}
