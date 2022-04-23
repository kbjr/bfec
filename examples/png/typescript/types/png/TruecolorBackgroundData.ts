
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.114Z
*/

import { $State } from '../../utils';


export interface TruecolorBackgroundData {
	red: number;
	green: number;
	blue: number;
}
export namespace TruecolorBackgroundData {
	
	export function $encode($state: $State, $inst: TruecolorBackgroundData) {
		$state.step_down('red', $inst.red);
		$state.write_to.write_u16_be($inst.red);
		$state.step_up();
		$state.step_down('green', $inst.green);
		$state.write_to.write_u16_be($inst.green);
		$state.step_up();
		$state.step_down('blue', $inst.blue);
		$state.write_to.write_u16_be($inst.blue);
		$state.step_up();
	}
	
	export function $decode($state: $State) : TruecolorBackgroundData {
		const $inst = { } as TruecolorBackgroundData;
		$state.step_down('red');
		$inst.red = $state.read_from.read_u16_be()
		$state.step_up();
		$state.step_down('green');
		$inst.green = $state.read_from.read_u16_be()
		$state.step_up();
		$state.step_down('blue');
		$inst.blue = $state.read_from.read_u16_be()
		$state.step_up();
		return $inst;
	}
}
