
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.382Z
*/

import { $State } from '../../utils';
import { PixelDimensionUnit } from './PixelDimensionUnit';


export interface PhysicalPixelDimensionsData {
	ppu_x: number;
	ppu_y: number;
	unit: PixelDimensionUnit;
}
export namespace PhysicalPixelDimensionsData {
	
	export function $encode($state: $State, $inst: PhysicalPixelDimensionsData) {
		$state.here.node = $inst;
		$state.step_down('ppu_x', $inst.ppu_x);
		$state.write_to.write_u32_be($inst.ppu_x);
		$state.step_up();
		$state.step_down('ppu_y', $inst.ppu_y);
		$state.write_to.write_u32_be($inst.ppu_y);
		$state.step_up();
		$state.step_down('unit', $inst.unit);
		PixelDimensionUnit.$encode_aligned($state, $inst.unit);
		$state.step_up();
	}
	
	export function $decode($state: $State) : PhysicalPixelDimensionsData {
		const $inst = { } as PhysicalPixelDimensionsData;
		$state.here.node = $inst;
		$state.step_down('ppu_x');
		$inst.ppu_x = $state.read_from.read_u32_be()
		$state.step_up();
		$state.step_down('ppu_y');
		$inst.ppu_y = $state.read_from.read_u32_be()
		$state.step_up();
		$state.step_down('unit');
		$inst.unit = PixelDimensionUnit.$decode_aligned($state)
		$state.step_up();
		return $inst;
	}
}
