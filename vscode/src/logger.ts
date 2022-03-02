
export enum log_level {
	none = 0,
	error = 1,
	warn = 2,
	info = 3,
	verbose = 4,
	debug = 5,
	silly = 6,
}

let level: log_level = log_level.info;

export function set_log_level(new_level: log_level) : void {
	level = new_level;
}

export const logger = {
	error(message: string, ...others: any[]) : void {
		if (level >= log_level.error) {
			console.error(message, ...others);
		}
	},
	warn(message: string, ...others: any[]) : void {
		if (level >= log_level.warn) {
			console.warn(message, ...others);
		}
	},
	info(message: string, ...others: any[]) : void {
		if (level >= log_level.info) {
			console.info(message, ...others);
		}
	},
	verbose(message: string, ...others: any[]) : void {
		if (level >= log_level.verbose) {
			console.debug(message, ...others);
		}
	},
	debug(message: string, ...others: any[]) : void {
		if (level >= log_level.debug) {
			console.debug(message, ...others);
		}
	},
	silly(message: string, ...others: any[]) : void {
		if (level >= log_level.silly) {
			console.debug(message, ...others);
		}
	},
	time(label: string) : void {
		if (level >= log_level.verbose) {
			console.time(label);
		}
	},
	timeEnd(label: string) : void {
		if (level >= log_level.verbose) {
			console.timeEnd(label);
		}
	}
};
