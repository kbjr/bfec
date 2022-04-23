
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.382Z
*/

import { $State } from '../../utils';


export interface Sample8Bit {
	red: number;
	green: number;
	blue: number;
	alpha: number;
}
export namespace Sample8Bit {
	
	export function $encode($state: $State, $inst: Sample8Bit) {
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
		$state.step_down('alpha', $inst.alpha);
		$state.write_to.write_u8($inst.alpha);
		$state.step_up();
	}
	
	export function $decode($state: $State) : Sample8Bit {
		const $inst = { } as Sample8Bit;
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
		$state.step_down('alpha');
		$inst.alpha = $state.read_from.read_u8()
		$state.step_up();
		return $inst;
	}
}
