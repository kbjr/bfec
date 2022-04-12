
import { URL } from 'url';
import { CacheDir } from './fs';

export class Cache {
	public readonly dir: CacheDir;

	constructor(dir: string, public readonly skip: boolean) {
		this.dir = new CacheDir(dir);
	}

	public async get_if_exists(url: string) {
		if (this.skip) {
			return null;
		}

		const path = this.path_from_url(url);
		const stats = await this.dir.stat(path);

		if (stats && stats.isFile()) {
			return this.dir.read_file(path);
		}

		return null;
	}

	public write_to_cache(url: string, contents: string) {
		if (this.skip) {
			return;
		}

		const path = this.path_from_url(url);
		return this.dir.write_file(path, contents);
	}

	private path_from_url(url: string) {
		const parsed = new URL(url);
		return `${parsed.protocol}/${parsed.host}${parsed.pathname}`;
	}
}
