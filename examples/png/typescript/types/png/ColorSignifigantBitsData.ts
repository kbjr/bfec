
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.381Z
*/

import { $State } from '../../utils';


export interface ColorSignifigantBitsData {
	signifigant_red_bits: number;
	signifigant_green_bits: number;
	signifigant_blue_bits: number;
	signifigant_alpha_bits: number;
}
export namespace ColorSignifigantBitsData {
	
	export function $encode($state: $State, $inst: ColorSignifigantBitsData) {
		$state.here.node = $inst;
		$state.step_down('signifigant_red_bits', $inst.signifigant_red_bits);
		$state.write_to.write_u8($inst.signifigant_red_bits);
		$state.step_up();
		$state.step_down('signifigant_green_bits', $inst.signifigant_green_bits);
		$state.write_to.write_u8($inst.signifigant_green_bits);
		$state.step_up();
		$state.step_down('signifigant_blue_bits', $inst.signifigant_blue_bits);
		$state.write_to.write_u8($inst.signifigant_blue_bits);
		$state.step_up();
		$state.step_down('signifigant_alpha_bits', $inst.signifigant_alpha_bits);
		$state.write_to.write_u8($inst.signifigant_alpha_bits);
		$state.step_up();
	}
	
	export function $decode($state: $State) : ColorSignifigantBitsData {
		const $inst = { } as ColorSignifigantBitsData;
		$state.here.node = $inst;
		$state.step_down('signifigant_red_bits');
		$inst.signifigant_red_bits = $state.read_from.read_u8()
		$state.step_up();
		$state.step_down('signifigant_green_bits');
		$inst.signifigant_green_bits = $state.read_from.read_u8()
		$state.step_up();
		$state.step_down('signifigant_blue_bits');
		$inst.signifigant_blue_bits = $state.read_from.read_u8()
		$state.step_up();
		$state.step_down('signifigant_alpha_bits');
		$inst.signifigant_alpha_bits = $state.read_from.read_u8()
		$state.step_up();
		return $inst;
	}
}
