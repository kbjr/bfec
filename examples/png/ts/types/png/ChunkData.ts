
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-16T04:13:59.812Z
*/


import { $BufferReader, $BufferWriter, $Root, $encode, $decode } from '../../utils';

import {  as $Enum } from '../../';

export type ChunkData<$T extends $Enum = $Enum>
	= 
	: never
	;

export const ChunkData = Object.freeze({
	[$decode]<$T extends $Enum = $Enum>($read_from: $BufferReader, $case: $T, $root: $Root) : ChunkData<$T> {
		switch ($case) {
			// TODO: switch case/default decoding
		}
	},
	[$encode]<$T extends $Enum = $Enum>($read_from: $BufferReader, $case: $T, $root: $Root) {
		// 
	}
});
