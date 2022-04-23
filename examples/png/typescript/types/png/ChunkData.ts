
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.115Z
*/

import { $State } from '../../utils';
import { ChunkType } from './ChunkType';
import { Pallete } from './Pallete';


export type ChunkData<$T extends ChunkType = ChunkType, $V = void>
	= $T extends ChunkType.IHDR ? ImageHeader
	: $T extends ChunkType.PLTE ? Pallete[]
	: $T extends ChunkType.IDAT ? $V
	: $T extends ChunkType.IEND ? $V
	: $T extends ChunkType.tRNS ? TransparencyData
	: $T extends ChunkType.cHRM ? PrimaryChromaticitiesAndWhitePointData
	: $T extends ChunkType.gAMA ? GammaData
	: $T extends ChunkType.iCCP ? EmbeddedICCProfileData
	: $T extends ChunkType.sBIT ? SignifigantBitsData
	: $T extends ChunkType.sRGB ? RGBColorSpaceData
	: $T extends ChunkType.tEXt ? TextData
	: $T extends ChunkType.xTXt ? CompressedTextData
	: $T extends ChunkType.iTXt ? InternationalTextData
	: $T extends ChunkType.bKGD ? BackgroundColorData
	: $T extends ChunkType.hIST ? ImageHistogramData
	: $T extends ChunkType.pHYs ? PhysicalPixelDimensionsData
	: $T extends ChunkType.sPLT ? SuggestedPalleteData
	: $T extends ChunkType.tIME ? LastModifiedTimestampData
	: $V
	;
export namespace ChunkData {
	
	export function $encode<$T extends ChunkType = ChunkType>($state: $State, $case: $T, $inst: ChunkData<$T>) {
		switch ($case) {
			case ChunkType.IHDR: ImageHeader.$encode($state, $inst)
			case ChunkType.PLTE: $state.fatal('not supported')
			case ChunkType.IDAT: return void ($inst != null && $state.write_inst_somehow($inst));
			case ChunkType.IEND: return void ($inst != null && $state.write_inst_somehow($inst));
			case ChunkType.tRNS: $state.fatal('Failed to compile switch encoder');
			case ChunkType.cHRM: PrimaryChromaticitiesAndWhitePointData.$encode($state, $inst)
			case ChunkType.gAMA: GammaData.$encode($state, $inst)
			case ChunkType.iCCP: EmbeddedICCProfileData.$encode($state, $inst)
			case ChunkType.sBIT: $state.fatal('Failed to compile switch encoder');
			case ChunkType.sRGB: RGBColorSpaceData.$encode($state, $inst)
			case ChunkType.tEXt: TextData.$encode($state, $inst)
			case ChunkType.xTXt: CompressedTextData.$encode($state, $inst)
			case ChunkType.iTXt: InternationalTextData.$encode($state, $inst)
			case ChunkType.bKGD: $state.fatal('Failed to compile switch encoder');
			case ChunkType.hIST: ImageHistogramData.$encode($state, $inst)
			case ChunkType.pHYs: PhysicalPixelDimensionsData.$encode($state, $inst)
			case ChunkType.sPLT: SuggestedPalleteData.$encode($state, $inst)
			case ChunkType.tIME: LastModifiedTimestampData.$encode($state, $inst)
			default: return void ($inst != null && $state.write_inst_somehow($inst));
		}
	}
	
	export function $decode<$T extends ChunkType = ChunkType>($state: $State, $case: $T) : ChunkData<$T> {
		switch ($case) {
			case ChunkType.IHDR: return ImageHeader.$decode($state);
			case ChunkType.PLTE: return $state.read_from.read_array_take_remaining(() => Pallete.$decode($state));
			case ChunkType.IDAT: return void 0;
			case ChunkType.IEND: return void 0;
			case ChunkType.tRNS: $state.fatal('Failed to compile switch decoder');
			case ChunkType.cHRM: return PrimaryChromaticitiesAndWhitePointData.$decode($state);
			case ChunkType.gAMA: return GammaData.$decode($state);
			case ChunkType.iCCP: return EmbeddedICCProfileData.$decode($state);
			case ChunkType.sBIT: $state.fatal('Failed to compile switch decoder');
			case ChunkType.sRGB: return RGBColorSpaceData.$decode($state);
			case ChunkType.tEXt: return TextData.$decode($state);
			case ChunkType.xTXt: return CompressedTextData.$decode($state);
			case ChunkType.iTXt: return InternationalTextData.$decode($state);
			case ChunkType.bKGD: $state.fatal('Failed to compile switch decoder');
			case ChunkType.hIST: return ImageHistogramData.$decode($state);
			case ChunkType.pHYs: return PhysicalPixelDimensionsData.$decode($state);
			case ChunkType.sPLT: return SuggestedPalleteData.$decode($state);
			case ChunkType.tIME: return LastModifiedTimestampData.$decode($state);
			default: return void 0;
		}
	}
}
