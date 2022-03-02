
import { red } from 'chalk';
import { main as logger } from './log';

export function exit_successful() : Promise<never> {
	return flush_and_exit(0);
}

export function exit_error(code: number, message: string) : Promise<never> {
	logger.error(red(message));
	return flush_and_exit(code);
}

async function flush_and_exit(code: number) : Promise<never> {
	const flush_stdout = new Promise((resolve) => {
		process.stdout.write('', resolve);
	});

	const flush_stderr = new Promise((resolve) => {
		process.stdout.write('', resolve);
	});

	await Promise.all([ flush_stdout, flush_stderr ]);

	process.exit(code);
}
