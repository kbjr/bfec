
import * as vscode from 'vscode';
import { legend } from './legend';

let compiler_ready: Promise<void>;

export function activate(context: vscode.ExtensionContext) {
	console.log('activating bfec extension');
	
	// TODO: Eventually we will setup an actual language server here

	context.subscriptions.push(
		vscode.languages.registerDocumentSemanticTokensProvider({ language: 'bfec'}, new DocumentSemanticTokensProvider(), legend)
	);
}

class DocumentSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
	async provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SemanticTokens> {
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

	private async parse_source(file_path: string, source_text: string) : Promise<void> {
		// 
	}
}
