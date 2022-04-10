
import { ast } from '../parser';
import { Switch } from './switch';
import { Schema } from './schema';
import { ChecksumType } from './base-types';
import { Struct, StructField } from './struct';
import { BuildError, BuildErrorFactory, build_error_factory } from '../error2';
import { BoolExpr_and, BoolExpr_eq, BoolExpr_neq, BoolExpr_not, BoolExpr_or, BoolExpr_xor } from './bool-expr';

export function link_fields(schema: Schema, errors: BuildError[]) {
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
			if (field.has_condition) {
				build_and_link_bool_expr(schema, node, field.ast_node.optional_condition.condition, error);
			}

			if (field.has_field_value) {
				// TODO: field.field_value
			}
		}
	}
}

function build_and_link_bool_expr(schema: Schema, struct: Struct, expr: ast.BoolExpr, error: BuildErrorFactory) {
	switch (expr.type) {
		case ast.node_type.bool_expr_not: {
			const bool = new BoolExpr_not();
			bool.ast_node = expr;
			bool.operand = build_and_link_bool_expr(schema, struct, expr.expr, error);
			return bool;
		}

		case ast.node_type.bool_expr_and: {
			const bool = new BoolExpr_and();
			bool.ast_node = expr;
			bool.lh_operand = build_and_link_bool_expr(schema, struct, expr.lh_expr, error);
			bool.rh_operand = build_and_link_bool_expr(schema, struct, expr.rh_expr, error);
			return bool;
		}

		case ast.node_type.bool_expr_or: {
			const bool = new BoolExpr_or();
			bool.ast_node = expr;
			bool.lh_operand = build_and_link_bool_expr(schema, struct, expr.lh_expr, error);
			bool.rh_operand = build_and_link_bool_expr(schema, struct, expr.rh_expr, error);
			return bool;
		}

		case ast.node_type.bool_expr_xor: {
			const bool = new BoolExpr_xor();
			bool.ast_node = expr;
			bool.lh_operand = build_and_link_bool_expr(schema, struct, expr.lh_expr, error);
			bool.rh_operand = build_and_link_bool_expr(schema, struct, expr.rh_expr, error);
			return bool;
		}

		case ast.node_type.bool_expr_eq: {
			const bool = new BoolExpr_eq();
			bool.ast_node = expr;
			// TODO: bool.lh_operand = 
			// TODO: bool.rh_operand = 
			return bool;
		}

		case ast.node_type.bool_expr_neq: {
			const bool = new BoolExpr_neq();
			bool.ast_node = expr;
			// TODO: bool.lh_operand = 
			// TODO: bool.rh_operand = 
			return bool;
		}
	}
}

function link_switch(schema: Schema, node: Switch, error: BuildErrorFactory) {
	for (const case_node of node.cases) {
		// TODO: case_node.case_value
	}
}

function link_checksum_type(schema: Schema, node: ChecksumType, error: BuildErrorFactory) {
	// TODO: node.data_field
}
