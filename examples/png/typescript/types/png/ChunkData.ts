
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-21T06:09:08.779Z
*/

import { $State } from '../../utils';
import { ChunkType } from './ChunkType';


export type ChunkData<$T extends ChunkType = ChunkType, $V = void>
	= $T extends ChunkType.IHDR ? unknown
	: $T extends ChunkType.PLTE ? unknown
	: $T extends ChunkType.IDAT ? $V
	: $T extends ChunkType.IEND ? $V
	: $T extends ChunkType.tRNS ? unknown
	: $T extends ChunkType.cHRM ? unknown
	: $T extends ChunkType.gAMA ? unknown
	: $T extends ChunkType.iCCP ? unknown
	: $T extends ChunkType.sBIT ? unknown
	: $T extends ChunkType.sRGB ? unknown
	: $T extends ChunkType.tEXt ? unknown
	: $T extends ChunkType.xTXt ? unknown
	: $T extends ChunkType.iTXt ? unknown
	: $T extends ChunkType.bKGD ? unknown
	: $T extends ChunkType.hIST ? unknown
	: $T extends ChunkType.pHYs ? unknown
	: $T extends ChunkType.sPLT ? unknown
	: $T extends ChunkType.tIME ? unknown
	: $V
	;
export namespace ChunkData {
	
	export function $encode<$T extends ChunkType = ChunkType>($state: $State, $case: $T, $inst: ChunkData<$T>) {
		switch ($case) {
			case ChunkType.IHDR: $state.fatal('Switch case failed to compile');
			case ChunkType.PLTE: $state.fatal(`Not yet implemented`);
			case ChunkType.IDAT: return void ($inst != null && $state.write_inst_somehow($inst));
			case ChunkType.IEND: return void ($inst != null && $state.write_inst_somehow($inst));
			case ChunkType.tRNS: $state.fatal('Switch case failed to compile');
			case ChunkType.cHRM: $state.fatal('Switch case failed to compile');
			case ChunkType.gAMA: $state.fatal('Switch case failed to compile');
			case ChunkType.iCCP: $state.fatal('Switch case failed to compile');
			case ChunkType.sBIT: $state.fatal('Switch case failed to compile');
			case ChunkType.sRGB: $state.fatal('Switch case failed to compile');
			case ChunkType.tEXt: $state.fatal('Switch case failed to compile');
			case ChunkType.xTXt: $state.fatal('Switch case failed to compile');
			case ChunkType.iTXt: $state.fatal('Switch case failed to compile');
			case ChunkType.bKGD: $state.fatal('Switch case failed to compile');
			case ChunkType.hIST: $state.fatal('Switch case failed to compile');
			case ChunkType.pHYs: $state.fatal('Switch case failed to compile');
			case ChunkType.sPLT: $state.fatal('Switch case failed to compile');
			case ChunkType.tIME: $state.fatal('Switch case failed to compile');
			default: return void 0;
		}
	}
	
	export function $decode() {
		
	}
}
