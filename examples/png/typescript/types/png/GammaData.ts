
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.114Z
*/

import { $State } from '../../utils';


export interface GammaData {
	image_gamma: number;
}
export namespace GammaData {
	
	export function $encode($state: $State, $inst: GammaData) {
		$state.step_down('image_gamma', $inst.image_gamma);
		$state.write_to.write_u32_be($inst.image_gamma);
		$state.step_up();
	}
	
	export function $decode($state: $State) : GammaData {
		const $inst = { } as GammaData;
		$state.step_down('image_gamma');
		$inst.image_gamma = $state.read_from.read_u32_be()
		$state.step_up();
		return $inst;
	}
}
