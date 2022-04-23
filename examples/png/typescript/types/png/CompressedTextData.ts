
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.381Z
*/

import { $State } from '../../utils';


export interface CompressedTextData {
	keyword: string;
	compression_method: number;
	compressed_text: number[];
}
export namespace CompressedTextData {
	
	export function $encode($state: $State, $inst: CompressedTextData) {
		$state.here.node = $inst;
		$state.step_down('keyword', $inst.keyword);
		$state.fatal('not supported')
		$state.step_up();
		$state.step_down('compression_method', $inst.compression_method);
		$state.write_to.write_u8($inst.compression_method);
		$state.step_up();
		$state.step_down('compressed_text', $inst.compressed_text);
		$state.fatal('not supported')
		$state.step_up();
	}
	
	export function $decode($state: $State) : CompressedTextData {
		const $inst = { } as CompressedTextData;
		$state.here.node = $inst;
		$state.step_down('keyword');
		$inst.keyword = $state.read_from.read_ascii_null_term()
		$state.step_up();
		$state.step_down('compression_method');
		$inst.compression_method = $state.read_from.read_u8()
		$state.step_up();
		$state.step_down('compressed_text');
		$inst.compressed_text = $state.read_from.read_array_take_remaining(() => $state.read_from.read_u8())
		$state.step_up();
		return $inst;
	}
}
