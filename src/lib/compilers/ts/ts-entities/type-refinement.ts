
import * as lnk from '../../../linker';
import { CompilerState } from "../state";

export class TSTypeRefinement {
	constructor(
		public base_type: null,
		public refined_type: null
	) { }

	public static from_type(state: CompilerState, type: lnk.TypeRefinement) {
		// const enum_module = state.ts_enums.get(ref.points_to);

		// if (! enum_module) {
		// 	state.error(ref, 'Encountered reference to uncollected type');
		// 	return 'never';
		// }

		return new TSTypeRefinement(null, null);
	}

	public field_type() {
		return 'never';
	}

	public encode_aligned() {
		return `$state.fatal('Failed to compile type refinement encoder')`;
	}

	public encode_unaligned() {
		return `$state.fatal('Failed to compile type refinement encoder')`;
	}

	public decode_aligned() {
		return `$state.fatal('Failed to compile type refinement decoder')`;
	}

	public decode_unaligned() {
		return `$state.fatal('Failed to compile type refinement decoder')`;
	}
}
