
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-16T07:11:34.214Z
*/


import { $State } from '../../utils';

export interface $ {
	
}


/**

The root of a PNG image

https://www.w3.org/TR/PNG

*/
export class $ {
	public static $encode($state: $State, $inst: $) {
		$state.step_down('$', $inst);
		
	}
	
	// TODO: Handle variants
	public static $decode($state: $State) : $ {
		const $inst = new $();
		$state.step_down('$', $inst);
		
		return $inst;
	}
}
