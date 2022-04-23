
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.381Z
*/

import { $State } from '../../utils';


export interface TextData {
	keyword: string;
	text: string;
}
export namespace TextData {
	
	export function $encode($state: $State, $inst: TextData) {
		$state.here.node = $inst;
		$state.step_down('keyword', $inst.keyword);
		$state.fatal('not supported')
		$state.step_up();
		$state.step_down('text', $inst.text);
		$state.fatal('not supported')
		$state.step_up();
	}
	
	export function $decode($state: $State) : TextData {
		const $inst = { } as TextData;
		$state.here.node = $inst;
		$state.step_down('keyword');
		$inst.keyword = $state.read_from.read_ascii_null_term()
		$state.step_up();
		$state.step_down('text');
		$state.fatal('not supported');
		$state.step_up();
		return $inst;
	}
}
