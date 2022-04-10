
import { request as request_http } from 'http';
import { request as request_https } from 'https';
import { main as log } from './log';

const timeout_ms = 10_000;
const cached_promises = new Map<string, Promise<string>>();

export function get_http(url: string) : Promise<string> {
	if (cached_promises.has(url)) {
		return cached_promises.get(url);
	}

	const request = url.startsWith('https://') ? request_https : request_http;

	return new Promise((resolve, reject) => {
		const req = request(url, (res) => {
			if (res.statusCode !== 200) {
				req.destroy(
					new Error(`Received unexpected ${res.statusCode} ${res.statusMessage} response`)
				);
				return;
			}

			let body = '';

			res.on('data', (chunk) => {
				body += chunk;
			});

			res.on('end', () => {
				resolve(body);
			});
		});

		req.setTimeout(timeout_ms, () => {
			req.destroy(
				new Error('Request timeout')
			);
		});

		req.on('error', (err) => {
			reject(err);
		});

		req.end();
	});
}
