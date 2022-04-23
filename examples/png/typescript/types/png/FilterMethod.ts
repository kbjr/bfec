
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.383Z
*/

import { $State } from '../../utils';

export enum FilterMethod {
	adaptive = 0,
}
export namespace FilterMethod {
	
	export function $encode_aligned($state: $State, $value: FilterMethod) {
		$state.write_to.write_u8($value);
	}
	
	export function $encode_unaligned($state: $State, $value: FilterMethod) {
		$state.fatal('Cannot encode unaligned int field')
	}
	
	export function $decode_aligned($state: $State) : FilterMethod {
		return $state.read_from.read_u8() as FilterMethod;
	}
	
	export function $decode_unaligned($state: $State) : FilterMethod {
		return $state.fatal('Cannot decode unaligned int field') as FilterMethod;
	}
}
