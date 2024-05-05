export class HttpClient {
	#baseURL;

	static #validate(baseURL) {
		if (!baseURL || typeof baseURL !== 'string') {
			throw new TypeError(
				'Argument {baseURL} is required and must be a string.',
			);
		}
	}

	constructor(baseURL) {
		HttpClient.#validate(baseURL);

		this.#baseURL = baseURL;
	}

	async post({ endpoint, headers, body }) {
		HttpClient.#validatePost({ endpoint, headers, body });

		return await fetch(new URL(`${this.#baseURL}/${endpoint}`), {
			headers,
			body: JSON.stringify(body),
			method: 'POST',
		}).then((response) => response.json());
	}

	static #validatePost({ endpoint, headers, body }) {
		if (!endpoint || typeof endpoint !== 'string') {
			throw new TypeError(
				'Argument {endpoint} is required and must be a string.',
			);
		}

		if (!headers || !Object.keys(headers).length) {
			throw new TypeError(
				'Argument {headers} is required and must be an objecy.',
			);
		}

		if (!body || !Object.keys(body).length) {
			throw new TypeError('Argument {body} is required and must be an object.');
		}
	}
}
