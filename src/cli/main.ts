
import { output_format, parse_args } from './args';
import { exit_error, exit_successful } from './exit';
import { InputLoader, OutputWriter } from './fs';
import { link_ast_to_schema, parse_src_to_ast } from '../lib';
import { build_schema_from_ast } from '../lib/schema';
import { main as log } from './log';

main();

async function main() {
	// Parse arguments and figure out where we're loading files from
	const args = await parse_args(process.argv.slice(2));
	const input = new InputLoader(args.in.directory, args.in.entrypoint_file);
	
	// Load and parse the main entrypoint file
	const entrypoint_file_contents = await input.read_entrypoint();
	const entrypoint_ast = parse_src_to_ast(args.in.entrypoint_file, entrypoint_file_contents);

	// Figure out what all we need to do based on what outputs we're generating
	const ast_out = args.out.find((out) => out.format === output_format.ast_json);
	const needs_compiled_schema = args.out.some((out) => out.format !== output_format.ast_json);

	// If we need to output an AST, do that
	if (ast_out) {
		const out_dir = new OutputWriter(ast_out.directory);
		await out_dir.create();
		await out_dir.write_file(input.entrypoint_file + '.json', JSON.stringify(entrypoint_ast));
		// TODO: Should this actually do linking to get other files? Or can this just
		// be targetted to the one file?
	}

	// If the AST was all we needed and we don't actually need to compile a schema, then we're done
	if (! needs_compiled_schema) {
		await exit_successful();
	}

	// Otherwise, compile actually build the schema now
	const schema = build_schema_from_ast(entrypoint_ast);
	const schema_out = args.out.find((out) => out.format === output_format.sch_json);

	// If we need to output a schema file, do that
	if (schema_out) {
		const out_dir = new OutputWriter(schema_out.directory);
		await out_dir.create();
		await out_dir.write_file('schema.json', JSON.stringify(schema));
	}

	// If we encountered errors while building, stop here
	if (schema.errors.length) {
		schema.errors.forEach((error) => {
			log.error(error.message);
		});

		return;
	}

	// const schema = await link_ast_to_schema(entrypoint_ast, {
	// 	async resolve_import(path: string) {
	// 		if (path.startsWith('http://') || path.startsWith('https://')) {
	// 			// TODO: Remote imports over http(s)
	// 			await exit_error(2, 'http(s) imports not yet supported');
	// 		}

	// 		// TODO: Validate / pre-process file path

	// 		const imported_contents = await input.read_file(path);
	// 		const imported_ast = parse_src_to_ast(path, imported_contents);
	// 		return imported_ast;
	// 	}
	// });

	// for (let out of args.out) {
	// 	const out_dir = new OutputWriter(out.directory);
	// 	await out_dir.create();

	// 	switch (out.format) {
	// 		case output_format.as:
	// 			// TODO: Output AssemblyScript
	// 			break;

	// 		case output_format.html:
	// 			// TODO: Output HTML Documentation
	// 			break;

	// 		case output_format.ts:
	// 			// TODO: Output TypeScript
	// 			break;
	// 	}
	// }

	await exit_successful();
}
