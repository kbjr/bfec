
export interface Token {
	readonly type: number;
}

export interface ASTNode {
	readonly type: ASTNodeType;
	readonly line: number;
	readonly char: number;
	readonly offset: number;
	readonly length: number;
}

export enum ASTNodeType {
	unknown                   = 'unknown',
	comment                   = 'comment',
	file                      = 'file',
	identifier                = 'identifier',
	keyword                   = 'keyword',
	name_path                 = 'name_path',
	operator                  = 'operator',
	punctuation               = 'punctuation',
	type_params               = 'type_params',
	whitespace                = 'whitespace',
	declaration               = 'declaration',
	expression                = 'expression',
	statement                 = 'statement',
	type_expression           = 'type_expression',
	wasm_standard_instruction = 'wasm_standard_instruction',
	wasm_local                = 'wasm_local',
	wasm_memarg               = 'wasm_memarg',
	wasm_memarg_align         = 'wasm_memarg_align',
	wasm_param                = 'wasm_param',
	wasm_result               = 'wasm_result',
}

export interface FileNode extends ASTNode {
	readonly type: ASTNodeType.file;
	readonly name: string;
	readonly children: ASTNode[];
}

export interface CommentNode extends ASTNode {
	readonly type: ASTNodeType.comment;
	readonly subtype: CommentNodeSubtype;
}

export enum CommentNodeSubtype {
	block = 'block',
	line  = 'line',
	wasm  = 'wasm',
}

export type WhitespaceNode = ASTNode;

export interface KeywordNode extends ASTNode {
	readonly type: ASTNodeType.keyword;
	readonly subtype: KeywordNodeSubtype;
	readonly keyword: Keyword;
}

export enum KeywordNodeSubtype {
	modifier     = 'modifier',
	entity       = 'entity',
	ctrl         = 'ctrl',
	wasm_keyword = 'wasm_keyword',
	wasm_type    = 'wasm_type',
	wasm_inst    = 'wasm_inst',
}

