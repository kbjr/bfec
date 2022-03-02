
import { promises as fs } from 'fs';
import { resolve as resolve_path, dirname } from 'path';
import * as mkdirp from 'mkdirp';

export class InputLoader {
	constructor(
		public directory: string,
		public entrypoint_file: string
	) {
		this.directory = resolve_path(process.cwd(), this.directory);
	}

	public read_file(file_path: string) {
		return fs.readFile(file_path, 'utf8');
	}

	public read_entrypoint() {
		const path = resolve_path(this.directory, this.entrypoint_file);
		return this.read_file(path);
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
