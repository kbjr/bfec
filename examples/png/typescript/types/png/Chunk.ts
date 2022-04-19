
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-19T07:40:18.198Z
*/


import { $State, $align } from '../../utils';

export interface Chunk {
	
	/**
	 The length of the `data` field (in bytes)
	@bfec_type `undefined`
	*/
	length: undefined;
	
	/**
	 Identifies the type of data contained in this chunk
	@bfec_type `ChunkType`
	*/
	type: undefined;
	// TODO: struct fields not yet implemented
	
	/**
	 The actual chunk data
	@bfec_type `undefined -> undefined`
	*/
	data: undefined;
	// TODO: struct fields not yet implemented
	
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
