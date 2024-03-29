
import { promises as fs } from 'fs';
import { resolve as resolve_path, dirname } from 'path';
import { output_format } from './args';
import * as mkdirp from 'mkdirp';
import { jsonc } from 'jsonc';
import { exit_error } from './exit';
import { WriteableDir } from '../lib';
import { main as log } from './log';

export interface Conf {
	$schema?: string;
	in?: {
		dir: string;
		file: string;
	};
	out?: {
		[output_format.as]: string;
		[output_format.ast_json]: string;
		[output_format.html]: string;
		[output_format.md]: string | MarkdownConf;
		[output_format.sch_json]: string;
		[output_format.ts]: string | TypeScriptConf;
	};
	allowed_remotes?: string[];
}

export interface MarkdownConf {
	dir: string;
	source_url?: string;
	include_external?: boolean;
	include_remote?: boolean;
	no_generator_comment?: boolean;
}

export interface TypeScriptConf {
	dir: string;
	no_generator_comment?: boolean;
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
			for (const [out_format, out_conf] of Object.entries(conf.out)) {
				switch (out_format) {
					case output_format.md:
						if (typeof out_conf === 'string') {
							// $.out.md should be interpretted as relative to the config file's own location
							conf.out.md = resolve_path(dir, out_conf);
							break;
						}

						// $.out.md.dir should be interpretted as relative to the config file's own location
						out_conf.dir = resolve_path(dir, out_conf.dir);
						break;

					case output_format.ts:
						if (typeof out_conf === 'string') {
							// $.out.ts should be interpretted as relative to the config file's own location
							conf.out.ts = resolve_path(dir, out_conf);
							break;
						}

						// $.outts.dir should be interpretted as relative to the config file's own location
						out_conf.dir = resolve_path(dir, out_conf.dir);
						break;

					case output_format.as:
					case output_format.ast_json:
					case output_format.html:
					case output_format.sch_json:
						if (typeof out_conf !== 'string') {
							await exit_error(1, `Invalid config file: '$.out.${out_format}' must be a string`);
							break;
						}

						// $.out[*] should be interpretted as relative to the config file's own location
						conf.out[out_format] = resolve_path(dir, out_conf);
						break;

					default:
						await exit_error(1, `Unknown output format in conf file "${out_format}"`);
				}
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

export class OutputWriter implements WriteableDir {
	constructor(public directory: string) {
		this.directory = resolve_path(process.cwd(), this.directory);
	}

	public async create() {
		await mkdirp(this.directory);
	}

	public async write_file(file_path: string, contents: string) {
		log.debug('OutputWriter.write_file', this.directory, file_path);

		const full_path = resolve_path(this.directory, file_path);
		await mkdirp(dirname(full_path));
		await fs.writeFile(full_path, contents, 'utf8');
	}
}

export class CacheDir {
	constructor(
		public directory: string
	) { }

	public async init() {
		await mkdirp(this.directory);
	}

	public async stat(path: string) {
		try {
			return await fs.stat(resolve_path(this.directory, path));
		}

		catch (error) {
			log.debug('fs.stat error', error);
			return null;
		}
	}

	public async mkdirp(path: string) {
		await mkdirp(resolve_path(this.directory, path));
	}

	public read_file(path: string) {
		return fs.readFile(resolve_path(this.directory, path), 'utf8');
	}

	public async write_file(path: string, contents: string) {
		log.debug('CacheDir.write_file', this.directory, path);

		const full_path = resolve_path(this.directory, path);
		const dir_path = dirname(full_path);

		await this.mkdirp(dir_path);
		await fs.writeFile(full_path, contents, 'utf8');
	}
}
