
export * from '../lib/log';

import * as log from '../lib/log';

export const main = new log.Logger(log.logger.main, log.log_level.info);

const loggers = {
	main,
	parser: log.parser,
	linker: log.linker,
	c_as: log.c_as,
	c_html: log.c_html,
	c_ts: log.c_ts
};

export function set_log_level(logger: log.logger | '*', level: log.log_level) : void {
	if (logger === '*') {
		for (let log of Object.values(loggers)) {
			log.level = level;
		}
	}

	else {
		loggers[logger].level = level;
	}
}
