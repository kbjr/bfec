"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const frontend_compiler_1 = require("@~/frontend-compiler");
const frontend_compiler_2 = require("./frontend-compiler");
const legend_1 = require("./legend");
let compiler_ready;
function activate(context) {
    console.log('activating watlc extension');
    init_watlc();
    // TODO: Eventually we will setup an actual language server here
    context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider({ language: 'watl' }, new DocumentSemanticTokensProvider(), legend_1.legend));
}
exports.activate = activate;
async function init_watlc() {
    if (!compiler_ready) {
        console.log('initializing watlc frontend compiler');
        compiler_ready = (0, frontend_compiler_2.init_frontend_compiler)();
        await compiler_ready;
        console.log('watlc frontend compiler ready');
    }
    else {
        await compiler_ready;
    }
}
class DocumentSemanticTokensProvider {
    async provideDocumentSemanticTokens(document, token) {
        console.log('DocumentSemanticTokensProvider.provideDocumentSemanticTokens()');
        const raw_ast = await this.parse_source(document.fileName, document.getText());
        const file_node = this.copy_ast(raw_ast);
        const builder = new vscode.SemanticTokensBuilder();
        this.unpin_ast(raw_ast);
        // console.log(file_node);
        // builder.push()
        // allTokens.forEach((token) => {
        // 	builder.push(token.line, token.startCharacter, token.length, this._encodeTokenType(token.tokenType), this._encodeTokenModifiers(token.tokenModifiers));
        // });
        return builder.build();
    }
    /**
     * Parse the given source file and return the WASM FileNode object
     */
    async parse_source(file_path, source_text) {
        await compiler_ready;
        const file = new frontend_compiler_2.WatlFile(file_path, source_text);
        file.to_ast();
        return file.file_ast;
    }
    /**
     * Copy the parsed AST over to JS from WASM using JSON as an intermediate
     */
    copy_ast(ast) {
        return JSON.parse((0, frontend_compiler_1.to_json)(ast));
    }
    /**
     * Unpin the ASTNode object in WASM so it can be collected
     */
    unpin_ast(ast) {
        frontend_compiler_1.wasm.__unpin(ast.valueOf());
    }
}
//# sourceMappingURL=extension.js.map