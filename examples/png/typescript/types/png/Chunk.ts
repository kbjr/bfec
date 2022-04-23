
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.113Z
*/

import { $State } from '../../utils';
import { ChunkType } from './ChunkType';


export interface Chunk<type extends ChunkType = ChunkType> {
	length: number;
	type: ChunkType;
	data: never;
	crc: number;
}
export namespace Chunk {
	
	export function $encode($state: $State, $inst: Chunk) {
		$state.step_down('length', $inst.length);
		$state.fatal('not implemented')
		$state.step_up();
		$state.step_down('type', $inst.type);
		ChunkType.$encode_aligned($state, $inst.type);
		$state.step_up();
		$state.step_down('data', $inst.data);
		$state.fatal('Failed to compile type refinement encoder')
		$state.step_up();
		$state.step_down('crc', $inst.crc);
		$state.fatal('not implemented')
		$state.step_up();
	}
	
	export function $decode($state: $State) : Chunk {
		const $inst = { } as Chunk;
		$state.step_down('length');
		$state.fatal('not implemented')
		$state.step_up();
		$state.step_down('type');
		$inst.type = ChunkType.$decode_aligned($state)
		$state.step_up();
		$state.step_down('data');
		$state.fatal('Failed to compile type refinement decoder')
		$state.step_up();
		$state.step_down('crc');
		$state.fatal('not implemented')
		$state.step_up();
		return $inst;
	}
}
