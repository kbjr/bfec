
import { BoolExpr, BoolExpr_and, BoolExpr_eq, BoolExpr_neq, BoolExpr_not, BoolExpr_or, BoolExpr_xor, node_type } from './ast';
import { Ignored, op_and, op_equal, op_not, op_not_equal, op_or, op_xor, punc_close_paren, punc_open_paren } from './ast/tokens';
import { ParserState } from './state';
import { parse_const_value_expr, parse_value_expr } from './value-expr';

export function parse_bool_expr(state: ParserState) : BoolExpr {
	state.trace('parse_bool_expr');

	let expr: BoolExpr;

	bool_expr_branches:
	{
		const not = op_not.match(state);
	
		if (not) {
			expr = new BoolExpr_not();
			expr.operator = not;
	
			state.scan_through_comments_and_whitespace(expr.children);
			
			expr.expr = parse_bool_expr(state);
	
			if (! expr.expr) {
				state.fatal('expected boolean expression');
			}

			break bool_expr_branches;
		}
	
		const open_paren = punc_open_paren.match(state);
	
		if (open_paren) {
			const ignored: Ignored[] = [ ];
	
			state.scan_through_comments_and_whitespace(ignored);
	
			expr = parse_bool_expr(state);
	
			if (! expr) {
				state.fatal('expected boolean expression');
			}
	
			expr.children.unshift(...ignored);
			state.scan_through_comments_and_whitespace(expr.children);
	
			expr.open_paren = open_paren;
			expr.close_paren = punc_close_paren.match(state);
	
			if (! expr.close_paren) {
				state.fatal('expected closing paren ")"');
			}
	
			break bool_expr_branches;
		}

		const value = parse_value_expr(state) || parse_const_value_expr(state);

		if (value) {
			const ignored: Ignored[] = [ ];

			state.scan_through_comments_and_whitespace(ignored);

			const operator = op_equal.match(state) || op_not_equal.match(state);

			if (! operator) {
				state.fatal('expected comparison operator (e.g. "==" or "!=") following value in bool expression');
			}

			switch (operator.type) {
				case node_type.op_equal:
					expr = new BoolExpr_eq();
					break;
					
				case node_type.op_not_equal:
					expr = new BoolExpr_neq();
					break;
			}

			expr.children.unshift(...ignored);
			state.scan_through_comments_and_whitespace(expr.children);

			expr.lh_expr = value;
			expr.operator = operator;
			expr.rh_expr = parse_value_expr(state) || parse_const_value_expr(state);

			if (! expr.rh_expr) {
				state.fatal('expected value following comparison operator in bool expression');
			}
		}
	}

	if (! expr) {
		return null;
	}

	while (true) {
		const branch = state.branch();
		const ignored: Ignored[] = [ ];
	
		branch.scan_through_comments_and_whitespace(ignored);
		
		const operator = op_and.match(branch) || op_or.match(branch) || op_xor.match(branch);
	
		if (! operator) {
			return expr;
		}
	
		state.commit_branch(branch);
	
		const lh_expr = expr;
		
		switch (operator.type) {
			case node_type.op_and:
				expr = new BoolExpr_and();
				break;
				
			case node_type.op_or:
				expr = new BoolExpr_or();
				break;
				
			case node_type.op_xor:
				expr = new BoolExpr_xor();
				break;
		}
	
		branch.scan_through_comments_and_whitespace(expr.children);
		
		expr.lh_expr = lh_expr;
		expr.operator = operator;
		expr.rh_expr = parse_bool_expr(state);
	}
}
