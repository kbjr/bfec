
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-20T02:57:14.579Z
*/


import { $State } from '../../utils';

export enum ChunkType {
		
	/**
	 Image header
	*/
	IHDR = "IHDR",
	
	/**
	 Color pallete data
	*/
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
	export function $encode($state: $State, $value: ChunkType) {
		// 
	}

	export function $decode($state: $State) : ChunkType {
		// 
	}

	export const $set = new Set<ChunkType>([
		ChunkType.IHDR,
		ChunkType.PLTE,
		ChunkType.IDAT,
		ChunkType.IEND,
		ChunkType.tRNS,
		ChunkType.cHRM,
		ChunkType.gAMA,
		ChunkType.iCCP,
		ChunkType.sBIT,
		ChunkType.sRGB,
		ChunkType.tEXt,
		ChunkType.xTXt,
		ChunkType.iTXt,
		ChunkType.bKGD,
		ChunkType.hIST,
		ChunkType.pHYs,
		ChunkType.sPLT,
		ChunkType.tIME,
	]);

	export function $is_valid(value: string) : value is ChunkType {
		return $set.has(value as ChunkType);
	}
}

