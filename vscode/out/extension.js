"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const legend_1 = require("./legend");
let compiler_ready;
function activate(context) {
    console.log('activating bfec extension');
    // TODO: Eventually we will setup an actual language server here
    context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider({ language: 'bfec' }, new DocumentSemanticTokensProvider(), legend_1.legend));
}
exports.activate = activate;
class DocumentSemanticTokensProvider {
    async provideDocumentSemanticTokens(document, token) {
        console.log('DocumentSemanticTokensProvider.provideDocumentSemanticTokens()');
        // const raw_ast = await this.parse_source(document.fileName, document.getText());
        // const file_node = this.copy_ast(raw_ast);
        const builder = new vscode.SemanticTokensBuilder();
        // this.unpin_ast(raw_ast);
        // console.log(file_node);
        // builder.push()
        // allTokens.forEach((token) => {
        // 	builder.push(token.line, token.startCharacter, token.length, this._encodeTokenType(token.tokenType), this._encodeTokenModifiers(token.tokenModifiers));
        // });
        return builder.build();
    }
    async parse_source(file_path, source_text) {
        // 
    }
}
//# sourceMappingURL=extension.js.map