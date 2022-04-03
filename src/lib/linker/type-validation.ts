
// import { BuildError, BuildErrorFactory, build_error_factory } from '../error';
// import {
// 	node_type,
// 	Schema, SchemaNode,
// 	ConstInt, ConstString,
// 	Enum,
// 	Struct,
// 	Switch,
// 	TypeExpr,
// 	TypeExpr_fixed_int, TypeExpr_int,
// 	TypeExpr_varint,
// 	TypeExpr_length,
// 	TextEncoding, TextLengthType,
// 	TypeExpr_text,
// 	ValueExpr
// } from '../schema';

// export function validate_types(schema: Schema, errors: BuildError[]) : void {
// 	const error = build_error_factory(errors, schema);

// 	schema.elements.forEach((elem) => {
// 		switch (elem.type) {
// 			case node_type.struct:
// 				return validate_struct(schema, elem, error);
					
// 			case node_type.switch:
// 				return validate_switch(schema, elem, error);
				
// 			case node_type.enum:
// 				return validate_enum(schema, elem, error);
// 		}
// 	});
// }

// export function validate_struct(schema: Schema, elem: Struct, error: BuildErrorFactory) {
// 	for (const field of elem.fields) {
// 		if (field.type === node_type.struct_expansion) {
// 			// TODO: Validate name uniqueness after merging
// 		}
// 	}
// }

// export function validate_switch(schema: Schema, elem: Switch, error: BuildErrorFactory) {
// 	// 
// }

// export function validate_enum(schema: Schema, elem: Enum, error: BuildErrorFactory) {
// 	if (is_int_type(elem.member_type)) {
// 		const validate = int_type_validator(elem.member_type, error);

// 		for (const member of elem.members) {
// 			validate(member.value);
// 		}
// 	}

// 	else if (is_text_type(elem.member_type)) {
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

// function is_int_const(value: SchemaNode) : value is ConstInt {
// 	return value instanceof ConstInt;
// }

// function is_string_const(value: SchemaNode) : value is ConstString {
// 	return value instanceof ConstString;
// }

// function is_int_type(value: SchemaNode) : value is TypeExpr_int {
// 	return value instanceof TypeExpr_fixed_int || value instanceof TypeExpr_varint;
// }

// function is_len_type(value: SchemaNode) : value is TypeExpr_length {
// 	return value instanceof TypeExpr_length;
// }

// function is_text_type(value: SchemaNode) : value is TypeExpr_text {
// 	return value instanceof TypeExpr_text;
// }

// function is_value_expr(value: SchemaNode) : value is ValueExpr {
// 	return value instanceof ValueExpr;
// }

// function type_validator(type: TypeExpr, error: BuildErrorFactory) {
// 	if (is_int_type(type)) {
// 		return int_type_validator(type, error);
// 	}

// 	if (is_len_type(type)) {
// 		return int_type_validator(type.real_type, error);
// 	}

// 	if (is_text_type(type)) {
// 		return text_type_validator(type, error);
// 	}

// 	// TODO: Other types...
// }

// function text_type_validator(type: TypeExpr_text, error: BuildErrorFactory) {
// 	return function validate_text_type(value: SchemaNode) : boolean {
// 		if (is_value_expr(value)) {
// 			return validate_value_expr(value);
// 		}

// 		if (is_string_const(value)) {
// 			return validate_string_const(value);
// 		}

// 		// TODO: Error
// 	}

// 	function validate_value_expr(expr: ValueExpr) : boolean {
// 		// TODO: Validate the type of the resolved Refable matches type
// 		return true;
// 	}

// 	function validate_string_const(expr: ConstString) : boolean {
// 		let success = true;

// 		if (expr.unicode && type.encoding === TextEncoding.ascii) {
// 			error(expr, 'Cannot assign unicode string value to ascii text type');
// 			success = false;
// 		}

// 		switch (type.length_type) {
// 			case TextLengthType.null_terminated:
// 				if (/\0/g.test(expr.value)) {
// 					error(expr, 'Value assigned to null-terminated string type cannot contain null bytes');
// 					success = false;
// 				}
// 				break;

// 			case TextLengthType.static_length:
// 				if (BigInt(expr.value.length) !== type.static_length.value) {
// 					error(expr, 'Value assigned to static-length string type must match the defined length');
// 					success = false;
// 				}
// 				break;

// 			case TextLengthType.take_remaining:
// 				// pass
// 				break;

// 			case TextLengthType.length_prefix:
// 				if (BigInt(expr.value.length) > type.length_prefix.max) {
// 					error(expr, `Value assigned to text field longer than the length type's max value`);
// 					success = false;
// 				}
// 				break;

// 			case TextLengthType.length_field:
// 				const len_type = type.length_field.value_type;

// 				if (! is_len_type(len_type)) {
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
