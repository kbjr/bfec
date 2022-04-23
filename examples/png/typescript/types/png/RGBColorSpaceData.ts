
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.381Z
*/

import { $State } from '../../utils';
import { RGBRenderingIntent } from './RGBRenderingIntent';


export interface RGBColorSpaceData {
	rendering_intent: RGBRenderingIntent;
}
export namespace RGBColorSpaceData {
	
	export function $encode($state: $State, $inst: RGBColorSpaceData) {
		$state.here.node = $inst;
		$state.step_down('rendering_intent', $inst.rendering_intent);
		RGBRenderingIntent.$encode_aligned($state, $inst.rendering_intent);
		$state.step_up();
	}
	
	export function $decode($state: $State) : RGBColorSpaceData {
		const $inst = { } as RGBColorSpaceData;
		$state.here.node = $inst;
		$state.step_down('rendering_intent');
		$inst.rendering_intent = RGBRenderingIntent.$decode_aligned($state)
		$state.step_up();
		return $inst;
	}
}
