
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.113Z
*/

import { $State } from '../../utils';


export interface PrimaryChromaticitiesAndWhitePointData {
	white_point_x: number;
	white_point_y: number;
	red_x: number;
	red_y: number;
	green_x: number;
	green_y: number;
	blue_x: number;
	blue_y: number;
}
export namespace PrimaryChromaticitiesAndWhitePointData {
	
	export function $encode($state: $State, $inst: PrimaryChromaticitiesAndWhitePointData) {
		$state.step_down('white_point_x', $inst.white_point_x);
		$state.write_to.write_u32_be($inst.white_point_x);
		$state.step_up();
		$state.step_down('white_point_y', $inst.white_point_y);
		$state.write_to.write_u32_be($inst.white_point_y);
		$state.step_up();
		$state.step_down('red_x', $inst.red_x);
		$state.write_to.write_u32_be($inst.red_x);
		$state.step_up();
		$state.step_down('red_y', $inst.red_y);
		$state.write_to.write_u32_be($inst.red_y);
		$state.step_up();
		$state.step_down('green_x', $inst.green_x);
		$state.write_to.write_u32_be($inst.green_x);
		$state.step_up();
		$state.step_down('green_y', $inst.green_y);
		$state.write_to.write_u32_be($inst.green_y);
		$state.step_up();
		$state.step_down('blue_x', $inst.blue_x);
		$state.write_to.write_u32_be($inst.blue_x);
		$state.step_up();
		$state.step_down('blue_y', $inst.blue_y);
		$state.write_to.write_u32_be($inst.blue_y);
		$state.step_up();
	}
	
	export function $decode($state: $State) : PrimaryChromaticitiesAndWhitePointData {
		const $inst = { } as PrimaryChromaticitiesAndWhitePointData;
		$state.step_down('white_point_x');
		$inst.white_point_x = $state.read_from.read_u32_be()
		$state.step_up();
		$state.step_down('white_point_y');
		$inst.white_point_y = $state.read_from.read_u32_be()
		$state.step_up();
		$state.step_down('red_x');
		$inst.red_x = $state.read_from.read_u32_be()
		$state.step_up();
		$state.step_down('red_y');
		$inst.red_y = $state.read_from.read_u32_be()
		$state.step_up();
		$state.step_down('green_x');
		$inst.green_x = $state.read_from.read_u32_be()
		$state.step_up();
		$state.step_down('green_y');
		$inst.green_y = $state.read_from.read_u32_be()
		$state.step_up();
		$state.step_down('blue_x');
		$inst.blue_x = $state.read_from.read_u32_be()
		$state.step_up();
		$state.step_down('blue_y');
		$inst.blue_y = $state.read_from.read_u32_be()
		$state.step_up();
		return $inst;
	}
}
