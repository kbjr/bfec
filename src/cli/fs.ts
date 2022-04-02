
import { promises as fs } from 'fs';
import { resolve as resolve_path, dirname } from 'path';
import { output_format } from './args';
import * as mkdirp from 'mkdirp';
import { jsonc } from 'jsonc';
import { exit_error } from './exit';

export interface Conf {
	$schema?: string;
	in?: {
		dir: string;
		file: string;
	};
	out?: Record<output_format, string>;
	allowed_remotes?: string[];
}

export class ConfLoader {
	public async read_file(file_path: string) {
		const file = resolve_path(process.cwd(), file_path);
		const dir = dirname(file);
		const raw = await fs.readFile(file, 'utf8');
		let conf: Conf;

		try {
			conf = jsonc.parse(raw);
		}

		catch (error) {
			await exit_error(1, `Failed to parse config file as JSONC: ${error}`);
		}

		if (conf.in) {
			if (typeof conf.in.dir !== 'string' || typeof conf.in.file !== 'string') {
				await exit_error(1, `Invalid config file: '$.in.dir' and '$.in.file' are both required and must be strings`);
			}

			// $.in.dir should be interpretted as relative to the config file's own location
			conf.in.dir = resolve_path(dir, conf.in.dir);
		}

		if (conf.out) {
			for (const [out_format, out_dir] of Object.entries(conf.out)) {
				if (output_format[out_format] == null) {
					await exit_error(1, `Unknown output format "${out_format}"`);
				}

				if (typeof out_dir !== 'string') {
					await exit_error(1, `Invalid config file: '$.out.${out_format}' must be a string`);
				}

				// $.out[*] should be interpretted as relative to the config file's own location
				conf.out[out_format] = resolve_path(dir, out_dir);
			}
		}

		return conf;
	}
}

export class InputLoader {
	constructor(
		public directory: string,
		public entrypoint_file: string
	) {
		this.directory = resolve_path(process.cwd(), this.directory);
	}

	public read_file(file_path: string) {
		const path = resolve_path(this.directory, file_path);
		return fs.readFile(path, 'utf8');
	}

	public read_entrypoint() {
		return this.read_file(this.entrypoint_file);
	}
}

export class OutputWriter {
	constructor(public directory: string) {
		this.directory = resolve_path(process.cwd(), this.directory);
	}

	public async create() {
		await mkdirp(this.directory);
	}

	public async write_file(file_path: string, contents: string) {
		await mkdirp(dirname(file_path));
		await fs.writeFile(resolve_path(this.directory, file_path), contents, 'utf8');
	}
}
