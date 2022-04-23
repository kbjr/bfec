
import * as lnk from '../../../linker';
import { CompilerState } from '../state';
import { TSEnumRef } from './enum-module';
import { TSStructRef } from './struct-module';
import { TSSwitchRef } from './switch-module';
import { Assign, create_ts_field_type, TSFieldType } from './types';

export class TSArrayType {
	public state: CompilerState;
	public bfec_array: lnk.ArrayType;
	public elem_type: TSFieldType;

	public get length() {
		return this.bfec_array.length;
	}

	public field_type() : string {
		if (this.elem_type == null) {
			return 'never[]';
		}

		return `${this.elem_type.field_type()}[]`;
	}

	public encode_aligned() {
		return `$state.fatal('not supported')`;
	}

	public encode_unaligned() {
		return `$state.fatal('not supported')`;
	}

	public decode_aligned(assign: Assign) {
		const lines: string[] = [ ];
		// const decode_elem = decode()

		switch (this.length.length_type) {
			case 'length_field': {
				lines.push(`$state.fatal('not supported');`);
				break;
			}

			case 'length_prefix': {
				// const len = builtins.decode_aligned(this.state, this.length.prefix_type);
				// const bytes = `$state.read_from.take_bytes(${len}, false)`;
				// lines.push(`$state.read_from.${as_text(expr)}(${bytes})`);
				break;
			}

			case 'null_terminated': {
				// lines.push(`$state.read_from.${read_null_term(expr)}()`);
				break;
			}

			case 'static_length': {
				// const len = expr.length.value.value;
				// const bytes = `$state.read_from.take_bytes(${len}, false)`;
				// lines.push(`$state.read_from.${as_text(expr)}(${bytes})`);
				break;
			}

			case 'take_remaining': {
				// const decode_elem = this.elem_type instanceof TSArrayType
				// 	? this.elem_type.decode_aligned('const $elem')
				// 	: decode(this.state, this.elem_type, this.state.ts_module, 'const $elem');

				// lines.push(`${write_to}: ${this.field_type} = [ ];`);
				lines.push('while (! $state.read_from.eof) {');
				// lines.push(`\t${}`);
				// lines.push(`\t${write_to}.push(${});`);
				lines.push('}');
				break;
			}
		}

		return lines.join('\n\t\t');
	}

	public decode_unaligned(assign: Assign) {
		return `$state.fatal('not supported')`;
	}

	public static from_type(state: CompilerState, bfec_array: lnk.ArrayType) : TSArrayType {
		const array = new TSArrayType();
		array.bfec_array = bfec_array;
		
		switch (bfec_array.elem_type.type) {
			case 'enum_ref': {
				const enum_module = state.ts_enums.get(bfec_array.elem_type.points_to);

				if (! enum_module) {
					state.error(bfec_array.elem_type, 'Encountered a reference to an uncollected type');
					array.elem_type = null;
					break;
				}

				state.ts_module.import(enum_module.ts_enum);
				array.elem_type = new TSEnumRef(enum_module);
				break;
			}

			case 'struct_ref': {
				const struct_module = state.ts_structs.get(bfec_array.elem_type.points_to);

				if (! struct_module) {
					state.error(bfec_array.elem_type, 'Encountered a reference to an uncollected type');
					array.elem_type = null;
					break;
				}

				// TODO: Params

				state.ts_module.import(struct_module.ts_iface);
				array.elem_type = new TSStructRef(struct_module, [ ]);
				break;
			}

			case 'switch_ref': {
				const switch_module = state.ts_switches.get(bfec_array.elem_type.points_to);

				if (! switch_module) {
					state.error(bfec_array.elem_type, 'Encountered a reference to an uncollected type');
					array.elem_type = null;
					break;
				}

				// TODO: Params

				state.ts_module.import(switch_module.ts_type);
				array.elem_type = new TSSwitchRef(switch_module, null);
				break;
			}

			case 'type_array':
				array.elem_type = TSArrayType.from_type(state, bfec_array.elem_type);
				break;

			default:
				array.elem_type = create_ts_field_type(state, bfec_array.elem_type);
				break;
		}

		return array;
	}
}
