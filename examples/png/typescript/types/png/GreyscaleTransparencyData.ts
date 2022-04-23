
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.113Z
*/

import { $State } from '../../utils';


export interface GreyscaleTransparencyData {
	grey_sample: number;
}
export namespace GreyscaleTransparencyData {
	
	export function $encode($state: $State, $inst: GreyscaleTransparencyData) {
		$state.step_down('grey_sample', $inst.grey_sample);
		$state.write_to.write_u16_be($inst.grey_sample);
		$state.step_up();
	}
	
	export function $decode($state: $State) : GreyscaleTransparencyData {
		const $inst = { } as GreyscaleTransparencyData;
		$state.step_down('grey_sample');
		$inst.grey_sample = $state.read_from.read_u16_be()
		$state.step_up();
		return $inst;
	}
}
