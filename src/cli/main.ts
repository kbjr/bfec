
import { get_http } from './http';
import { main as log } from './log';
import { output_format, parse_args } from './args';
import { exit_error, exit_successful } from './exit';
import { InputLoader, MarkdownConf, OutputWriter } from './fs';
import { parse_src_to_ast, compile_to_markdown, MarkdownCompilerOptions, link_schema } from '../lib';
import { red, yellow } from 'chalk';
import { Cache } from './cache';

main();

async function main() {
	// Parse arguments and figure out where we're loading files from
	const args = await parse_args(process.argv.slice(2));
	const input = new InputLoader(args.in.directory, args.in.entrypoint_file);
	
	// Load and parse the main entrypoint file
	const entrypoint_file_contents = await input.read_entrypoint();
	const entrypoint_ast = parse_src_to_ast('~/' + args.in.entrypoint_file, entrypoint_file_contents);

	if (! entrypoint_ast) {
		await exit_error(1, 'Failed to parse bfec schema');
	}

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

	// In case we end up needing to resolve remote modules, get a cache instance ready
	const cache = new Cache(args.cache_dir, args.skip_cache);

	// Build and link the schema, pulling in any other imported schemas and connecting all of the symbol
	// references to their referenced declarations
	const { schema, errors } = await link_schema(entrypoint_ast, {
		async resolve_import(path: string) {
			log.debug('resolve_import', path);

			let imported_contents: string;

			get_contents:
			if (path.startsWith('http://') || path.startsWith('https://')) {
				if (! check_remote_is_allowed(args.allowed_remotes, path)) {
					throw new Error('Remote location not allowed');
				}

				// First, attempt to read from the on-disk cache
				imported_contents = await cache.get_if_exists(path);

				if (imported_contents) {
					break get_contents;
				}

				log.info('Remote module not found in cache, fetching...', path);

				// If we didn't find the module in cache, fetch it from the remote
				imported_contents = await get_http(path);

				// If we found something at the remote, store it to the cache for next time
				if (imported_contents) {
					await cache.write_to_cache(path, imported_contents);
				}
			}

			else if (path.startsWith('~/')) {
				imported_contents = await input.read_file(path.slice(2));
			}

			else {
				throw new Error('Only project relative "~/" prefixed paths and http(s) urls are allowed');
			}

			if (imported_contents) {
				const ast = parse_src_to_ast(path, imported_contents);

				if (! ast) {
					throw new Error('Failed to parse bfec file');
				}

				return ast;
			}

			throw new Error('Failed to read import contents');
		}
	});

	let schema_out_dir: OutputWriter;

	// If we need to output a schema file, do that
	if (schema_out) {
		schema_out_dir = new OutputWriter(schema_out.directory);
		await schema_out_dir.create();
		await schema_out_dir.write_file('schema.json', JSON.stringify(schema, null, '  '));
	}

	// If we encountered errors while building/linking, stop here
	if (errors.length) {
		errors.forEach((error) => {
			log.error(`\n${red('Link Error')}: ${error.message}`);
			log.error(`(${error.pos_text})\n`);
			log.error(`${error.reference_text}\n`);
		});

		log.error(`\nLink Errors: ${yellow(errors.length)}`);
		await exit_error(1, 'Failed to build and link schema');
	}

	// // If more outputs are required, compile each of those
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
				const opts: MarkdownCompilerOptions = { out_dir };

				if (out.conf) {
					const conf = out.conf as MarkdownConf;
					opts.source_url = conf.source_url;
					opts.include_external = conf.include_external;
					opts.include_remote = conf.include_remote;
				}

				await compile_to_markdown(schema, opts);
				break;

			case output_format.ast_json:
			case output_format.sch_json:
				// skip, already handled
				break;
		}
	}

	await exit_successful();
}

function check_remote_is_allowed(allowed: string[], remote: string) : boolean {
	if (! allowed) {
		return false;
	}

	for (const prefix of allowed) {
		if (remote.startsWith(prefix)) {
			return true;
		}
	}

	return false;
}
