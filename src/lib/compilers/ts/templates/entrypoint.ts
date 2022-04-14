
export interface EntrypointTemplateOpts {
	root_struct_class: string;
}

export const entrypoint_template = (tmpl: EntrypointTemplateOpts) => `
import * as $types from './types/$index';
import { $encode, $decode, $BufferWriter, $BufferReader } from './utils';

export * as types from './types/$index';

export function encode($inst: $types.${tmpl.root_struct_class}) : Uint8Array {
	const $write_to = new $BufferWriter();
	$types.${tmpl.root_struct_class}[$encode]($inst, $write_to, $inst);
	return $write_to.as_u8_array();
}

export function decode(array: Uint8Array) : $types.${tmpl.root_struct_class} {
	const $read_from = new $BufferReader(array);
	const $inst = new $types.${tmpl.root_struct_class}();
	return $types.${tmpl.root_struct_class}[$decode]($inst, $read_from, $inst);
}
`;
