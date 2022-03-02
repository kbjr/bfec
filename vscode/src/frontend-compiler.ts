
import {
	load_wasm,
	init_wasm,
	parse_source_file,
	FileNode,
	SourceFile,
	CompilerError,
	IntermediateFile
} from '@~/frontend-compiler';
import { mem_frontend_compiler_max_pages, mem_frontend_compiler_min_pages, use_optimized_frontend_compiler } from './consts';

export { to_json, to_buffer } from '@~/frontend-compiler';

let ready: boolean | Promise<void> = false;

export async function init_frontend_compiler() {
	if (! ready) {
		ready = (async () => {
			await load_wasm(use_optimized_frontend_compiler);
			await init_wasm(mem_frontend_compiler_min_pages, mem_frontend_compiler_max_pages);
			ready = true;
		})();
	}
	
	await ready;
}

export class WatlFile {
	constructor(
		public readonly file_path: string,
		public readonly source_text: string
	) { }

	public source_file: SourceFile = null;
	public file_ast: FileNode = null;
	public ir_file: IntermediateFile = null;
	public errors: CompilerError[] = null;

	public to_ast() {
		const file = new SourceFile(this.file_path);
		file.file_str = this.source_text;
		this.file_ast = parse_source_file(this.file_path, this.source_file);
	}
}
