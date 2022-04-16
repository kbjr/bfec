
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 2022-04-16T05:30:10.739Z
*/

import { $decode, $BufferReader, $Type, $Root } from './utils';

export class $UnprocessedSlice<$T> {
	constructor(
		public read_from: $BufferReader,
		public root: $Root,
		public Type: $Type<$T>
	) { }

	public [$decode]() : $T {
		// TODO: Cannot handle switch because it has no `new()` interface
		const $inst = new this.Type();
		this.Type[$decode]($inst, this.read_from, this.root);
		return $inst;
	}
}
