
import * as lnk from '../../../linker';
import { CompilerState } from '../state';
import { TSEnumRef } from './enum-module';
import { TSStructRef } from './struct-module';
import { TSSwitchRef } from './switch-module';
import { TSTypeRefinement } from './type-refinement';
import { TSArrayType } from './array';
import { builtins } from './builtins';

export type Assign = (value_expr: string) => string;
export type TSFieldType = TSNever | TSEnumRef | TSStructRef | TSSwitchRef | TSArrayType | TSTypeRefinement | builtins.TSBuiltin;

export function create_ts_field_type(state: CompilerState, type: lnk.FieldType) : TSFieldType {
	switch (type.type) {
		case 'struct_ref': return TSStructRef.from_ref(state, type);
		case 'switch_ref': return TSSwitchRef.from_ref(state, type);
		case 'enum_ref': return TSEnumRef.from_ref(state, type);
		case 'type_refinement': return TSTypeRefinement.from_type(state, type);
		case 'type_array': return TSArrayType.from_type(state, type);
		default: return new builtins.TSBuiltin(state, type);
	}
}

export class TSNever {
	public field_type() { return 'never'; }
	public encode_aligned(value_expr: string) { return `$state.fatal('Encode failed; type unknown')` }
	public encode_unaligned(value_expr: string) { return `$state.fatal('Encode failed; type unknown')` }
	public decode_aligned(assign: Assign) { return `$state.fatal('Decode failed; type unknown')` }
	public decode_unaligned(assign: Assign) { return `$state.fatal('Decode failed; type unknown')` }
}
