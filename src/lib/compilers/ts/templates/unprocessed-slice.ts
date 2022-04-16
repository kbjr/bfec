
export const unprocessed_slice_template = () => `
import { $decode, $BufferReader, $Type, $Root } from './utils';

export class $UnprocessedSlice<$T> {
	constructor(
		public read_from: $BufferReader,
		public root: $Root,
		public Type: $Type<$T>
	) { }

	public [$decode]() : $T {
		// TODO: Cannot handle switch because it has no \`new()\` interface
		const $inst = new this.Type();
		this.Type[$decode]($inst, this.read_from, this.root);
		return $inst;
	}
}
`;
