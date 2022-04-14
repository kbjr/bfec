
import { jsonc } from 'jsonc';
import { ConfLoader, MarkdownConf, TypeScriptConf } from './fs';
import { print_help, print_version } from './help';
import { log_level, main as log, set_log_level } from './log';
import { exit_error, exit_successful } from './exit';
import { homedir } from 'os';
import { resolve } from 'path';

export interface Args {
	conf?: string;
	in: Input;
	out: Output[];
	quiet?: boolean;
	skip_cache?: boolean;
	bfec_dir: string;
	cache_dir: string;
	allowed_remotes?: string[];
}

export interface Input {
	directory: string;
	entrypoint_file: string;
}

export interface Output {
	format: output_format;
	directory: string;
	conf?: MarkdownConf | TypeScriptConf;
}

export enum output_format {
	as       = 'as',
	ast_json = 'ast_json',
	html     = 'html',
	md       = 'md',
	sch_json = 'sch_json',
	ts       = 'ts',
}

export async function parse_args(args: string[]) : Promise<Args> {
	const result: Partial<Args> = { };

	for (let index = 0; index < args.length;) {
		const arg = args[index++];

		switch (arg) {
			case '-h':
			case '-help':
			case '--help':
				print_help();
				await exit_successful();
				break;

			case '-version':
				print_version();
				await exit_successful();
				break;

			case '-quiet':
				result.quiet = true;
				break;

			case '-conf':
				const conf_file = args[index++];

				if (result.conf) {
					await exit_error(1, 'Cannot provide more than one "-conf" option');
				}

				const loader = new ConfLoader();
				const conf = await loader.read_file(conf_file);

				if (conf.in) {
					if (result.in) {
						await exit_error(1, 'Cannot provide more than one "-in" option (including any input defined in a config file)');
					}

					result.in = {
						directory: conf.in.dir,
						entrypoint_file: conf.in.file
					};
				}

				if (conf.out) {
					for (const [out_format, out_conf] of Object.entries(conf.out)) {
						result.out = result.out || [ ];

						if (typeof out_conf === 'string') {
							result.out.push({
								format: out_format as output_format,
								directory: out_conf
							});
						}

						else {
							result.out.push({
								format: out_format as output_format,
								directory: out_conf.dir,
								conf: out_conf
							});
						}
					}
				}

				if (conf.allowed_remotes) {
					result.allowed_remotes = conf.allowed_remotes;
				}

				break;

			case '-log':
			case `-log:main`:
			case `-log:parser`:
			case `-log:linker`:
			case `-log:c_as`:
			case `-log:c_html`:
			case `-log:c_ts`:
				const level = parseInt(args[index++], 10);
				const logger = arg === '-log' ? '*' : arg.split(':')[1];
				set_log_level(logger as any, level);
				break;

			case '-in':
				const in_dir = args[index++];
				const in_file = args[index++];

				if (result.in) {
					await exit_error(1, 'Cannot provide more than one "-in" option (including any input defined in a config file)');
				}

				result.in = {
					directory: in_dir,
					entrypoint_file: in_file
				};
				break;

			case '-out':
				const out_format = args[index++] as output_format;
				const out_dir = args[index++];

				if (output_format[out_format] == null) {
					await exit_error(1, `Unknown output format "${out_format}"`);
				}

				result.out = result.out || [ ];
				result.out.push({
					format: out_format,
					directory: out_dir
				});
				break;

			default:
				await exit_error(1, `unknown or unexpected option "${arg}"`);
				break;
		}
	}

	if (result.quiet) {
		set_log_level('*', log_level.none);
	}

	if (! result.bfec_dir) {
		result.cache_dir = resolve(homedir(), '.bfec');
	}

	if (! result.cache_dir) {
		result.cache_dir = resolve(result.bfec_dir, 'remote-cache');
	}

	log.debug('args', result);
	validate_args(result);
	return result;
}

function validate_args(args: Partial<Args>) : asserts args is Args {
	// TODO: Validate
}
