
export interface EntrypointTemplateOpts {
	root_ns_name: string;
	root_struct_class: string;
}

export const entrypoint_template = (tmpl: EntrypointTemplateOpts) => `
import * as $types from './types/$index';
import { $State, $BufferWriter, $BufferReader } from './utils';

export * as types from './types/$index';

export function encode($inst: $types.${tmpl.root_ns_name}.${tmpl.root_struct_class}) : Uint8Array {
	const $state = new $State();
	$state.write_to = new $BufferWriter();
	$types.${tmpl.root_ns_name}.${tmpl.root_struct_class}.$encode($state, $inst);
	return $state.write_to.as_u8_array();
}

export function decode($array: Uint8Array) : $types.${tmpl.root_ns_name}.${tmpl.root_struct_class} {
	const $state = new $State();
	$state.read_from = new $BufferReader($array);
	return $types.${tmpl.root_ns_name}.${tmpl.root_struct_class}.$decode($state);
}
`;