export enum Keyword {
	abstract            = 'abstract',
	async               = 'async',
	extends             = 'extends',
	final               = 'final',
	inline              = 'inline',
	private             = 'private',
	protected           = 'protected',
	public              = 'public',
	readonly            = 'readonly',
	static              = 'static',
	unsafe              = 'unsafe',
	wasm                = 'wasm',
	extern              = 'extern',
	dynamic             = 'dynamic',
	mut                 = 'mut',
	immut               = 'immut',
	class               = 'class',
	const               = 'const',
	enum                = 'enum',
	friend              = 'friend',
	from                = 'from',
	as                  = 'as',
	function            = 'function',
	implement           = 'implement',
	let                 = 'let',
	macro               = 'macro',
	namespace           = 'namespace',
	operator            = 'operator',
	struct              = 'struct',
	trait               = 'trait',
	type                = 'type',
	break               = 'break',
	continue            = 'continue',
	do                  = 'do',
	for                 = 'for',
	if                  = 'if',
	unless              = 'unless',
	else                = 'else',
	loop                = 'loop',
	return              = 'return',
	switch              = 'switch',
	case                = 'case',
	default             = 'default',
	throw               = 'throw',
	try                 = 'try',
	catch               = 'catch',
	finally             = 'finally',
	unreachable         = 'unreachable',
	while               = 'while',
	until               = 'until',
	yield               = 'yield',
	local               = 'local',
	param               = 'param',
	result              = 'result',
	align_              = 'align=',
	offset_             = 'offset=',
	i32                 = 'i32',
	i64                 = 'i64',
	f32                 = 'f32',
	f64                 = 'f64',
	v128                = 'v128',
	funcref             = 'funcref',
	externref           = 'externref',
	global_get          = 'global.get',
	global_set          = 'global.set',
	local_get           = 'local.get',
	local_set           = 'local.set',
	local_tee           = 'local.tee',
	drop                = 'drop',
	select              = 'select',
	memory_grow         = 'memory.grow',
	memory_size         = 'memory.size',
	block               = 'block',
	br_if               = 'br_if',
	br_table            = 'br_table',
	br                  = 'br',
	call_indirect       = 'call_indirect',
	call                = 'call',
	nop                 = 'nop',
	f32_const           = 'f32.const',
	f32_load            = 'f32.load',
	f32_store           = 'f32.store',
	f32_convert_i32_s   = 'f32.convert_i32_s',
	f32_convert_i32_u   = 'f32.convert_i32_u',
	f32_convert_i64_s   = 'f32.convert_i64_s',
	f32_convert_i64_u   = 'f32.convert_i64_u',
	f32_demote_f64      = 'f32.demote_f64',
	f32_reinterpret_i32 = 'f32.reinterpret_i32',
	f32_eq              = 'f32.eq',
	f32_ge              = 'f32.ge',
	f32_gt              = 'f32.gt',
	f32_le              = 'f32.le',
	f32_lt              = 'f32.lt',
	f32_ne              = 'f32.ne',
	f32_abs             = 'f32.abs',
	f32_add             = 'f32.add',
	f32_ceil            = 'f32.ceil',
	f32_copysign        = 'f32.copysign',
	f32_div             = 'f32.div',
	f32_floor           = 'f32.floor',
	f32_max             = 'f32.max',
	f32_min             = 'f32.min',
	f32_mul             = 'f32.mul',
	f32_nearest         = 'f32.nearest',
	f32_neg             = 'f32.neg',
	f32_sqrt            = 'f32.sqrt',
	f32_sub             = 'f32.sub',
	f32_trunc           = 'f32.trunc',
	f64_const           = 'f64.const',
	f64_load            = 'f64.load',
	f64_store           = 'f64.store',
	f64_convert_i32_s   = 'f64.convert_i32_s',
	f64_convert_i32_u   = 'f64.convert_i32_u',
	f64_convert_i64_s   = 'f64.convert_i64_s',
	f64_convert_i64_u   = 'f64.convert_i64_u',
	f64_promote_f32     = 'f64.promote_f32',
	f64_reinterpret_i64 = 'f64.reinterpret_i64',
	f64_eq              = 'f64.eq',
	f64_ge              = 'f64.ge',
	f64_gt              = 'f64.gt',
	f64_le              = 'f64.le',
	f64_lt              = 'f64.lt',
	f64_ne              = 'f64.ne',
	f64_abs             = 'f64.abs',
	f64_add             = 'f64.add',
	f64_ceil            = 'f64.ceil',
	f64_copysign        = 'f64.copysign',
	f64_div             = 'f64.div',
	f64_floor           = 'f64.floor',
	f64_max             = 'f64.max',
	f64_min             = 'f64.min',
	f64_mul             = 'f64.mul',
	f64_nearest         = 'f64.nearest',
	f64_neg             = 'f64.neg',
	f64_sqrt            = 'f64.sqrt',
	f64_sub             = 'f64.sub',
	f64_trunc           = 'f64.trunc',
	i32_const           = 'i32.const',
	i32_load            = 'i32.load',
	i32_load8_s         = 'i32.load8_s',
	i32_load8_u         = 'i32.load8_u',
	i32_load16_s        = 'i32.load16_s',
	i32_load16_u        = 'i32.load16_u',
	i32_store           = 'i32.store',
	i32_store8          = 'i32.store8',
	i32_store16         = 'i32.store16',
	i32_and             = 'i32.and',
	i32_clz             = 'i32.clz',
	i32_ctz             = 'i32.ctz',
	i32_or              = 'i32.or',
	i32_popcnt          = 'i32.popcnt',
	i32_rotl            = 'i32.rotl',
	i32_rotr            = 'i32.rotr',
	i32_shl             = 'i32.shl',
	i32_shr_s           = 'i32.shr_s',
	i32_shr_u           = 'i32.shr_u',
	i32_xor             = 'i32.xor',
	i32_reinterpret_f32 = 'i32.reinterpret_f32',
	i32_trunc_f32_s     = 'i32.trunc_f32_s',
	i32_trunc_f32_u     = 'i32.trunc_f32_u',
	i32_trunc_f64_s     = 'i32.trunc_f64_s',
	i32_trunc_f64_u     = 'i32.trunc_f64_u',
	i32_trunc_sat_f32_s = 'i32.trunc_sat_f32_s',
	i32_trunc_sat_f32_u = 'i32.trunc_sat_f32_u',
	i32_trunc_sat_f64_s = 'i32.trunc_sat_f64_s',
	i32_trunc_sat_f64_u = 'i32.trunc_sat_f64_u',
	i32_wrap_i64        = 'i32.wrap_i64',
	i32_eq              = 'i32.eq',
	i32_eqz             = 'i32.eqz',
	i32_ge_s            = 'i32.ge_s',
	i32_ge_u            = 'i32.ge_u',
	i32_gt_s            = 'i32.gt_s',
	i32_gt_u            = 'i32.gt_u',
	i32_le_s            = 'i32.le_s',
	i32_le_u            = 'i32.le_u',
	i32_lt_s            = 'i32.lt_s',
	i32_lt_u            = 'i32.lt_u',
	i32_ne              = 'i32.ne',
	i32_add             = 'i32.add',
	i32_div_s           = 'i32.div_s',
	i32_div_u           = 'i32.div_u',
	i32_mul             = 'i32.mul',
	i32_rem_s           = 'i32.rem_s',
	i32_rem_u           = 'i32.rem_u',
	i32_sub             = 'i32.sub',
	i64_const           = 'i64.const',
	i64_load            = 'i64.load',
	i64_load8_s         = 'i64.load8_s',
	i64_load8_u         = 'i64.load8_u',
	i64_load16_s        = 'i64.load16_s',
	i64_load16_u        = 'i64.load16_u',
	i64_load32_s        = 'i64.load32_s',
	i64_load32_u        = 'i64.load32_u',
	i64_store           = 'i64.store',
	i64_store8          = 'i64.store8',
	i64_store16         = 'i64.store16',
	i64_store32         = 'i64.store32',
	i64_and             = 'i64.and',
	i64_clz             = 'i64.clz',
	i64_ctz             = 'i64.ctz',
	i64_or              = 'i64.or',
	i64_popcnt          = 'i64.popcnt',
	i64_rotl            = 'i64.rotl',
	i64_rotr            = 'i64.rotr',
	i64_shl             = 'i64.shl',
	i64_shr_s           = 'i64.shr_s',
	i64_shr_u           = 'i64.shr_u',
	i64_xor             = 'i64.xor',
	i64_extend_i32_s    = 'i64.extend_i32_s',
	i64_extend_i32_u    = 'i64.extend_i32_u',
	i64_reinterpret_f64 = 'i64.reinterpret_f64',
	i64_trunc_f32_s     = 'i64.trunc_f32_s',
	i64_trunc_f32_u     = 'i64.trunc_f32_u',
	i64_trunc_f64_s     = 'i64.trunc_f64_s',
	i64_trunc_f64_u     = 'i64.trunc_f64_u',
	i64_trunc_sat_f32_s = 'i64.trunc_sat_f32_s',
	i64_trunc_sat_f32_u = 'i64.trunc_sat_f32_u',
	i64_trunc_sat_f64_s = 'i64.trunc_sat_f64_s',
	i64_trunc_sat_f64_u = 'i64.trunc_sat_f64_u',
	i64_eq              = 'i64.eq',
	i64_eqz             = 'i64.eqz',
	i64_ge_s            = 'i64.ge_s',
	i64_ge_u            = 'i64.ge_u',
	i64_gt_s            = 'i64.gt_s',
	i64_gt_u            = 'i64.gt_u',
	i64_le_s            = 'i64.le_s',
	i64_le_u            = 'i64.le_u',
	i64_lt_s            = 'i64.lt_s',
	i64_lt_u            = 'i64.lt_u',
	i64_ne              = 'i64.ne',
	i64_add             = 'i64.add',
	i64_div_s           = 'i64.div_s',
	i64_div_u           = 'i64.div_u',
	i64_mul             = 'i64.mul',
	i64_rem_s           = 'i64.rem_s',
	i64_rem_u           = 'i64.rem_u',
	i64_sub             = 'i64.sub',
	$i32                = '$i32',
	$i64                = '$i64',
	$f32                = '$f32',
	$f64                = '$f64',
	$funcref            = '$funcref',
	$externref          = '$externref',
	$v128               = '$v128',
	$v128_i8x16         = '$v128_i8x16',
	$v128_i16x8         = '$v128_i16x8',
	$v128_i32x4         = '$v128_i32x4',
	$v128_i64x2         = '$v128_i64x2',
	$v128_f32x4         = '$v128_f32x4',
	$v128_f64x2         = '$v128_f64x2',
}

