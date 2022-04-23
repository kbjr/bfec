
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.114Z
*/

import { $State } from '../../utils';


export interface RGBColorSpaceData {
	rendering_intent: RGBRenderingIntent;
}
export namespace RGBColorSpaceData {
	
	export function $encode($state: $State, $inst: RGBColorSpaceData) {
		$state.step_down('rendering_intent', $inst.rendering_intent);
		RGBRenderingIntent.$encode_aligned($state, $inst.rendering_intent);
		$state.step_up();
	}
	
	export function $decode($state: $State) : RGBColorSpaceData {
		const $inst = { } as RGBColorSpaceData;
		$state.step_down('rendering_intent');
		$inst.rendering_intent = RGBRenderingIntent.$decode_aligned($state)
		$state.step_up();
		return $inst;
	}
}
