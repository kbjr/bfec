
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.380Z
*/

import { $State } from '../../utils';


export interface Pallete {
	red: number;
	green: number;
	blue: number;
}
export namespace Pallete {
	
	export function $encode($state: $State, $inst: Pallete) {
		$state.here.node = $inst;
		$state.step_down('red', $inst.red);
		$state.write_to.write_u8($inst.red);
		$state.step_up();
		$state.step_down('green', $inst.green);
		$state.write_to.write_u8($inst.green);
		$state.step_up();
		$state.step_down('blue', $inst.blue);
		$state.write_to.write_u8($inst.blue);
		$state.step_up();
	}
	
	export function $decode($state: $State) : Pallete {
		const $inst = { } as Pallete;
		$state.here.node = $inst;
		$state.step_down('red');
		$inst.red = $state.read_from.read_u8()
		$state.step_up();
		$state.step_down('green');
		$inst.green = $state.read_from.read_u8()
		$state.step_up();
		$state.step_down('blue');
		$inst.blue = $state.read_from.read_u8()
		$state.step_up();
		return $inst;
	}
}
