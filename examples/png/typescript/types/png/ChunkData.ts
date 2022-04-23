
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T05:05:33.452Z
*/

import { $State } from '../../utils';
import { ChunkType } from './ChunkType';


export type ChunkData<$T extends ChunkType = ChunkType, $V = void>
	= $T extends ChunkType.IHDR ? never
	: $T extends ChunkType.PLTE ? never[]
	: $T extends ChunkType.IDAT ? $V
	: $T extends ChunkType.IEND ? $V
	: $T extends ChunkType.tRNS ? never
	: $T extends ChunkType.cHRM ? never
	: $T extends ChunkType.gAMA ? never
	: $T extends ChunkType.iCCP ? never
	: $T extends ChunkType.sBIT ? never
	: $T extends ChunkType.sRGB ? never
	: $T extends ChunkType.tEXt ? never
	: $T extends ChunkType.xTXt ? never
	: $T extends ChunkType.iTXt ? never
	: $T extends ChunkType.bKGD ? never
	: $T extends ChunkType.hIST ? never
	: $T extends ChunkType.pHYs ? never
	: $T extends ChunkType.sPLT ? never
	: $T extends ChunkType.tIME ? never
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
