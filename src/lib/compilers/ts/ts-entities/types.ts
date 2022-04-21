
import * as lnk from '../../../linker';
import { CompilerState } from '../state';
import { builtins } from './builtins';
import { TSEnumRef } from './enum-module';
import { TSModule } from './module';
import { TSStructRef } from './struct-module';
import { TSSwitchRef } from './switch-module';

export type FieldType = string | TSEnumRef | TSStructRef | TSSwitchRef;

export function field_type(state: CompilerState, type: lnk.FieldType, module: TSModule) {
	switch (type.type) {
		case 'enum_ref': return bfec_enum.field_type(state, type, module);
		case 'struct_ref': return bfec_struct.field_type(state, type, module);
		case 'switch_ref': return bfec_switch.field_type(state, type, module);
		case 'type_refinement': return bfec_type_refinement.field_type(state, type, module);
		default: return builtins.field_type(state, type);
	}
}

export function encode(state: CompilerState, type: lnk.FieldType, module: TSModule, value_expr: string) {
	switch (type.type) {
		case 'enum_ref': return bfec_enum.encode(state, type, module, value_expr);
		case 'struct_ref': return bfec_struct.encode(state, type, module, value_expr);
		case 'switch_ref': return bfec_switch.encode(state, type, module, value_expr);
		case 'type_refinement': return bfec_type_refinement.encode(state, type, module, value_expr);
		// TODO: unaligned?
		default: return builtins.encode_aligned(state, type, value_expr);
	}
}

export function decode(state: CompilerState, type: lnk.FieldType, module: TSModule) {
	switch (type.type) {
		case 'enum_ref': return bfec_enum.decode(state, type, module);
		case 'struct_ref': return bfec_struct.decode(state, type, module);
		case 'switch_ref': return bfec_switch.decode(state, type, module);
		case 'type_refinement': return bfec_type_refinement.decode(state, type, module);
		// TODO: unaligned?
		default: return builtins.decode_aligned(state, type);
	}
}

export namespace bfec_enum {
	export function field_type(state: CompilerState, ref: lnk.EnumRef, module: TSModule) : TSEnumRef | string {
		const enum_module = state.ts_enums.get(ref.points_to);

		if (! enum_module) {
			state.error(ref, 'Encountered reference to uncollected type');
			return 'never';
		}

		module.import(enum_module.ts_enum);
		return new TSEnumRef(enum_module);
	}

	export function encode(state: CompilerState, ref: lnk.EnumRef, module: TSModule, value_expr: string) {
		const enum_module = state.ts_enums.get(ref.points_to);

		if (! enum_module) {
			state.error(ref, 'Encountered reference to uncollected type');
			return `$state.fatal('Failed to compile enum encoder')`;
		}

		const ts_enum = module.import(enum_module.ts_enum);
		// TODO: unaligned?
		return `${ts_enum.ref_str}.$encode_aligned($state, ${value_expr})`;
	}

	export function decode(state: CompilerState, ref: lnk.EnumRef, module: TSModule) {
		return `$state.fatal('Failed to compile enum encoder')`;
	}
}

export namespace bfec_struct {
	export function field_type(state: CompilerState, ref: lnk.StructRef, module: TSModule) : TSStructRef | string {
		const struct_module = state.ts_structs.get(ref.points_to);

		if (! struct_module) {
			state.error(ref, 'Encountered reference to uncollected type');
			return 'never';
		}

		// TODO: Params
		const params: string[] = [ ];

		module.import(struct_module.ts_iface);
		return new TSStructRef(struct_module, params);
	}

	export function encode(state: CompilerState, ref: lnk.StructRef, module: TSModule, value_expr: string) {
		return `$state.fatal('Failed to compile struct encoder')`;
	}

	export function decode(state: CompilerState, ref: lnk.StructRef, module: TSModule) {
		return `$state.fatal('Failed to compile struct decoder')`;
	}
}

export namespace bfec_switch {
	export function field_type(state: CompilerState, ref: lnk.SwitchRef, module: TSModule) : TSSwitchRef | string {
		const switch_module = state.ts_switches.get(ref.points_to);

		if (! switch_module) {
			state.error(ref, 'Encountered reference to uncollected type');
			return 'never';
		}

		module.import(switch_module.ts_type);
		// TODO: Param
		return new TSSwitchRef(switch_module, null);
	}

	export function encode(state: CompilerState, ref: lnk.SwitchRef, module: TSModule, value_expr: string) {
		return `$state.fatal('Failed to compile switch encoder')`;
	}

	export function decode(state: CompilerState, ref: lnk.SwitchRef, module: TSModule) {
		return `$state.fatal('Failed to compile switch decoder')`;
	}
}

export namespace bfec_type_refinement {
	export function field_type(state: CompilerState, ref: lnk.TypeRefinement, module: TSModule) : string {
		// TODO: Type refinements
		return 'never';
	}

	export function encode(state: CompilerState, ref: lnk.TypeRefinement, module: TSModule, value_expr: string) {
		return `$state.fatal('Failed to compile type refinement encoder')`;
	}

	export function decode(state: CompilerState, ref: lnk.TypeRefinement, module: TSModule) {
		return `$state.fatal('Failed to compile type refinement decoder')`;
	}
}

export namespace bfec_expansion {
	// 
}
