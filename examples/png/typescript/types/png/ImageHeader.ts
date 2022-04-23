
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.380Z
*/

import { $State } from '../../utils';
import { BitDepth } from './BitDepth';
import { ColorType } from './ColorType';
import { CompressionMethod } from './CompressionMethod';
import { FilterMethod } from './FilterMethod';
import { InterlaceMethod } from './InterlaceMethod';


export interface ImageHeader {
	width: number;
	height: number;
	bit_depth: BitDepth;
	color_type: ColorType;
	compression_method: CompressionMethod;
	filter_method: FilterMethod;
	interlace_method: InterlaceMethod;
}
export namespace ImageHeader {
	
	export function $encode($state: $State, $inst: ImageHeader) {
		$state.here.node = $inst;
		$state.step_down('width', $inst.width);
		$state.write_to.write_u32_be($inst.width);
		$state.step_up();
		$state.step_down('height', $inst.height);
		$state.write_to.write_u32_be($inst.height);
		$state.step_up();
		$state.step_down('bit_depth', $inst.bit_depth);
		BitDepth.$encode_aligned($state, $inst.bit_depth);
		$state.step_up();
		$state.step_down('color_type', $inst.color_type);
		ColorType.$encode_aligned($state, $inst.color_type);
		$state.step_up();
		$state.step_down('compression_method', $inst.compression_method);
		CompressionMethod.$encode_aligned($state, $inst.compression_method);
		$state.step_up();
		$state.step_down('filter_method', $inst.filter_method);
		FilterMethod.$encode_aligned($state, $inst.filter_method);
		$state.step_up();
		$state.step_down('interlace_method', $inst.interlace_method);
		InterlaceMethod.$encode_aligned($state, $inst.interlace_method);
		$state.step_up();
	}
	
	export function $decode($state: $State) : ImageHeader {
		const $inst = { } as ImageHeader;
		$state.here.node = $inst;
		$state.step_down('width');
		$inst.width = $state.read_from.read_u32_be()
		$state.step_up();
		$state.step_down('height');
		$inst.height = $state.read_from.read_u32_be()
		$state.step_up();
		$state.step_down('bit_depth');
		$inst.bit_depth = BitDepth.$decode_aligned($state)
		$state.step_up();
		$state.step_down('color_type');
		$inst.color_type = ColorType.$decode_aligned($state)
		$state.step_up();
		$state.step_down('compression_method');
		$inst.compression_method = CompressionMethod.$decode_aligned($state)
		$state.step_up();
		$state.step_down('filter_method');
		$inst.filter_method = FilterMethod.$decode_aligned($state)
		$state.step_up();
		$state.step_down('interlace_method');
		$inst.interlace_method = InterlaceMethod.$decode_aligned($state)
		$state.step_up();
		return $inst;
	}
}
