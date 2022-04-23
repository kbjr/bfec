
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.114Z
*/

import { $State } from '../../utils';


export interface Sample16Bit {
	red: number;
	green: number;
	blue: number;
	alpha: number;
}
export namespace Sample16Bit {
	
	export function $encode($state: $State, $inst: Sample16Bit) {
		$state.step_down('red', $inst.red);
		$state.write_to.write_u16_be($inst.red);
		$state.step_up();
		$state.step_down('green', $inst.green);
		$state.write_to.write_u16_be($inst.green);
		$state.step_up();
		$state.step_down('blue', $inst.blue);
		$state.write_to.write_u16_be($inst.blue);
		$state.step_up();
		$state.step_down('alpha', $inst.alpha);
		$state.write_to.write_u16_be($inst.alpha);
		$state.step_up();
	}
	
	export function $decode($state: $State) : Sample16Bit {
		const $inst = { } as Sample16Bit;
		$state.step_down('red');
		$inst.red = $state.read_from.read_u16_be()
		$state.step_up();
		$state.step_down('green');
		$inst.green = $state.read_from.read_u16_be()
		$state.step_up();
		$state.step_down('blue');
		$inst.blue = $state.read_from.read_u16_be()
		$state.step_up();
		$state.step_down('alpha');
		$inst.alpha = $state.read_from.read_u16_be()
		$state.step_up();
		return $inst;
	}
}
