
import { BuildError } from '../error';
import { Schema, node_type, ImportedSymbol, Struct, Switch, Enum, TypeExpr_named, SchemaNode, TypeExpr, TypeExpr_array, ArrayLengthType, BoolExpr, ValueExpr } from '../schema';
import { RefLocality, ResolvedRef } from './refs';

export function link_locals(schema: Schema, errors: BuildError[]) : void {
	schema.elements.forEach((elem) => {
		switch (elem.type) {
			case node_type.imported_symbol:
				return link_imported_symbol(schema, elem, errors);

			case node_type.struct:
				return link_struct(schema, elem, errors);
					
			case node_type.switch:
				return link_switch(schema, elem, errors);
				
			case node_type.enum:
				return link_enum(schema, elem, errors);
		}
	});
}

function link_imported_symbol(schema: Schema, elem: ImportedSymbol, errors: BuildError[]) : void {
	if (elem.from.source_schema) {
		const imported = elem.from.source_schema.element_map.get(elem.imported.name);

		if (! imported) {
			build_error(errors, schema, elem.imported, `Symbol ${elem.imported.name} not found in "${elem.from.source_expr.value}"`);
			return;
		}

		const { is_external, is_remote } = elem.from.source_schema;
		const locality
			= is_remote ? RefLocality.remote
			: is_external ? RefLocality.external
			: RefLocality.project
			;

		elem.imported = ResolvedRef.promote_ref(elem.imported, imported, locality);
	}
}

function link_struct(schema: Schema, elem: Struct, errors: BuildError[]) : void {
	for (const param of elem.params) {
		link_type_expr(schema, param.param_type, errors);
	}

	for (const field of elem.fields) {
		if (field.type === node_type.struct_expansion) {
			link_type_expr(schema, field.expanded_type, errors);
		}

		else {
			if (field.condition) {
				// TODO: field.condition
			}

			if (! field.field_type) {
				build_error(errors, schema, field, `Invalid Schema: Missing field_type for field "${field.name.name}"`);
				continue;
			}

			if (field.field_type.type !== node_type.const_int && field.field_type.type !== node_type.const_string) {
				link_type_expr(schema, field.field_type, errors);
			}
		}
	}
}

function link_switch(schema: Schema, elem: Switch, errors: BuildError[]) : void {
	// TODO: elem.arg_type
	// TODO: elem.cases
	// TODO: elem.default
}

function link_enum(schema: Schema, elem: Enum, errors: BuildError[]) : void {
	// TODO: elem.member_type if named
}



// ===== Type Expressions =====

function link_type_expr(schema: Schema, expr: TypeExpr, errors: BuildError[]) : void {
	switch (expr.type) {
		case node_type.type_expr_array:
			link_array_type_expr(schema, expr, errors);
			break;

		case node_type.type_expr_named:
			link_named_type_expr(schema, expr, errors);
			break;

		case node_type.type_expr_named_refine:
			link_type_expr(schema, expr.parent_type, errors);
			link_named_type_expr(schema, expr.refined_type, errors);
			break;

		// TODO: case node_type.type_expr_checksum:
		// TODO: case node_type.type_expr_len:
		// TODO: case node_type.type_expr_struct_refinement:
		// TODO: case node_type.type_expr_switch_refinement:
		// TODO: case node_type.type_expr_text:
		// TODO: case node_type.type_expr_vint:
		// TODO: case node_type.name_builtin_uint:
		// TODO: case node_type.name_builtin_sint:
		// TODO: case node_type.name_builtin_bit:
		// TODO: case node_type.name_builtin_dec_float:
		// TODO: case node_type.name_builtin_bin_float:
	}
}

function link_array_type_expr(schema: Schema, expr: TypeExpr_array, errors: BuildError[]) : void {
	link_type_expr(schema, expr.element_type, errors);
	
	if (expr.length_type === ArrayLengthType.length_field) {
		link_value_expr(schema, expr.length_field, errors);
	}
}

function link_named_type_expr(schema: Schema, expr: TypeExpr_named, errors: BuildError[]) : void {
	const name = expr.name.name;
	const found = schema.element_map.get(name);

	if (! found) {
		build_error(errors, schema, expr.name, `Referenced type "${name}" not found`);
		return;
	}

	expr.name = ResolvedRef.promote_ref(expr.name, found, RefLocality.schema);
}



// ===== Value Expressions =====

function link_value_expr(schema: Schema, expr: ValueExpr, errors: BuildError[]) : void {
	// TODO: link_value_expr
}



// ===== Bool Expressions =====

function link_bool_expr(schema: Schema, expr: BoolExpr, errors: BuildError[]) : void {
	// TODO: link_bool_expr
}



// ===== Errors =====

function build_error(errors: BuildError[], schema: Schema, schema_node: SchemaNode, message: string) {
	const node = schema.include_source_maps
		? schema.source_map.get(schema_node)
		: null;

	errors.push(
		new BuildError(message, schema, node)
	);
}
