
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-20T02:57:14.578Z
*/


import { $State, $align, $UnprocessedSlice } from '../../utils';

import { ChunkType } from './ChunkType';
import { ChunkData } from './ChunkData';


/**

*/
export interface Chunk {
	
}

export interface Chunk<type extends ChunkType = ChunkType> {
	
	/**
	 The length of the `data` field (in bytes)
	@bfec_type `undefined`
	*/
	length: undefined;
	
	/**
	 Identifies the type of data contained in this chunk
	@bfec_type `ChunkType`
	*/
	
	/**
	 The actual chunk data
	@bfec_type `undefined -> undefined`
	*/
	data: $UnprocessedSlice<ChunkData> | ChunkData;
	
	/**
	 CRC32 checksum of the `data` field for validation
	@bfec_type `checksum<u32_be>(@.data, 'crc32')`
	*/
	crc: undefined;
}


/**
@bfec_type `struct Chunk`
*/
export class Chunk {
	public [$align] : true = true;

	public static $encode($state: $State, $inst: Chunk) {
		
		
	}
	
	// TODO: Handle variants
	public static $decode($state: $State) : Chunk {
		const $inst = new Chunk();
		
		
		return $inst;
	}
}