export interface PunctuationNode extends ASTNode {
	readonly type: ASTNodeType.punctuation;
	readonly subtype: PunctuationNodeSubtype;
}

export enum PunctuationNodeSubtype {
	semicolon            = 'semicolon',
	comma                = 'comma',
	declare_type         = 'declare_type',
	declare_label        = 'declare_label',
	open_angle_bracket   = 'open_angle_bracket',
	close_angle_bracket  = 'close_angle_bracket',
	open_brace           = 'open_brace',
	close_brace          = 'close_brace',
	open_paren           = 'open_paren',
	close_paren          = 'close_paren',
	open_square_bracket  = 'open_square_bracket',
	close_square_bracket = 'close_square_bracket',
}

export interface IdentifierNode extends ASTNode {
	readonly type: ASTNodeType.identifier;
	readonly subtype: IdentifierNodeSubtype;
}

export enum IdentifierNodeSubtype {
	// TODO: IdentifierNodeSubtype
}

export interface StatementNode extends ASTNode {
	readonly type: ASTNodeType.statement;
	readonly extraneous: (WhitespaceNode | CommentNode)[];
	readonly subtype: StatementNodeSubtype;
}

export enum StatementNodeSubtype {
	expression  = 'expression',
	break       = 'break',
	continue    = 'continue',
	condition   = 'condition',
	do          = 'do',
	else        = 'else',
	label       = 'label',
	loop        = 'loop',
	return      = 'return',
	throw       = 'throw',
	unreachable = 'unreachable',
	unsafe      = 'unsafe',
	while       = 'while',
	until       = 'until',
	yield       = 'yield',
}

