
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-19T07:40:18.197Z
*/


import { $State, $align } from '../../utils';

export interface $ {
	
	/**
	 Magic bytes at the start of the file to identify the file as a PNG
	@bfec_type `"\x89\x50\x4e\x47\x0d\x0a\x1a\x0a"`
	*/
	magic_number: "\x89\x50\x4e\x47\x0d\x0a\x1a\x0a";
	
	/**
	 The image header is always the first chunk in a PNG image. It contains
	 general metadata like the image dimensions and compression method
	@bfec_type `undefined`
	*/
	header: undefined;
	// TODO: struct fields not yet implemented
	
	/**
	@bfec_type `undefined`
	*/
	chunks: undefined;
}


/**

The root of a PNG image

https://www.w3.org/TR/PNG

@bfec_type `struct $`
*/
export class $ {
	public [$align] : true = true;

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
