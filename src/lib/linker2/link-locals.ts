
import { ast } from '../parser';
import { Enum } from './enum';
import { Switch } from './switch';
import { Schema } from './schema';
import { Struct } from './struct';
import { ImportedRef } from './ref';
import { build_field_type } from './field-type';
import { BuildError, BuildErrorFactory, build_error_factory } from '../error2';

export function link_locals(schema: Schema, errors: BuildError[]) {
	const error = build_error_factory(errors, schema);
	
	for (const node of schema.imported_refs) {
		link_imported_ref(schema, node, error);
	}
	
	for (const node of schema.structs) {
		link_struct(schema, node, error);
	}
	
	for (const node of schema.switches) {
		link_switch(schema, node, error);
	}
	
	for (const node of schema.enums) {
		link_enum(schema, node, error);
	}
	
	return schema;
}

function link_imported_ref(schema: Schema, node: ImportedRef, error: BuildErrorFactory) {
	if (! node.from || ! node.from.schema) {
		error(node, `Failed to resolve imported symbol "${node.name}"; Schema not found`);
		return;
	}

	const found = node.from.schema.symbols.get(node.source_name);

	if (! found) {
		error(node, `Failed to resolve imported symbol "${node.name}"`);
		return;
	}

	node.points_to = found;
}

function link_struct(schema: Schema, node: Struct, error: BuildErrorFactory) {
	for (const field of node.fields) {
		if (field.type === 'struct_field') {
			field.field_type = build_field_type(schema, field.ast_node.field_type, error);
			// TODO: field.condition
			// TODO: field.field_value
		}
	}
}

function link_switch(schema: Schema, node: Switch, error: BuildErrorFactory) {
	for (const case_node of node.cases) {
		// TODO: case_node.case_value

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

function link_enum(schema: Schema, node: Enum, error: BuildErrorFactory) {
	// 
}