export interface ExpressionStatementNode extends StatementNode {
	readonly subtype: StatementNodeSubtype.expression;
	readonly expression: ExpressionNode;
	readonly terminator: PunctuationNode;
}

export interface BreakStatementNode extends StatementNode {
	readonly subtype: StatementNodeSubtype.break;
	readonly break_keyword: KeywordNode;
	readonly label?: IdentifierNode;
	readonly terminator: PunctuationNode;
}

export interface ContinueStatementNode extends StatementNode {
	readonly subtype: StatementNodeSubtype.continue;
	readonly break_keyword: KeywordNode;
	readonly label?: IdentifierNode;
	readonly terminator: PunctuationNode;
}

// 

export interface ExpressionNode {
	readonly type: ASTNodeType.expression;
	// 
}

// 

export interface TypeExpressionNode {
	readonly type: ASTNodeType.type_expression;
	// 
}

/*
export class ConditionStatementNode extends StatementNode {
  open_paren: usize;
  close_paren: usize;
  expression: usize;
}
export class DoStatementNode extends StatementNode {
  readonly children: usize;
  open_brace: usize;
  close_brace: usize;
  label: usize;
  do_keyword: usize;
  close(close_brace: usize): void;
}
export class IfStatementNode extends StatementNode {
  readonly children: usize;
  open_brace: usize;
  close_brace: usize;
  label: usize;
  else_keyword: usize;
  if_keyword: usize;
  condition: usize;
  close(close_brace: usize): void;
}
export class UnlessStatementNode extends StatementNode {
  readonly children: usize;
  open_brace: usize;
  close_brace: usize;
  label: usize;
  else_keyword: usize;
  unless_keyword: usize;
  condition: usize;
  close(close_brace: usize): void;
}
export class ElseStatementNode extends StatementNode {
  readonly children: usize;
  open_brace: usize;
  close_brace: usize;
  label: usize;
  else_keyword: usize;
  close(close_brace: usize): void;
}
export class LabelStatementNode extends StatementNode {
  label_name: usize;
  label_punc: usize;
}
export class LoopStatementNode extends StatementNode {
  readonly children: usize;
  open_brace: usize;
  close_brace: usize;
  label: usize;
  loop_keyword: usize;
  close(close_brace: usize): void;
}
export class ReturnStatementNode extends StatementNode {
  return_keyword: usize;
  expression: usize;
  terminator: usize;
}
export class ThrowStatementNode extends StatementNode {
  throw_keyword: usize;
  expression: usize;
  terminator: usize;
}
export class UnreachableStatementNode extends StatementNode {
  unreachable_keyword: usize;
  terminator: usize;
}
export class UnsafeStatementNode extends StatementNode {
  readonly children: usize;
  open_brace: usize;
  close_brace: usize;
  label: usize;
  unsafe_keyword: usize;
  close(close_brace: usize): void;
}
export class WhileStatementNode extends StatementNode {
  readonly children: usize;
  open_brace: usize;
  close_brace: usize;
  label: usize;
  while_keyword: usize;
  condition: usize;
  close(close_brace: usize): void;
}
export class UntilStatementNode extends StatementNode {
  readonly children: usize;
  open_brace: usize;
  close_brace: usize;
  label: usize;
  until_keyword: usize;
  condition: usize;
  close(close_brace: usize): void;
}
export class YieldStatementNode extends StatementNode {
  yield_keyword: usize;
  expression: usize;
  terminator: usize;
}
export class ArrayTypeExprNode extends TypeExpressionNode {
  expression: usize;
  operator: usize;
}
export class EnumTypeExprNode extends TypeExpressionNode {
  operator: usize;
  lh_operand: usize;
  rh_operand: usize;
}
export class NamedTypeExprNode extends TypeExpressionNode {
  name_path: usize;
  type_params: usize;
}
export class ParenGroupTypeExprNode extends TypeExpressionNode {
  operator: usize;
  expression: usize;
}
export class CallSignatureTypeExprNode extends TypeExpressionNode {
  async_modifier: usize;
  function_keyword: usize;
  type_params: usize;
  params: usize;
  return_type: usize;
}
export class TupleTypeExprNode extends TypeExpressionNode {
  operator: usize;
  elements: usize;
  separators: usize;
}
export abstract class TypeExpressionNode extends ASTNode {
  readonly extraneous: usize;
  subtype: usize;
  static_modifier: usize;
  immutable_modifier: usize;
}
export class UnionTypeExprNode extends TypeExpressionNode {
  operator: usize;
  lh_operand: usize;
  rh_operand: usize;
}
export class WasmTypeExprNode extends TypeExpressionNode {
  wasm_type: usize;
}
export class ConstDeclarationNode extends DeclarationNode {
  access_modifier: usize;
  finality_modifier: usize;
  static_modifier: usize;
  const_keyword: usize;
  identifier: usize;
  value_type: usize;
  initializer: usize;
  terminator: usize;
}
export abstract class DeclarationNode extends ASTNode {
  subtype: usize;
  readonly extraneous: usize;
}
export class FriendDeclarationNode extends DeclarationNode {
  friend_keyword: usize;
  other_keyword: usize;
  name_path: usize;
  terminator: usize;
}
export class FromDeclarationNode extends DeclarationNode {
  identifier: usize;
  named_imports: usize;
  terminator: usize;
  access_modifier: usize;
  from_keyword: usize;
  extern_keyword: usize;
  source_expr: usize;
  close(terminator: usize): void;
}
export class NamedImportDeclarationNode extends DeclarationNode {
  name: usize;
  as_keyword: usize;
  alias: usize;
  data_type: usize;
}
export class NamedImportDeclarationListNode extends DeclarationNode {
  open: usize;
  close: usize;
  imports: usize;
  extern_func_imports: usize;
  separators: usize;
}
export class FunctionDeclarationNode extends DeclarationNode {
  readonly children: usize;
  open_brace: usize;
  close_brace: usize;
  close_semicolon: usize;
  access_modifier: usize;
  finality_modifier: usize;
  static_modifier: usize;
  unsafe_modifier: usize;
  inlining_modifier: usize;
  wasm_modifier: usize;
  async_modifier: usize;
  function_keyword: usize;
  identifier: usize;
  type_params: usize;
  params: usize;
  return_type_punc: usize;
  return_type_expr: usize;
  close_block(close_brace: usize): void;
  close_abstract(close_semicolon: usize): void;
}
export class InitializerDeclarationNode extends DeclarationNode {
  assign_op: usize;
  expression: usize;
}
export class LetDeclarationNode extends DeclarationNode {
  access_modifier: usize;
  finality_modifier: usize;
  static_modifier: usize;
  readonly_modifier: usize;
  let_keyword: usize;
  identifier: usize;
  value_type: usize;
  initializer: usize;
  terminator: usize;
}
export class NamespaceDeclarationNode extends DeclarationNode {
  readonly children: usize;
  open_brace: usize;
  close_brace: usize;
  access_modifier: usize;
  namespace_keyword: usize;
  identifier: usize;
  close(close_brace: usize): void;
}
export class ParamDeclarationNode extends DeclarationNode {
  ref_type: i32;
  name: usize;
  value_type: usize;
  initializer: usize;
}
export class ParamDeclarationListNode extends DeclarationNode {
  operator: usize;
  params: usize;
  separators: usize;
}
export class TypeAliasDeclarationNode extends DeclarationNode {
  access_modifier: usize;
  type_keyword: usize;
  identifier: usize;
  assign_op: usize;
  type_expr: usize;
  terminator: usize;
}
export class TypePrimitiveDeclarationNode extends DeclarationNode {
  readonly children: usize;
  open_brace: usize;
  close_brace: usize;
  access_modifier: usize;
  type_keyword: usize;
  identifier: usize;
  value_type: usize;
  close(close_brace: usize): void;
}
export class TypeParamDeclarationNode extends DeclarationNode {
  name: usize;
  constraint_punc: usize;
  constraint_expr: usize;
}
export class TypeParamDeclarationListNode extends DeclarationNode {
  operator: usize;
  type_params: usize;
  separators: usize;
}
export class ValueTypeDeclarationNode extends DeclarationNode {
  punc: usize;
  type_expr: usize;
}
export abstract class ExpressionNode extends ASTNode {
  readonly extraneous: usize;
  subtype: usize;
}
export class LiteralExprNode extends ExpressionNode {
  literal_type: usize;
}
export class UnaryPrefixExprNode extends ExpressionNode {
  operator: usize;
  operand: usize;
}
export class UnaryPostfixExprNode extends ExpressionNode {
  operator: usize;
  operand: usize;
}
export class BinaryExprNode extends ExpressionNode {
  operator: usize;
  lh_operand: usize;
  rh_operand: usize;
}
export class BuildExprNode extends ExpressionNode {
  operator: usize;
  name_path: usize;
}
export class GroupExprNode extends ExpressionNode {
  open: usize;
  close: usize;
  operand: usize;
}
export class IdentifierExprNode extends ExpressionNode {
  identifier_type: usize;
}
export class IndexAccessExprNode extends ExpressionNode {
  operator: usize;
  lh_operand: usize;
  rh_operand: usize;
}
export class SizeOfTypeExprNode extends ExpressionNode {
  sizeof: usize;
  operator: usize;
  operand: usize;
}
export class SizeOfValueExprNode extends ExpressionNode {
  sizeof: usize;
  operator: usize;
  operand: usize;
}
export class TypeCastExprNode extends ExpressionNode {
  operator: usize;
  type_operand: usize;
  value_operand: usize;
}
export class CallExprNode extends ExpressionNode {
  callee: usize;
  type_params: usize;
  params: usize;
}
export class TypeParamsExprNode extends ExpressionNode {
  operator: usize;
  type_params: usize;
  separators: usize;
}
export class NamePathNode extends ASTNode {
  readonly extraneous: usize;
  names: usize;
  separators: usize;
}
export class TypeParamsNode extends ASTNode {
  readonly extraneous: usize;
  operator: usize;
  type_params: usize;
  separators: usize;
}
export class WasmLocalNode extends ASTNode {
  readonly extraneous: usize;
  open_paren: usize;
  close_paren: usize;
  local_keyword: usize;
  data_type: usize;
  name: usize;
}
export class WasmParamNode extends ASTNode {
  readonly extraneous: usize;
  open_paren: usize;
  close_paren: usize;
  param_keyword: usize;
  data_type: usize;
  name: usize;
}
export class WasmResultNode extends ASTNode {
  readonly extraneous: usize;
  open_paren: usize;
  close_paren: usize;
  result_keyword: usize;
  data_type: usize;
}
export class WasmMemargNode extends ASTNode {
  readonly extraneous: usize;
  mem_offset: usize;
  mem_align: usize;
}
export class WasmMemargOffsetNode extends ASTNode {
  offset_keyword: usize;
  offset_value: usize;
}
export class WasmMemargAlignNode extends ASTNode {
  align_keyword: usize;
  align_value: usize;
}
export class WasmInstructionNode extends ASTNode {
  readonly children: usize;
  readonly extraneous: usize;
  close_paren: usize;
  memarg_immediate: usize;
  lane_index_immediate: usize;
  data_index_immediate: usize;
  elem_index_immediate: usize;
  table_index_immediate: usize;
  func_index_immediate: usize;
  var_ref_immediate: usize;
  label_ref_immediate: usize;
  const_immediate: usize;
  const_vec_immediate: usize;
  open_paren: usize;
  opname: usize;
  close(close_paren: usize): void;
}
*/
