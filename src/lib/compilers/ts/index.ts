
import { ast } from '../../parser';
import * as lnk from '../../linker';
import * as tmpl from './templates';
import { c_ts as log } from '../../log';
import { WriteableDir } from '../../writeable-dir';
import { CompilerState } from './state';

export interface TypescriptCompilerOptions {
	out_dir: WriteableDir;
	root_struct_name: string;
	no_generator_comment?: boolean;
}

export async function compile_to_typescript(schema: lnk.Schema, opts: TypescriptCompilerOptions) {
	log.verbose('Compiling schema to typescript', schema.source);

	const state = new CompilerState(schema, opts);

	await write_core_files(opts);

	// 

	// console.log(entrypoint_ts);

	compile_schema(schema, [ '$' ], opts);

	// 

	return state.errors;
}

function write_core_files(opts: TypescriptCompilerOptions) {
	const generator_comment = tmpl.generator_comment_template(opts.no_generator_comment);
	
	const entrypoint_ts
		= generator_comment
		+ tmpl.entrypoint_template({
			root_struct_class: opts.root_struct_name
		});

	const buffer_reader_ts
		= generator_comment
		+ tmpl.buffer_reader_template();

	const buffer_writer_ts
		= generator_comment
		+ tmpl.buffer_writer_template();

	const utils_ts
		= generator_comment
		+ tmpl.utils_template();

	return Promise.all([
		opts.out_dir.write_file('index.ts', entrypoint_ts),
		opts.out_dir.write_file('buffer-reader.ts', buffer_reader_ts),
		opts.out_dir.write_file('buffer-writer.ts', buffer_writer_ts),
		opts.out_dir.write_file('utils.ts', utils_ts),
	]);
}

function compile_schema(schema: lnk.Schema, symbols: string[], opts: TypescriptCompilerOptions) {
	const dir = out_dir_name(schema);

	// 
}

function out_dir_name(schema: lnk.Schema) {
	if (schema.source.source.startsWith('~/')) {
		return `types/${schema.source.source.slice(2)}`;
	}

	if (schema.source.source.startsWith('http://') || schema.source.source.startsWith('https://')) {
		const parsed = new URL(schema.source.source);
		return `types/$remote/${parsed.protocol}/${parsed.host}/${parsed.pathname.slice(1)}`;
	}
}
