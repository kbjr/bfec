
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T06:34:43.115Z
*/

import { $State } from '../../utils';
import { bool } from '../$remote/https:/bfec.io/bfec/basics/v1/bool';


export type InternationalTextDataBody<$T extends bool = bool, $V = void>
	= $T extends bool.true ? number[]
	: $T extends bool.false ? string
	: never
	;
export namespace InternationalTextDataBody {
	
	export function $encode<$T extends bool = bool>($state: $State, $case: $T, $inst: InternationalTextDataBody<$T>) {
		switch ($case) {
			case bool.true: $state.fatal('not supported')
			case bool.false: $state.fatal('not supported')
			default: $state.fatal(`InternationalTextDataBody: Encountered invalid case: ${$case}`);
		}
	}
	
	export function $decode<$T extends bool = bool>($state: $State, $case: $T) : InternationalTextDataBody<$T> {
		switch ($case) {
			case bool.true: return $state.read_from.read_array_take_remaining(() => $state.read_from.read_u8());
			case bool.false: $state.fatal('not supported');
			default: $state.fatal(`InternationalTextDataBody: Encountered invalid case: ${$case}`);
		}
	}
}
