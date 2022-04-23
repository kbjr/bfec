
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.114Z
*/

import { $State } from '../../utils';


export interface EmbeddedICCProfileData {
	proile_name: string;
	compression_method: CompressionMethod;
	compressed_profile: number[];
}
export namespace EmbeddedICCProfileData {
	
	export function $encode($state: $State, $inst: EmbeddedICCProfileData) {
		$state.step_down('proile_name', $inst.proile_name);
		$state.fatal('not supported')
		$state.step_up();
		$state.step_down('compression_method', $inst.compression_method);
		CompressionMethod.$encode_aligned($state, $inst.compression_method);
		$state.step_up();
		$state.step_down('compressed_profile', $inst.compressed_profile);
		$state.fatal('not supported')
		$state.step_up();
	}
	
	export function $decode($state: $State) : EmbeddedICCProfileData {
		const $inst = { } as EmbeddedICCProfileData;
		$state.step_down('proile_name');
		$inst.proile_name = $state.read_from.read_ascii_null_term()
		$state.step_up();
		$state.step_down('compression_method');
		$inst.compression_method = CompressionMethod.$decode_aligned($state)
		$state.step_up();
		$state.step_down('compressed_profile');
		$inst.compressed_profile = $state.read_from.read_array_take_remaining(() => $state.read_from.read_u8())
		$state.step_up();
		return $inst;
	}
}
