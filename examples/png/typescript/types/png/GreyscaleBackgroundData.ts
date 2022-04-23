
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.381Z
*/

import { $State } from '../../utils';


export interface GreyscaleBackgroundData {
	greyscale: number;
}
export namespace GreyscaleBackgroundData {
	
	export function $encode($state: $State, $inst: GreyscaleBackgroundData) {
		$state.here.node = $inst;
		$state.step_down('greyscale', $inst.greyscale);
		$state.write_to.write_u16_be($inst.greyscale);
		$state.step_up();
	}
	
	export function $decode($state: $State) : GreyscaleBackgroundData {
		const $inst = { } as GreyscaleBackgroundData;
		$state.here.node = $inst;
		$state.step_down('greyscale');
		$inst.greyscale = $state.read_from.read_u16_be()
		$state.step_up();
		return $inst;
	}
}
