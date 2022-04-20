
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-20T02:57:14.578Z
*/


import { $State } from '../../utils';


import { ChunkType as $Enum } from './ChunkType';


export type ChunkData<$T extends $Enum = $Enum>
	= $T extends $Enum.IHDR ? never
	: $T extends $Enum.PLTE ? never
	: $T extends $Enum.IDAT ? void
	: $T extends $Enum.IEND ? void
	: $T extends $Enum.tRNS ? never
	: $T extends $Enum.cHRM ? never
	: $T extends $Enum.gAMA ? never
	: $T extends $Enum.iCCP ? never
	: $T extends $Enum.sBIT ? never
	: $T extends $Enum.sRGB ? never
	: $T extends $Enum.tEXt ? never
	: $T extends $Enum.xTXt ? never
	: $T extends $Enum.iTXt ? never
	: $T extends $Enum.bKGD ? never
	: $T extends $Enum.hIST ? never
	: $T extends $Enum.pHYs ? never
	: $T extends $Enum.sPLT ? never
	: $T extends $Enum.tIME ? never
	: void
	;

export const ChunkData = Object.freeze({
	$decode<$T extends $Enum = $Enum>($state: $State, $case: $T) : ChunkData<$T> {
		switch ($case) {
			case $Enum.IHDR: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.PLTE: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.IDAT: return void 0;
			case $Enum.IEND: return void 0;
			case $Enum.tRNS: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.cHRM: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.gAMA: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.iCCP: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.sBIT: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.sRGB: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.tEXt: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.xTXt: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.iTXt: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.bKGD: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.hIST: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.pHYs: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.sPLT: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.tIME: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			default: return void 0;
		}
	},

	$encode<$T extends $Enum = $Enum>($state: $State, $case: $T, $inst: ChunkData<$T>) {
		switch ($case) {
			case $Enum.IHDR: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.PLTE: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.IDAT: return void 0;
			case $Enum.IEND: return void 0;
			case $Enum.tRNS: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.cHRM: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.gAMA: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.iCCP: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.sBIT: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.sRGB: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.tEXt: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.xTXt: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.iTXt: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.bKGD: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.hIST: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.pHYs: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.sPLT: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			case $Enum.tIME: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
			default: return void 0;
		}
	}
});
