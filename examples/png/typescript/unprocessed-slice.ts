
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-17T04:06:19.177Z
*/

import { $BufferReader, $State, $StructType, $SwitchType, $Root } from './utils';

export class $UnprocessedSlice<$T, $C = void> {
	constructor(
		public read_from: $BufferReader,
		public root: $Root,
		public state: $State,
		public Type: $StructType<$T> | $SwitchType<$T, $C>,
		public $case: $C
	) { }

	public $decode() : $T {
		return this.Type.$decode(this.state, this.$case);
	}
}
