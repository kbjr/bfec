
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-23T23:44:05.382Z
*/

import { $State } from '../../utils';
import { bool } from '../$remote/https:/bfec.io/bfec/basics/v1/bool';


export type InternationalTextDataBody<$T extends bool = bool, $V = void>
	= $T extends bool.true ? number[]
	: $T extends bool.false ? string
	: never
	;
export namespace InternationalTextDataBody {
	
	export function $encode<$T extends bool = bool, $V = void>($state: $State, $case: $T, $inst: InternationalTextDataBody<$T, $V>) {
		switch ($case) {
			case bool.true: return void $state.fatal('not supported');
			case bool.false: return void $state.fatal('not supported');
			default: return void $state.fatal(`InternationalTextDataBody: Encountered invalid case: ${$case}`);
		}
	}
	
	export function $decode<$T extends bool = bool, $V = void>($state: $State, $case: $T, $void: $V = void 0) : InternationalTextDataBody<$T, $V> {
		switch ($case) {
			case bool.true: return $state.read_from.read_array_take_remaining(() => $state.read_from.read_u8()) as InternationalTextDataBody<$T, $V>;
			case bool.false: $state.fatal('not supported');
			default: return void $state.fatal(`InternationalTextDataBody: Encountered invalid case: ${$case}`);
		}
	}
}
