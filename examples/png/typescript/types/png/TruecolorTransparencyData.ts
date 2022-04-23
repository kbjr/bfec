
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.113Z
*/

import { $State } from '../../utils';


export interface TruecolorTransparencyData {
	red_sample: number;
	green_sample: number;
	blue_sample: number;
}
export namespace TruecolorTransparencyData {
	
	export function $encode($state: $State, $inst: TruecolorTransparencyData) {
		$state.step_down('red_sample', $inst.red_sample);
		$state.write_to.write_u16_be($inst.red_sample);
		$state.step_up();
		$state.step_down('green_sample', $inst.green_sample);
		$state.write_to.write_u16_be($inst.green_sample);
		$state.step_up();
		$state.step_down('blue_sample', $inst.blue_sample);
		$state.write_to.write_u16_be($inst.blue_sample);
		$state.step_up();
	}
	
	export function $decode($state: $State) : TruecolorTransparencyData {
		const $inst = { } as TruecolorTransparencyData;
		$state.step_down('red_sample');
		$inst.red_sample = $state.read_from.read_u16_be()
		$state.step_up();
		$state.step_down('green_sample');
		$inst.green_sample = $state.read_from.read_u16_be()
		$state.step_up();
		$state.step_down('blue_sample');
		$inst.blue_sample = $state.read_from.read_u16_be()
		$state.step_up();
		return $inst;
	}
}
