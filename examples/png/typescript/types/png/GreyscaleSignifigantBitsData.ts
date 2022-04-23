
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.114Z
*/

import { $State } from '../../utils';


export interface GreyscaleSignifigantBitsData {
	signifigant_greyscale_bits: number;
	signifigant_alpha_bits: number;
}
export namespace GreyscaleSignifigantBitsData {
	
	export function $encode($state: $State, $inst: GreyscaleSignifigantBitsData) {
		$state.step_down('signifigant_greyscale_bits', $inst.signifigant_greyscale_bits);
		$state.write_to.write_u8($inst.signifigant_greyscale_bits);
		$state.step_up();
		$state.step_down('signifigant_alpha_bits', $inst.signifigant_alpha_bits);
		$state.write_to.write_u8($inst.signifigant_alpha_bits);
		$state.step_up();
	}
	
	export function $decode($state: $State) : GreyscaleSignifigantBitsData {
		const $inst = { } as GreyscaleSignifigantBitsData;
		$state.step_down('signifigant_greyscale_bits');
		$inst.signifigant_greyscale_bits = $state.read_from.read_u8()
		$state.step_up();
		$state.step_down('signifigant_alpha_bits');
		$inst.signifigant_alpha_bits = $state.read_from.read_u8()
		$state.step_up();
		return $inst;
	}
}
