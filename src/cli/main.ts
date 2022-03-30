
import { output_format, parse_args } from './args';
import { exit_error, exit_successful } from './exit';
import { InputLoader, OutputWriter } from './fs';
import { link_schema, parse_src_to_ast } from '../lib';
import { build_schema_from_ast } from '../lib/schema';
import { main as log } from './log';
import { jsonc } from 'jsonc';

main();

async function main() {
	// Parse arguments and figure out where we're loading files from
	const args = await parse_args(process.argv.slice(2));
	const input = new InputLoader(args.in.directory, args.in.entrypoint_file);
	
	// Load and parse the main entrypoint file
	const entrypoint_file_contents = await input.read_entrypoint();
	const entrypoint_ast = parse_src_to_ast('~/' + args.in.entrypoint_file, entrypoint_file_contents);

	// Figure out what all we need to do based on what outputs we're generating
	const ast_out = args.out.find((out) => out.format === output_format.ast_json);
	const schema_out = args.out.find((out) => out.format === output_format.sch_json);
	const needs_compiled_output = args.out.some((out) => out.format !== output_format.ast_json && out.format !== output_format.sch_json);

	// If we need to output an AST, do that
	if (ast_out) {
		const out_dir = new OutputWriter(ast_out.directory);
		await out_dir.create();
		await out_dir.write_file(input.entrypoint_file + '.json', JSON.stringify(entrypoint_ast));
	}

	// If the AST was all we needed and we don't actually need to compile a schema, then we're done
	if (! schema_out && ! needs_compiled_output) {
		await exit_successful();
	}

	// Otherwise, compile actually build the schema now
	const schema = build_schema_from_ast(entrypoint_ast, true);
	let schema_out_dir: OutputWriter;

	// If we need to output a schema file, do that
	if (schema_out) {
		schema_out_dir = new OutputWriter(schema_out.directory);
		await schema_out_dir.create();
		await schema_out_dir.write_file('schema.json', jsonc.stringify(schema, { handleCircular: true }));
	}

	// Link the schema, pulling in any other imported schemas and connecting all of the symbol
	// references to their referenced declarations
	const { errors } = await link_schema(schema, {
		async resolve_import(path: string) {
			log.debug('resolve_import', path);

			if (path.startsWith('http://') || path.startsWith('https://')) {
				// TODO: Remote imports over http(s)
				await exit_error(2, 'http(s) imports not yet supported');
			}

			if (path.startsWith('~/')) {
				let imported_contents = await input.read_file(path.slice(2));
				let imported_ast = parse_src_to_ast(path, imported_contents);
				return build_schema_from_ast(imported_ast);
			}

			throw new Error('Only project relative "~/" prefixed paths are allowed');
		}
	});

	// If we need schema output, we should also output the linked version of the schema
	if (schema_out) {
		await schema_out_dir.write_file('linked.json', jsonc.stringify(schema, { handleCircular: true }));
	}

	// If we encountered errors while building, stop here
	if (errors.length) {
		errors.forEach((error) => {
			log.error('\n' + error.message, `(${error.source.source}:${error.line}:${error.char})`);
		});

		log.error(`\nErrors: ${errors.length}\n`);
		await exit_error(1, 'Failed to build and link schema');
	}

	// If more outputs are required
	for (let out of args.out) {
		const out_dir = new OutputWriter(out.directory);
		await out_dir.create();

		switch (out.format) {
			case output_format.as:
				// TODO: Output AssemblyScript
				break;

			case output_format.html:
				// TODO: Output HTML Documentation
				break;

			case output_format.ts:
				// TODO: Output TypeScript
				break;

			case output_format.md:
				// TODO: Markdown Documentation
				break;

			case output_format.ast_json:
			case output_format.sch_json:
				// skip, already handled
				break;
		}
	}

	await exit_successful();
}
