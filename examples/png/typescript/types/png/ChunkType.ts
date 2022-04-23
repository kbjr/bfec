
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.115Z
*/

import { $State } from '../../utils';

export enum ChunkType {
	IHDR = "IHDR",
	PLTE = "PLTE",
	IDAT = "IDAT",
	IEND = "IEND",
	tRNS = "tRNS",
	cHRM = "cHRM",
	gAMA = "gAMA",
	iCCP = "iCCP",
	sBIT = "sBIT",
	sRGB = "sRGB",
	tEXt = "tEXt",
	xTXt = "xTXt",
	iTXt = "iTXt",
	bKGD = "bKGD",
	hIST = "hIST",
	pHYs = "pHYs",
	sPLT = "sPLT",
	tIME = "tIME",
}
export namespace ChunkType {
	
	export function $encode_aligned($state: $State, $value: ChunkType) {
		$state.fatal('not supported')
	}
	
	export function $encode_unaligned($state: $State, $value: ChunkType) {
		$state.fatal('Cannot encode unaligned text field')
	}
	
	export function $decode_aligned($state: $State) : ChunkType {
		return $state.read_from.as_ascii($state.read_from.take_bytes(4, false)) as ChunkType;
	}
	
	export function $decode_unaligned($state: $State) : ChunkType {
		$state.fatal('Cannot decode unaligned text field');
	}
}
