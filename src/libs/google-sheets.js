import { google } from 'googleapis';

import { GoogleAuthorization } from './google-auth.js';

export class GoogleSheets {
	#googleAuthorization;

	static #validate(googleAuthorization) {
		if (
			!googleAuthorization ||
			!(googleAuthorization instanceof GoogleAuthorization)
		) {
			throw new TypeError(
				'Argument {{googleAuthorization}} is required and must be an instance of GoogleAuthorization.',
			);
		}
	}

	constructor(googleAuthorization) {
		GoogleSheets.#validate(googleAuthorization);

		this.#googleAuthorization = googleAuthorization;
	}

	async getService() {
		const authClient = await this.#googleAuthorization.getClient();

		return google.sheets({
			version: 'v4',
			auth: authClient,
		}).spreadsheets;
	}
}
