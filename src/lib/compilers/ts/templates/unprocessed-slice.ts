
export const unprocessed_slice_template = () => `
import { $BufferReader, $State, $StructType, $SwitchType, $Root } from './utils';

export interface $ProcessSlice<$T, $C = void> {
	(slice: $UnprocessedSlice<$T, $C>) : $T;
}

export class $UnprocessedSlice<$T, $C = void> {
	constructor(
		public read_from: $BufferReader,
		public root: $Root,
		public state: $State,
		public process: $ProcessSlice<$T, $C>,
		public $case: $C
	) { }

	public $decode() : $T {
		return this.process(this);
	}
}
`;
