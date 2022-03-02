
import { inspect } from 'util';

export enum log_level {
	none,
	error,
	warn,
	info,
	verbose,
	debug,
	silly,
}

export enum logger {
	main   = 'main',
	parser = 'parser',
	linker = 'linker',
	c_as   = 'c_as',
	c_md   = 'c_md',
	c_html = 'c_html',
	c_ts   = 'c_ts',
}

export class Logger {
	constructor(
		public readonly name: logger,
		public level: log_level
	) { }

	public log(level: log_level, content: any[]) : void {
		if (level > this.level) {
			return;
		}

		if (level < log_level.info) {
			console.error(...content);
		}

		else {
			console.log(...content);
		}
	}

	public error(...content: any[]) {
		this.log(log_level.error, content);
	}

	public warn(...content: any[]) {
		this.log(log_level.warn, content);
	}

	public info(...content: any[]) {
		this.log(log_level.info, content);
	}

	public verbose(...content: any[]) {
		this.log(log_level.verbose, content);
	}

	public debug(...content: any[]) {
		this.log(log_level.debug, content);
	}

	public silly(...content: any[]) {
		this.log(log_level.silly, content);
	}
}

export function format(value: any) : string {
	return inspect(value, false, 6, true);
}

export const parser = new Logger(logger.parser, log_level.info);
export const linker = new Logger(logger.linker, log_level.info);
export const c_as   = new Logger(logger.c_as, log_level.info);
export const c_html = new Logger(logger.c_html, log_level.info);
export const c_md   = new Logger(logger.c_md, log_level.info);
export const c_ts   = new Logger(logger.c_ts, log_level.info);
