
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-17T04:06:19.181Z
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
