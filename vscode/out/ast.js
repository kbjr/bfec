"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatementNodeSubtype = exports.IdentifierNodeSubtype = exports.PunctuationNodeSubtype = exports.Keyword = exports.KeywordNodeSubtype = exports.CommentNodeSubtype = exports.ASTNodeType = void 0;
var ASTNodeType;
(function (ASTNodeType) {
    ASTNodeType["unknown"] = "unknown";
    ASTNodeType["comment"] = "comment";
    ASTNodeType["file"] = "file";
    ASTNodeType["identifier"] = "identifier";
    ASTNodeType["keyword"] = "keyword";
    ASTNodeType["name_path"] = "name_path";
    ASTNodeType["operator"] = "operator";
    ASTNodeType["punctuation"] = "punctuation";
    ASTNodeType["type_params"] = "type_params";
    ASTNodeType["whitespace"] = "whitespace";
    ASTNodeType["declaration"] = "declaration";
    ASTNodeType["expression"] = "expression";
    ASTNodeType["statement"] = "statement";
    ASTNodeType["type_expression"] = "type_expression";
    ASTNodeType["wasm_standard_instruction"] = "wasm_standard_instruction";
    ASTNodeType["wasm_local"] = "wasm_local";
    ASTNodeType["wasm_memarg"] = "wasm_memarg";
    ASTNodeType["wasm_memarg_align"] = "wasm_memarg_align";
    ASTNodeType["wasm_param"] = "wasm_param";
    ASTNodeType["wasm_result"] = "wasm_result";
})(ASTNodeType = exports.ASTNodeType || (exports.ASTNodeType = {}));
var CommentNodeSubtype;
(function (CommentNodeSubtype) {
    CommentNodeSubtype["block"] = "block";
    CommentNodeSubtype["line"] = "line";
    CommentNodeSubtype["wasm"] = "wasm";
})(CommentNodeSubtype = exports.CommentNodeSubtype || (exports.CommentNodeSubtype = {}));
var KeywordNodeSubtype;
(function (KeywordNodeSubtype) {
    KeywordNodeSubtype["modifier"] = "modifier";
    KeywordNodeSubtype["entity"] = "entity";
    KeywordNodeSubtype["ctrl"] = "ctrl";
    KeywordNodeSubtype["wasm_keyword"] = "wasm_keyword";
    KeywordNodeSubtype["wasm_type"] = "wasm_type";
    KeywordNodeSubtype["wasm_inst"] = "wasm_inst";
})(KeywordNodeSubtype = exports.KeywordNodeSubtype || (exports.KeywordNodeSubtype = {}));
var Keyword;
(function (Keyword) {
    Keyword["abstract"] = "abstract";
    Keyword["async"] = "async";
    Keyword["extends"] = "extends";
    Keyword["final"] = "final";
    Keyword["inline"] = "inline";
    Keyword["private"] = "private";
    Keyword["protected"] = "protected";
    Keyword["public"] = "public";
    Keyword["readonly"] = "readonly";
    Keyword["static"] = "static";
    Keyword["unsafe"] = "unsafe";
    Keyword["wasm"] = "wasm";
    Keyword["extern"] = "extern";
    Keyword["dynamic"] = "dynamic";
    Keyword["mut"] = "mut";
    Keyword["immut"] = "immut";
    Keyword["class"] = "class";
    Keyword["const"] = "const";
    Keyword["enum"] = "enum";
    Keyword["friend"] = "friend";
    Keyword["from"] = "from";
    Keyword["as"] = "as";
    Keyword["function"] = "function";
    Keyword["implement"] = "implement";
    Keyword["let"] = "let";
    Keyword["macro"] = "macro";
    Keyword["namespace"] = "namespace";
    Keyword["operator"] = "operator";
    Keyword["struct"] = "struct";
    Keyword["trait"] = "trait";
    Keyword["type"] = "type";
    Keyword["break"] = "break";
    Keyword["continue"] = "continue";
    Keyword["do"] = "do";
    Keyword["for"] = "for";
    Keyword["if"] = "if";
    Keyword["unless"] = "unless";
    Keyword["else"] = "else";
    Keyword["loop"] = "loop";
    Keyword["return"] = "return";
    Keyword["switch"] = "switch";
    Keyword["case"] = "case";
    Keyword["default"] = "default";
    Keyword["throw"] = "throw";
    Keyword["try"] = "try";
    Keyword["catch"] = "catch";
    Keyword["finally"] = "finally";
    Keyword["unreachable"] = "unreachable";
    Keyword["while"] = "while";
    Keyword["until"] = "until";
    Keyword["yield"] = "yield";
    Keyword["local"] = "local";
    Keyword["param"] = "param";
    Keyword["result"] = "result";
    Keyword["align_"] = "align=";
    Keyword["offset_"] = "offset=";
    Keyword["i32"] = "i32";
    Keyword["i64"] = "i64";
    Keyword["f32"] = "f32";
    Keyword["f64"] = "f64";
    Keyword["v128"] = "v128";
    Keyword["funcref"] = "funcref";
    Keyword["externref"] = "externref";
    Keyword["global_get"] = "global.get";
    Keyword["global_set"] = "global.set";
    Keyword["local_get"] = "local.get";
    Keyword["local_set"] = "local.set";
    Keyword["local_tee"] = "local.tee";
    Keyword["drop"] = "drop";
    Keyword["select"] = "select";
    Keyword["memory_grow"] = "memory.grow";
    Keyword["memory_size"] = "memory.size";
    Keyword["block"] = "block";
    Keyword["br_if"] = "br_if";
    Keyword["br_table"] = "br_table";
    Keyword["br"] = "br";
    Keyword["call_indirect"] = "call_indirect";
    Keyword["call"] = "call";
    Keyword["nop"] = "nop";
    Keyword["f32_const"] = "f32.const";
    Keyword["f32_load"] = "f32.load";
    Keyword["f32_store"] = "f32.store";
    Keyword["f32_convert_i32_s"] = "f32.convert_i32_s";
    Keyword["f32_convert_i32_u"] = "f32.convert_i32_u";
    Keyword["f32_convert_i64_s"] = "f32.convert_i64_s";
    Keyword["f32_convert_i64_u"] = "f32.convert_i64_u";
    Keyword["f32_demote_f64"] = "f32.demote_f64";
    Keyword["f32_reinterpret_i32"] = "f32.reinterpret_i32";
    Keyword["f32_eq"] = "f32.eq";
    Keyword["f32_ge"] = "f32.ge";
    Keyword["f32_gt"] = "f32.gt";
    Keyword["f32_le"] = "f32.le";
    Keyword["f32_lt"] = "f32.lt";
    Keyword["f32_ne"] = "f32.ne";
    Keyword["f32_abs"] = "f32.abs";
    Keyword["f32_add"] = "f32.add";
    Keyword["f32_ceil"] = "f32.ceil";
    Keyword["f32_copysign"] = "f32.copysign";
    Keyword["f32_div"] = "f32.div";
    Keyword["f32_floor"] = "f32.floor";
    Keyword["f32_max"] = "f32.max";
    Keyword["f32_min"] = "f32.min";
    Keyword["f32_mul"] = "f32.mul";
    Keyword["f32_nearest"] = "f32.nearest";
    Keyword["f32_neg"] = "f32.neg";
    Keyword["f32_sqrt"] = "f32.sqrt";
    Keyword["f32_sub"] = "f32.sub";
    Keyword["f32_trunc"] = "f32.trunc";
    Keyword["f64_const"] = "f64.const";
    Keyword["f64_load"] = "f64.load";
    Keyword["f64_store"] = "f64.store";
    Keyword["f64_convert_i32_s"] = "f64.convert_i32_s";
    Keyword["f64_convert_i32_u"] = "f64.convert_i32_u";
    Keyword["f64_convert_i64_s"] = "f64.convert_i64_s";
    Keyword["f64_convert_i64_u"] = "f64.convert_i64_u";
    Keyword["f64_promote_f32"] = "f64.promote_f32";
    Keyword["f64_reinterpret_i64"] = "f64.reinterpret_i64";
    Keyword["f64_eq"] = "f64.eq";
    Keyword["f64_ge"] = "f64.ge";
    Keyword["f64_gt"] = "f64.gt";
    Keyword["f64_le"] = "f64.le";
    Keyword["f64_lt"] = "f64.lt";
    Keyword["f64_ne"] = "f64.ne";
    Keyword["f64_abs"] = "f64.abs";
    Keyword["f64_add"] = "f64.add";
    Keyword["f64_ceil"] = "f64.ceil";
    Keyword["f64_copysign"] = "f64.copysign";
    Keyword["f64_div"] = "f64.div";
    Keyword["f64_floor"] = "f64.floor";
    Keyword["f64_max"] = "f64.max";
    Keyword["f64_min"] = "f64.min";
    Keyword["f64_mul"] = "f64.mul";
    Keyword["f64_nearest"] = "f64.nearest";
    Keyword["f64_neg"] = "f64.neg";
    Keyword["f64_sqrt"] = "f64.sqrt";
    Keyword["f64_sub"] = "f64.sub";
    Keyword["f64_trunc"] = "f64.trunc";
    Keyword["i32_const"] = "i32.const";
    Keyword["i32_load"] = "i32.load";
    Keyword["i32_load8_s"] = "i32.load8_s";
    Keyword["i32_load8_u"] = "i32.load8_u";
    Keyword["i32_load16_s"] = "i32.load16_s";
    Keyword["i32_load16_u"] = "i32.load16_u";
    Keyword["i32_store"] = "i32.store";
    Keyword["i32_store8"] = "i32.store8";
    Keyword["i32_store16"] = "i32.store16";
    Keyword["i32_and"] = "i32.and";
    Keyword["i32_clz"] = "i32.clz";
    Keyword["i32_ctz"] = "i32.ctz";
    Keyword["i32_or"] = "i32.or";
    Keyword["i32_popcnt"] = "i32.popcnt";
    Keyword["i32_rotl"] = "i32.rotl";
    Keyword["i32_rotr"] = "i32.rotr";
    Keyword["i32_shl"] = "i32.shl";
    Keyword["i32_shr_s"] = "i32.shr_s";
    Keyword["i32_shr_u"] = "i32.shr_u";
    Keyword["i32_xor"] = "i32.xor";
    Keyword["i32_reinterpret_f32"] = "i32.reinterpret_f32";
    Keyword["i32_trunc_f32_s"] = "i32.trunc_f32_s";
    Keyword["i32_trunc_f32_u"] = "i32.trunc_f32_u";
    Keyword["i32_trunc_f64_s"] = "i32.trunc_f64_s";
    Keyword["i32_trunc_f64_u"] = "i32.trunc_f64_u";
    Keyword["i32_trunc_sat_f32_s"] = "i32.trunc_sat_f32_s";
    Keyword["i32_trunc_sat_f32_u"] = "i32.trunc_sat_f32_u";
    Keyword["i32_trunc_sat_f64_s"] = "i32.trunc_sat_f64_s";
    Keyword["i32_trunc_sat_f64_u"] = "i32.trunc_sat_f64_u";
    Keyword["i32_wrap_i64"] = "i32.wrap_i64";
    Keyword["i32_eq"] = "i32.eq";
    Keyword["i32_eqz"] = "i32.eqz";
    Keyword["i32_ge_s"] = "i32.ge_s";
    Keyword["i32_ge_u"] = "i32.ge_u";
    Keyword["i32_gt_s"] = "i32.gt_s";
    Keyword["i32_gt_u"] = "i32.gt_u";
    Keyword["i32_le_s"] = "i32.le_s";
    Keyword["i32_le_u"] = "i32.le_u";
    Keyword["i32_lt_s"] = "i32.lt_s";
    Keyword["i32_lt_u"] = "i32.lt_u";
    Keyword["i32_ne"] = "i32.ne";
    Keyword["i32_add"] = "i32.add";
    Keyword["i32_div_s"] = "i32.div_s";
    Keyword["i32_div_u"] = "i32.div_u";
    Keyword["i32_mul"] = "i32.mul";
    Keyword["i32_rem_s"] = "i32.rem_s";
    Keyword["i32_rem_u"] = "i32.rem_u";
    Keyword["i32_sub"] = "i32.sub";
    Keyword["i64_const"] = "i64.const";
    Keyword["i64_load"] = "i64.load";
    Keyword["i64_load8_s"] = "i64.load8_s";
    Keyword["i64_load8_u"] = "i64.load8_u";
    Keyword["i64_load16_s"] = "i64.load16_s";
    Keyword["i64_load16_u"] = "i64.load16_u";
    Keyword["i64_load32_s"] = "i64.load32_s";
    Keyword["i64_load32_u"] = "i64.load32_u";
    Keyword["i64_store"] = "i64.store";
    Keyword["i64_store8"] = "i64.store8";
    Keyword["i64_store16"] = "i64.store16";
    Keyword["i64_store32"] = "i64.store32";
    Keyword["i64_and"] = "i64.and";
    Keyword["i64_clz"] = "i64.clz";
    Keyword["i64_ctz"] = "i64.ctz";
    Keyword["i64_or"] = "i64.or";
    Keyword["i64_popcnt"] = "i64.popcnt";
    Keyword["i64_rotl"] = "i64.rotl";
    Keyword["i64_rotr"] = "i64.rotr";
    Keyword["i64_shl"] = "i64.shl";
    Keyword["i64_shr_s"] = "i64.shr_s";
    Keyword["i64_shr_u"] = "i64.shr_u";
    Keyword["i64_xor"] = "i64.xor";
    Keyword["i64_extend_i32_s"] = "i64.extend_i32_s";
    Keyword["i64_extend_i32_u"] = "i64.extend_i32_u";
    Keyword["i64_reinterpret_f64"] = "i64.reinterpret_f64";
    Keyword["i64_trunc_f32_s"] = "i64.trunc_f32_s";
    Keyword["i64_trunc_f32_u"] = "i64.trunc_f32_u";
    Keyword["i64_trunc_f64_s"] = "i64.trunc_f64_s";
    Keyword["i64_trunc_f64_u"] = "i64.trunc_f64_u";
    Keyword["i64_trunc_sat_f32_s"] = "i64.trunc_sat_f32_s";
    Keyword["i64_trunc_sat_f32_u"] = "i64.trunc_sat_f32_u";
    Keyword["i64_trunc_sat_f64_s"] = "i64.trunc_sat_f64_s";
    Keyword["i64_trunc_sat_f64_u"] = "i64.trunc_sat_f64_u";
    Keyword["i64_eq"] = "i64.eq";
    Keyword["i64_eqz"] = "i64.eqz";
    Keyword["i64_ge_s"] = "i64.ge_s";
    Keyword["i64_ge_u"] = "i64.ge_u";
    Keyword["i64_gt_s"] = "i64.gt_s";
    Keyword["i64_gt_u"] = "i64.gt_u";
    Keyword["i64_le_s"] = "i64.le_s";
    Keyword["i64_le_u"] = "i64.le_u";
    Keyword["i64_lt_s"] = "i64.lt_s";
    Keyword["i64_lt_u"] = "i64.lt_u";
    Keyword["i64_ne"] = "i64.ne";
    Keyword["i64_add"] = "i64.add";
    Keyword["i64_div_s"] = "i64.div_s";
    Keyword["i64_div_u"] = "i64.div_u";
    Keyword["i64_mul"] = "i64.mul";
    Keyword["i64_rem_s"] = "i64.rem_s";
    Keyword["i64_rem_u"] = "i64.rem_u";
    Keyword["i64_sub"] = "i64.sub";
    Keyword["$i32"] = "$i32";
    Keyword["$i64"] = "$i64";
    Keyword["$f32"] = "$f32";
    Keyword["$f64"] = "$f64";
    Keyword["$funcref"] = "$funcref";
    Keyword["$externref"] = "$externref";
    Keyword["$v128"] = "$v128";
    Keyword["$v128_i8x16"] = "$v128_i8x16";
    Keyword["$v128_i16x8"] = "$v128_i16x8";
    Keyword["$v128_i32x4"] = "$v128_i32x4";
    Keyword["$v128_i64x2"] = "$v128_i64x2";
    Keyword["$v128_f32x4"] = "$v128_f32x4";
    Keyword["$v128_f64x2"] = "$v128_f64x2";
})(Keyword = exports.Keyword || (exports.Keyword = {}));
var PunctuationNodeSubtype;
(function (PunctuationNodeSubtype) {
    PunctuationNodeSubtype["semicolon"] = "semicolon";
    PunctuationNodeSubtype["comma"] = "comma";
    PunctuationNodeSubtype["declare_type"] = "declare_type";
    PunctuationNodeSubtype["declare_label"] = "declare_label";
    PunctuationNodeSubtype["open_angle_bracket"] = "open_angle_bracket";
    PunctuationNodeSubtype["close_angle_bracket"] = "close_angle_bracket";
    PunctuationNodeSubtype["open_brace"] = "open_brace";
    PunctuationNodeSubtype["close_brace"] = "close_brace";
    PunctuationNodeSubtype["open_paren"] = "open_paren";
    PunctuationNodeSubtype["close_paren"] = "close_paren";
    PunctuationNodeSubtype["open_square_bracket"] = "open_square_bracket";
    PunctuationNodeSubtype["close_square_bracket"] = "close_square_bracket";
})(PunctuationNodeSubtype = exports.PunctuationNodeSubtype || (exports.PunctuationNodeSubtype = {}));
var IdentifierNodeSubtype;
(function (IdentifierNodeSubtype) {
    // TODO: IdentifierNodeSubtype
})(IdentifierNodeSubtype = exports.IdentifierNodeSubtype || (exports.IdentifierNodeSubtype = {}));
var StatementNodeSubtype;
(function (StatementNodeSubtype) {
    StatementNodeSubtype["expression"] = "expression";
    StatementNodeSubtype["break"] = "break";
    StatementNodeSubtype["continue"] = "continue";
    StatementNodeSubtype["condition"] = "condition";
    StatementNodeSubtype["do"] = "do";
    StatementNodeSubtype["else"] = "else";
    StatementNodeSubtype["label"] = "label";
    StatementNodeSubtype["loop"] = "loop";
    StatementNodeSubtype["return"] = "return";
    StatementNodeSubtype["throw"] = "throw";
    StatementNodeSubtype["unreachable"] = "unreachable";
    StatementNodeSubtype["unsafe"] = "unsafe";
    StatementNodeSubtype["while"] = "while";
    StatementNodeSubtype["until"] = "until";
    StatementNodeSubtype["yield"] = "yield";
})(StatementNodeSubtype = exports.StatementNodeSubtype || (exports.StatementNodeSubtype = {}));
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
//# sourceMappingURL=ast.js.map