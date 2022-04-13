
import { ast } from '../parser';
import { Switch } from './switch';
import { Schema } from './schema';
import { EnumMemberRef } from './ref';
import { Struct, StructParam } from './struct';
import { build_field_type } from './field-type';
import { BuildError, BuildErrorFactory, build_error_factory } from '../error';

export function link_types(schema: Schema, errors: BuildError[]) {
	const error = build_error_factory(errors, schema);
	
	for (const node of schema.structs) {
		link_struct(schema, node, error);
	}
	
	for (const node of schema.switches) {
		link_switch(schema, node, error);
	}
}

function link_struct(schema: Schema, node: Struct, error: BuildErrorFactory) {
	for (const field of node.fields) {
		if (field.type === 'struct_field') {
			field.field_type = build_field_type(schema, field.ast_node.field_type, error);
		}

		else if (field.type === 'struct_expansion') {
			const expanded_type = build_field_type(schema, field.ast_node.expanded_type, error);

			if (expanded_type.type === 'struct_ref') {
				field.expanded_type = expanded_type;
			}

			else if (expanded_type.type === 'switch_ref') {
				field.expanded_type = expanded_type;
				// TODO: Validate underlying type(s)
			}

			else {
				error(expanded_type, 'Expected struct expansion to resolve to something with fields');
			}
		}
	}

	if (node.ast_node.type === ast.node_type.decl_struct) {
		if (node.ast_node.params) {
			node.params = [ ];

			for (const param_node of node.ast_node.params.params) {
				const param = new StructParam();
				param.ast_node = param_node;

				node.params.push(param);

				if (node.param_map.has(param.name)) {
					const other = node.param_map.get(param.name);
					error(param.name_token, `Duplicate parameter name "${param.name}"`, other.name_token);
				}

				else {
					node.param_map.set(param.name, param);
				}

				const param_type = build_field_type(schema, param_node.param_type, error);

				if (param_type.type === 'struct_ref'
				 || param_type.type === 'switch_ref'
				 || param_type.type === 'type_checksum'
				 || param_type.type === 'type_len'
				 || param_type.type === 'type_refinement'
				 || param_type.type === 'const_int'
				 || param_type.type === 'const_string'
				) {
					error(param_type, 'Unexpected type for parameter; Must be a basic type or an enum reference');
					continue;
				}

				param.param_type = param_type;
			}
		}
	}
}

function link_switch(schema: Schema, node: Switch, error: BuildErrorFactory) {
	const expr = node.arg_type_node;
	const arg_type = build_field_type(schema, expr, error);

	if (! arg_type) {
		return;
	}

	if (arg_type.type !== 'enum_ref') {
		error(arg_type, 'Arg type for a switch must refer to an enum');
		return;
	}

	node.arg_type = arg_type;

	for (const case_node of node.cases) {
		if (node.arg_type) {
			const ref = new EnumMemberRef();
			ref.ast_node = case_node.case_name_token;
			ref.enum_ref = arg_type;
			case_node.case_value = ref;

			const found = arg_type.points_to.symbols.get(case_node.case_name);
			
			if (found) {
				ref.points_to = found;
			}
			
			else {
				error(ref, `Enum member "${case_node.case_name}" not found for enum "${arg_type.name}"`);
			}
		}

		if (case_node.is_type) {
			const type_node = case_node.ast_node.selection as ast.TypeExpr;
			case_node.case_type = build_field_type(schema, type_node, error);
		}
	}

	if (node.default && node.default.is_type) {
		const type_node = node.default.ast_node.selection as ast.TypeExpr;
		node.default.default_type = build_field_type(schema, type_node, error);
	}
}
