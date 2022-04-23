
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.382Z
*/

import { $State } from '../../utils';
import { ChunkType } from './ChunkType';
import { ImageHeader } from './ImageHeader';
import { Pallete } from './Pallete';
import { TransparencyData } from './TransparencyData';
import { PrimaryChromaticitiesAndWhitePointData } from './PrimaryChromaticitiesAndWhitePointData';
import { GammaData } from './GammaData';
import { EmbeddedICCProfileData } from './EmbeddedICCProfileData';
import { SignifigantBitsData } from './SignifigantBitsData';
import { RGBColorSpaceData } from './RGBColorSpaceData';
import { TextData } from './TextData';
import { CompressedTextData } from './CompressedTextData';
import { InternationalTextData } from './InternationalTextData';
import { BackgroundColorData } from './BackgroundColorData';
import { ImageHistogramData } from './ImageHistogramData';
import { PhysicalPixelDimensionsData } from './PhysicalPixelDimensionsData';
import { SuggestedPalleteData } from './SuggestedPalleteData';
import { LastModifiedTimestampData } from './LastModifiedTimestampData';


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
	
	export function $encode<$T extends ChunkType = ChunkType, $V = void>($state: $State, $case: $T, $inst: ChunkData<$T, $V>) {
		switch ($case) {
			case ChunkType.IHDR: return void ImageHeader.$encode($state, $inst as ImageHeader);
			case ChunkType.PLTE: return void $state.fatal('not supported');
			case ChunkType.IDAT: return void ($inst != null && $state.write_inst_somehow($inst));
			case ChunkType.IEND: return void ($inst != null && $state.write_inst_somehow($inst));
			case ChunkType.tRNS: return void $state.fatal('Failed to compile switch encoder');;
			case ChunkType.cHRM: return void PrimaryChromaticitiesAndWhitePointData.$encode($state, $inst as PrimaryChromaticitiesAndWhitePointData);
			case ChunkType.gAMA: return void GammaData.$encode($state, $inst as GammaData);
			case ChunkType.iCCP: return void EmbeddedICCProfileData.$encode($state, $inst as EmbeddedICCProfileData);
			case ChunkType.sBIT: return void $state.fatal('Failed to compile switch encoder');;
			case ChunkType.sRGB: return void RGBColorSpaceData.$encode($state, $inst as RGBColorSpaceData);
			case ChunkType.tEXt: return void TextData.$encode($state, $inst as TextData);
			case ChunkType.xTXt: return void CompressedTextData.$encode($state, $inst as CompressedTextData);
			case ChunkType.iTXt: return void InternationalTextData.$encode($state, $inst as InternationalTextData);
			case ChunkType.bKGD: return void $state.fatal('Failed to compile switch encoder');;
			case ChunkType.hIST: return void ImageHistogramData.$encode($state, $inst as ImageHistogramData);
			case ChunkType.pHYs: return void PhysicalPixelDimensionsData.$encode($state, $inst as PhysicalPixelDimensionsData);
			case ChunkType.sPLT: return void SuggestedPalleteData.$encode($state, $inst as SuggestedPalleteData);
			case ChunkType.tIME: return void LastModifiedTimestampData.$encode($state, $inst as LastModifiedTimestampData);
			default: return void ($inst != null && $state.write_inst_somehow($inst));
		}
	}
	
	export function $decode<$T extends ChunkType = ChunkType, $V = void>($state: $State, $case: $T, $void: $V = void 0) : ChunkData<$T, $V> {
		switch ($case) {
			case ChunkType.IHDR: return ImageHeader.$decode($state) as ChunkData<$T, $V>;
			case ChunkType.PLTE: return $state.read_from.read_array_take_remaining(() => Pallete.$decode($state)) as ChunkData<$T, $V>;
			case ChunkType.IDAT: return $void as ChunkData<$T, $V>;
			case ChunkType.IEND: return $void as ChunkData<$T, $V>;
			case ChunkType.tRNS: return $state.fatal('Failed to compile switch decoder') as ChunkData<$T, $V>;
			case ChunkType.cHRM: return PrimaryChromaticitiesAndWhitePointData.$decode($state) as ChunkData<$T, $V>;
			case ChunkType.gAMA: return GammaData.$decode($state) as ChunkData<$T, $V>;
			case ChunkType.iCCP: return EmbeddedICCProfileData.$decode($state) as ChunkData<$T, $V>;
			case ChunkType.sBIT: return $state.fatal('Failed to compile switch decoder') as ChunkData<$T, $V>;
			case ChunkType.sRGB: return RGBColorSpaceData.$decode($state) as ChunkData<$T, $V>;
			case ChunkType.tEXt: return TextData.$decode($state) as ChunkData<$T, $V>;
			case ChunkType.xTXt: return CompressedTextData.$decode($state) as ChunkData<$T, $V>;
			case ChunkType.iTXt: return InternationalTextData.$decode($state) as ChunkData<$T, $V>;
			case ChunkType.bKGD: return $state.fatal('Failed to compile switch decoder') as ChunkData<$T, $V>;
			case ChunkType.hIST: return ImageHistogramData.$decode($state) as ChunkData<$T, $V>;
			case ChunkType.pHYs: return PhysicalPixelDimensionsData.$decode($state) as ChunkData<$T, $V>;
			case ChunkType.sPLT: return SuggestedPalleteData.$decode($state) as ChunkData<$T, $V>;
			case ChunkType.tIME: return LastModifiedTimestampData.$decode($state) as ChunkData<$T, $V>;
			default: return $void as ChunkData<$T, $V>;
		}
	}
}
