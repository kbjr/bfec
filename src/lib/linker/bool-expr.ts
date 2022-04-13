
import { ast } from '../parser';
import { ConstInt, ConstString } from './const';
import { SchemaNode } from './node';
import { pos, PositionRange } from './pos';
import { EnumMemberRef, StructFieldRef } from './ref';

export type BoolOperand = StructFieldRef | EnumMemberRef | ConstInt | ConstString;

export type BoolExpr = BoolExpr_not | BoolExpr_and | BoolExpr_or | BoolExpr_xor | BoolExpr_eq | BoolExpr_neq;

export abstract class AbstractBoolExpr implements SchemaNode {
	public type = 'bool_expr' as const;
	public operator: string;
	
	public abstract ast_node: ast.BoolExpr;
	public abstract get pos() : PositionRange;
}

export class BoolExpr_not extends AbstractBoolExpr {
	public operator = 'not' as const;
	public operand: BoolExpr;
	public ast_node: ast.BoolExpr_not;

	public get pos() {
		if (this.ast_node.open_paren) {
			return pos(this.ast_node.open_paren, this.ast_node.close_paren);
		}

		// FIXME: This implementation causes tsc to crash
		// const { start } = pos(this.ast_node.operator);
		// const { end } = this.operand.pos;
		// return { start, end };
		return null;
	}

	public toJSON() {
		return {
			type: this.type,
			operator: this.operator,
			operand: this.operand,
		};
	}
}

export class BoolExpr_and extends AbstractBoolExpr {
	public operator = 'and' as const;
	public lh_operand: BoolExpr;
	public rh_operand: BoolExpr;
	public ast_node: ast.BoolExpr_and;

	public get pos() {
		if (this.ast_node.open_paren) {
			return pos(this.ast_node.open_paren, this.ast_node.close_paren);
		}

		// FIXME: This implementation causes tsc to crash
		// const { start } = this.lh_operand.pos;
		// const { end } = this.rh_operand.pos;
		// return { start, end };
		return null;
	}

	public toJSON() {
		return {
			type: this.type,
			operator: this.operator,
			lh_operand: this.lh_operand,
			rh_operand: this.rh_operand,
		};
	}
}

export class BoolExpr_or extends AbstractBoolExpr {
	public operator = 'or' as const;
	public lh_operand: BoolExpr;
	public rh_operand: BoolExpr;
	public ast_node: ast.BoolExpr_or;

	public get pos() {
		if (this.ast_node.open_paren) {
			return pos(this.ast_node.open_paren, this.ast_node.close_paren);
		}

		// FIXME: This implementation causes tsc to crash
		// const { start } = this.lh_operand.pos;
		// const { end } = this.rh_operand.pos;
		// return { start, end };
		return null;
	}

	public toJSON() {
		return {
			type: this.type,
			operator: this.operator,
			lh_operand: this.lh_operand,
			rh_operand: this.rh_operand,
		};
	}
}

export class BoolExpr_xor extends AbstractBoolExpr {
	public operator = 'xor' as const;
	public lh_operand: BoolExpr;
	public rh_operand: BoolExpr;
	public ast_node: ast.BoolExpr_xor;

	public get pos() {
		if (this.ast_node.open_paren) {
			return pos(this.ast_node.open_paren, this.ast_node.close_paren);
		}

		// FIXME: This implementation causes tsc to crash
		// const { start } = this.lh_operand.pos;
		// const { end } = this.rh_operand.pos;
		// return { start, end };
		return null;
	}

	public toJSON() {
		return {
			type: this.type,
			operator: this.operator,
			lh_operand: this.lh_operand,
			rh_operand: this.rh_operand,
		};
	}
}

export class BoolExpr_eq extends AbstractBoolExpr {
	public operator = 'eq' as const;
	public lh_operand: BoolOperand;
	public rh_operand: BoolOperand;
	public ast_node: ast.BoolExpr_eq;

	public get pos() {
		if (this.ast_node.open_paren) {
			return pos(this.ast_node.open_paren, this.ast_node.close_paren);
		}

		// FIXME: This implementation causes tsc to crash
		// const { start } = this.lh_operand.pos;
		// const { end } = this.rh_operand.pos;
		// return { start, end };
		return null;
	}

	public toJSON() {
		return {
			type: this.type,
			operator: this.operator,
			lh_operand: this.lh_operand,
			rh_operand: this.rh_operand,
		};
	}
}

export class BoolExpr_neq extends AbstractBoolExpr {
	public operator = 'neq' as const;
	public lh_operand: BoolOperand;
	public rh_operand: BoolOperand;
	public ast_node: ast.BoolExpr_neq;

	public get pos() {
		if (this.ast_node.open_paren) {
			return pos(this.ast_node.open_paren, this.ast_node.close_paren);
		}

		// FIXME: This implementation causes tsc to crash
		// const { start } = this.lh_operand.pos;
		// const { end } = this.rh_operand.pos;
		// return { start, end };
		return null;
	}

	public toJSON() {
		return {
			type: this.type,
			operator: this.operator,
			lh_operand: this.lh_operand,
			rh_operand: this.rh_operand,
		};
	}
}
