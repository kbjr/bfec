
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-21T06:09:08.779Z
*/

import { $State } from '../../utils';
import { ChunkType } from './ChunkType';


export interface Chunk<type extends ChunkType = ChunkType> {
	length: number;
	type: ChunkType
	data: never;
	crc: number;
}
export namespace Chunk {
	
	export function $encode($state: $State, $inst: Chunk) {
		$state.step_down('length', $inst.length);
		undefined;
		$state.step_up();
		$state.step_down('type', $inst.type);
		ChunkType.$encode_aligned($state, $inst.type);
		$state.step_up();
		$state.step_down('data', $inst.data);
		$state.fatal('Failed to compile type refinement encoder');
		$state.step_up();
		$state.step_down('crc', $inst.crc);
		undefined;
		$state.step_up();
	}
	
	export function $decode($state: $State) : Chunk {
		const $inst = { } as Chunk;
		$state.step_down('length');
		$inst.length = undefined;
		$state.step_up();
		$state.step_down('type');
		$inst.type = $state.fatal('Failed to compile enum encoder');
		$state.step_up();
		$state.step_down('data');
		$inst.data = $state.fatal('Failed to compile type refinement decoder');
		$state.step_up();
		$state.step_down('crc');
		$inst.crc = undefined;
		$state.step_up();
		return $inst;
	}
}
