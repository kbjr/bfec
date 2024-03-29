
import { Parser } from './parser';
import { ParserState } from './state';
import { parse_type_expr } from './type-expr';
import { DeclareStructNode, StructBody, StructElem, StructExpansion, StructField, StructFieldOptionalCondition, StructParamNode, StructParamsListNode } from './ast';
import { kw_struct, NameToken_normal, name_normal, name_root_schema, op_expansion, PuncToken_close_brace, punc_assign, punc_close_brace, punc_close_paren, punc_colon, punc_condition, punc_open_brace, punc_open_paren, punc_separator, punc_terminator } from './ast/tokens';
import { parse_value_expr } from './value-expr';
import { parse_bool_expr } from './bool-expr';

const struct_scope_parsers: Parser<StructElem>[] = [
	parse_struct_field,
	parse_struct_expansion,
];

export function parse_struct(state: ParserState) : DeclareStructNode {
	state.trace('parse_struct');

	const struct_keyword = kw_struct.match(state);

	if (! struct_keyword) {
		return null;
	}
	
	const ast_node = new DeclareStructNode();
	ast_node.struct_keyword = struct_keyword;
	state.scan_through_comments_and_whitespace(ast_node.children);
	ast_node.name = name_root_schema.match(state) || name_normal.match(state);

	if (! ast_node.name) {
		state.fatal('expected to find struct name following "struct" keyword');
	}
	
	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.params = parse_struct_params(state);

	if (ast_node.params) {
		state.scan_through_comments_and_whitespace(ast_node.children)
	}

	ast_node.body = parse_struct_body(state);
	return ast_node;
}

export function parse_struct_body(state: ParserState) {
	state.trace('parse_struct_body');

	const ast_node = new StructBody();

	ast_node.open_brace = punc_open_brace.match(state);

	if (! ast_node.open_brace) {
		state.fatal('expected beginning of struct body opening brace "{"');
	}
	
	ast_node.close_brace = parse_struct_scope(state, ast_node.children);

	return ast_node;
}

function parse_struct_params(state: ParserState) : StructParamsListNode {
	const open_paren = punc_open_paren.match(state);

	if (! open_paren) {
		return null;
	}

	const param_list = new StructParamsListNode();
	param_list.open_paren = open_paren;

	state.scan_through_comments_and_whitespace(param_list.children);

	let name: NameToken_normal;

	while (name = name_normal.match(state)) {
		const param = new StructParamNode();
		param_list.params.push(param);
		param.name = name;

		state.scan_through_comments_and_whitespace(param_list.children);

		param.punc_colon = punc_colon.match(state);

		if (! param.punc_colon) {
			state.fatal('expected colon ":" after param name to begin type definition');
		}

		state.scan_through_comments_and_whitespace(param_list.children);

		param.param_type = parse_type_expr(state);

		if (! param.param_type) {
			state.fatal('expected param type definition');
		}

		state.scan_through_comments_and_whitespace(param_list.children);

		param.separator = punc_separator.match(state);

		if (! param.separator) {
			break;
		}

		state.scan_through_comments_and_whitespace(param_list.children);
	}

	param_list.close_paren = punc_close_paren.match(state);

	if (! param_list.close_paren) {
		if (param_list.params.length) {
			state.fatal('expected closing paren ")" or a separator "," followed by more params');
		}
		
		state.fatal('expected closing paren ")" or list of params');
	}

	return param_list;
}

function parse_struct_scope(state: ParserState, children: StructElem[]) : PuncToken_close_brace {
	state.step_down();
	state.trace('parse_struct_scope');

	read_loop:
	while (! state.eof()) {
		if (state.scan_through_comments_and_whitespace(children)) {
			if (state.eof()) {
				state.fatal('unexpected eof while parsing struct scope');
			}
		}

		const close_brace = punc_close_brace.match(state);

		if (close_brace) {
			state.step_up();
			return close_brace;
		}

		for (let parser of struct_scope_parsers) {
			const node = parser(state);

			if (node) {
				children.push(node);
				continue read_loop;
			}
		}

		state.fatal('expected end of struct closing brace "}"');
	}
}

function parse_struct_field(state: ParserState) : StructField {
	state.step_down();
	state.trace('parse_struct_field');

	const field_name = name_normal.match(state);

	if (! field_name) {
		return null;
	}

	const field = new StructField();
	field.field_name = field_name;

	state.scan_through_comments_and_whitespace(field.children);

	field.optional_condition = parse_struct_field_optional_condition(state);

	state.scan_through_comments_and_whitespace(field.children);

	field.field_type_colon = punc_colon.match(state);

	if (! field.field_type_colon) {
		state.fatal('expected struct field type declaration opening colon ":"');
	}

	state.scan_through_comments_and_whitespace(field.children);

	field.field_type = parse_type_expr(state);

	if (! field.field_type) {
		state.fatal('expected struct field type declaration');
	}

	state.scan_through_comments_and_whitespace(field.children);

	field.optional_assign = punc_assign.match(state);

	if (field.optional_assign) {
		state.scan_through_comments_and_whitespace(field.children);

		field.optional_value = parse_value_expr(state);

		if (! field.optional_value) {
			state.fatal('expected value expression following assignment operator');
		}

		state.scan_through_comments_and_whitespace(field.children);
	}

	field.terminator = punc_terminator.match(state);

	if (! field.terminator) {
		state.fatal('expected struct field terminator ";"');
	}
	
	state.step_up();
	return field;
}

function parse_struct_field_optional_condition(state: ParserState) : StructFieldOptionalCondition {
	state.trace('parse_struct_field_optional_condition');

	const question = punc_condition.match(state);

	if (! question) {
		return null;
	}

	const ast_node = new StructFieldOptionalCondition();
	ast_node.question = question;

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.open_paren = punc_open_paren.match(state);

	if (! ast_node.open_paren) {
		state.fatal('expected opening paren "(" preceeding conditional bool expression');
	}

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.condition = parse_bool_expr(state);

	if (! ast_node) {
		state.fatal('expected conditional bool expression');
	}

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.close_paren = punc_close_paren.match(state);

	if (! ast_node.close_paren) {
		state.fatal('expected closing paren ")" following conditional bool expression');
	}

	state.scan_through_comments_and_whitespace(ast_node.children);

	return ast_node;
}

function parse_struct_expansion(state: ParserState) : StructExpansion {
	state.step_down();
	state.trace('parse_struct_expansion');

	const expansion_op = op_expansion.match(state);

	if (! expansion_op) {
		return null;
	}

	const ast_node = new StructExpansion();
	ast_node.expansion_op = expansion_op;

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.expanded_type = parse_type_expr(state);

	if (! ast_node.expanded_type) {
		state.fatal('expected type expression following struct expansion op "..."');
	}

	state.scan_through_comments_and_whitespace(ast_node.children);

	ast_node.terminator = punc_terminator.match(state);

	if (! ast_node.terminator) {
		state.fatal('expected terminator ";" following struct expansion');
	}

	state.step_up();
	return ast_node;
}
