
// import * as sch from '../schema';
// import { BuildError, BuildErrorFactory, build_error_factory } from '../error';
// import { is_struct_expansion } from '../schema';

// export function validate_types(schema: sch.Schema, errors: BuildError[]) : void {
// 	const error = build_error_factory(errors, schema);

// 	for (const enum_node of schema.enums) {
// 		validate_enum(schema, enum_node, error);
// 	}

// 	for (const switch_node of schema.switches) {
// 		validate_switch(schema, switch_node, error);
// 	}

// 	for (const struct_node of schema.structs) {
// 		validate_struct(schema, struct_node, error);
// 	}
// }

// export function validate_struct(schema: sch.Schema, elem: sch.Struct, error: BuildErrorFactory) {
// 	for (const field of elem.fields) {
// 		if (is_struct_expansion(field)) {
// 			// TODO: Validate name uniqueness after merging
// 		}
// 	}
// }

// export function validate_switch(schema: sch.Schema, elem: sch.Switch, error: BuildErrorFactory) {
// 	// TODO: Validate switch
// }

// export function validate_enum(schema: sch.Schema, elem: sch.Enum, error: BuildErrorFactory) {
// 	if (sch.is_type_expr_int(elem.member_type)) {
// 		const validate = int_type_validator(elem.member_type, error);

// 		for (const member of elem.members) {
// 			validate(member.value);
// 		}
// 	}

// 	else if (sch.is_type_expr_text(elem.member_type)) {
// 		const validate = text_type_validator(elem.member_type, error);

// 		for (const member of elem.members) {
// 			validate(member.value);
// 		}
// 	}

// 	else {
// 		error(elem.member_type, 'Enum type must be a built-in int or text type');
// 	}
// }



// // ===== Utilities =====

// function type_validator(type: sch.TypeExpr, error: BuildErrorFactory) {
// 	if (sch.is_type_expr_int(type)) {
// 		return int_type_validator(type, error);
// 	}

// 	if (sch.is_type_expr_length(type)) {
// 		return int_type_validator(type.real_type, error);
// 	}

// 	if (sch.is_type_expr_text(type)) {
// 		return text_type_validator(type, error);
// 	}

// 	// TODO: Other types...
// }

// function text_type_validator(type: sch.TypeExpr_text, error: BuildErrorFactory) {
// 	return function validate_text_type(value: sch.SchemaNode) : boolean {
// 		if (sch.is_const_int(value)) {
// 			// return validate_value_expr(value);
// 		}

// 		if (sch.is_const_str(value)) {
// 			return validate_string_const(value);
// 		}

// 		// TODO: Error
// 	}

// 	// function validate_value_expr(expr: ValueExpr) : boolean {
// 	// 	// TODO: Validate the type of the resolved Refable matches type
// 	// 	return true;
// 	// }

// 	function validate_string_const(expr: sch.ConstString) : boolean {
// 		let success = true;

// 		if (expr.unicode && type.encoding === sch.text_enc.ascii) {
// 			error(expr, 'Cannot assign unicode string value to ascii text type');
// 			success = false;
// 		}

// 		switch (type.length_type) {
// 			case sch.len_type.null_terminated:
// 				if (/\0/g.test(expr.value)) {
// 					error(expr, 'Value assigned to null-terminated string type cannot contain null bytes');
// 					success = false;
// 				}
// 				break;

// 			case sch.len_type.static_length:
// 				if (BigInt(expr.value.length) !== type.static_length.value) {
// 					error(expr, 'Value assigned to static-length string type must match the defined length');
// 					success = false;
// 				}
// 				break;

// 			case sch.len_type.take_remaining:
// 				// pass
// 				break;

// 			case sch.len_type.length_prefix:
// 				if (BigInt(expr.value.length) > type.length_prefix.max) {
// 					error(expr, `Value assigned to text field longer than the length type's max value`);
// 					success = false;
// 				}
// 				break;

// 			case sch.len_type.length_field:
// 				const len_type = type.length_field.value_type;

// 				if (! sch.is_type_expr_length(len_type)) {
// 					error(len_type, 'Expected value assigned to text type length to be a `len<int>` type');
// 					success = false;
// 					break;
// 				}

// 				if (BigInt(expr.value.length) > len_type.real_type.max) {
// 					error(expr, `Value assigned to text field longer than the length type's max value`);
// 					success = false;
// 				}
// 				break;

// 			default:
// 				error(expr, 'Failed to determine text length type');
// 				success = false;
// 		}

// 		return success;
// 	}
// }

// function int_type_validator(type: TypeExpr_int, error: BuildErrorFactory) {
// 	return function validate_int_type(value: SchemaNode) : boolean {
// 		if (is_value_expr(value)) {
// 			return validate_value_expr(value);
// 		}

// 		if (is_int_const(value)) {
// 			return validate_int_const(value);
// 		}

// 		// TODO: Error
// 	};

// 	function validate_value_expr(expr: ValueExpr) : boolean {
// 		// TODO: Validate the type of the resolved Refable matches type
// 		return true;
// 	}

// 	function validate_int_const(expr: ConstInt) : boolean {
// 		if (expr.value > type.max) {
// 			error(expr, `Value assigned to int field larger than the type's max value`);
// 			return false;
// 		}
		
// 		if (expr.value < type.min) {
// 			error(expr, `Value assigned to int field smaller than the type's min value`);
// 			return false;
// 		}

// 		return true;
// 	}
// }
