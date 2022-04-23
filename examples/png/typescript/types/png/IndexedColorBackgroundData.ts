
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.381Z
*/

import { $State } from '../../utils';


export interface IndexedColorBackgroundData {
	pallete_index: number;
}
export namespace IndexedColorBackgroundData {
	
	export function $encode($state: $State, $inst: IndexedColorBackgroundData) {
		$state.here.node = $inst;
		$state.step_down('pallete_index', $inst.pallete_index);
		$state.write_to.write_u8($inst.pallete_index);
		$state.step_up();
	}
	
	export function $decode($state: $State) : IndexedColorBackgroundData {
		const $inst = { } as IndexedColorBackgroundData;
		$state.here.node = $inst;
		$state.step_down('pallete_index');
		$inst.pallete_index = $state.read_from.read_u8()
		$state.step_up();
		return $inst;
	}
}
