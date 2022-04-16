
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-16T05:30:10.743Z
*/


import { $State, $encode, $decode } from '../../utils';

import { ChunkType as $Enum } from '../../';


export type ChunkData<$T extends $Enum = $Enum>
	= 
	: never
	;

export const ChunkData = Object.freeze({
	[$decode]<$T extends $Enum = $Enum>($inst: null, $state: $State, $case: $T) : ChunkData<$T> {
		switch ($case) {
			// TODO: switch case/default decoding
			default: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
		}
	},
	[$encode]<$T extends $Enum = $Enum>($inst: ChunkData<$T>, $state: $State, $case: $T) {
		switch ($case) {
			// TODO: switch case/default encoding
			default: $state.fatal(`ChunkData: Encountered invalid case: ${$case}`);
		}
	}
});
