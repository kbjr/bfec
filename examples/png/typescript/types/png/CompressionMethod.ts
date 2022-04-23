
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.115Z
*/

import { $State } from '../../utils';

export enum CompressionMethod {
	zlib = 0,
}
export namespace CompressionMethod {
	
	export function $encode_aligned($state: $State, $value: CompressionMethod) {
		$state.write_to.write_u8($value);
	}
	
	export function $encode_unaligned($state: $State, $value: CompressionMethod) {
		$state.fatal('Cannot encode unaligned int field')
	}
	
	export function $decode_aligned($state: $State) : CompressionMethod {
		return $state.read_from.read_u8() as CompressionMethod;
	}
	
	export function $decode_unaligned($state: $State) : CompressionMethod {
		return $state.fatal('Cannot decode unaligned int field') as CompressionMethod;
	}
}
