
import * as vscode from 'vscode';
import { to_json, FileNode as WasmFileNode, wasm } from '@~/frontend-compiler';
import { init_frontend_compiler, WatlFile } from './frontend-compiler';
import { FileNode } from './ast';
import { legend } from './legend';

let compiler_ready: Promise<void>;

export function activate(context: vscode.ExtensionContext) {
	console.log('activating watlc extension');
	
	init_watlc();

	// TODO: Eventually we will setup an actual language server here

	context.subscriptions.push(
		vscode.languages.registerDocumentSemanticTokensProvider({ language: 'watl'}, new DocumentSemanticTokensProvider(), legend)
	);
}

async function init_watlc() {
	if (! compiler_ready) {
		console.log('initializing watlc frontend compiler');
		
		compiler_ready = init_frontend_compiler();
		await compiler_ready;
		
		console.log('watlc frontend compiler ready');
	}

	else {
		await compiler_ready;
	}
}

class DocumentSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
	async provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SemanticTokens> {
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
	private async parse_source(file_path: string, source_text: string) : Promise<WasmFileNode> {
		await compiler_ready;
		const file = new WatlFile(file_path, source_text);
		file.to_ast();
		return file.file_ast;
	}

	/**
	 * Copy the parsed AST over to JS from WASM using JSON as an intermediate
	 */
	private copy_ast(ast: WasmFileNode) : FileNode {
		return JSON.parse(to_json(ast)) as FileNode;
	}
	
	/**
	 * Unpin the ASTNode object in WASM so it can be collected
	 */
	private unpin_ast(ast: WasmFileNode) : void {
		wasm.__unpin(ast.valueOf());
	}
}
