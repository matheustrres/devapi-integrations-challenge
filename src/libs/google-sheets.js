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
				'Argument {googleAuthorization} is required and must be an instance of GoogleAuthorization.',
			);
		}
	}

	constructor(googleAuthorization) {
		GoogleSheets.#validate(googleAuthorization);

		this.#googleAuthorization = googleAuthorization;
	}

	async #getSpreedsheetsService() {
		const authClient = await this.#googleAuthorization.getClient();

		return google.sheets({
			version: 'v4',
			auth: authClient,
		}).spreadsheets;
	}

	async getSpreedsheet({ spreadsheetId, range }) {
		if (!spreadsheetId || !range) {
			throw new Error(
				'Both arguments {spreadsheetId} and {range} are required and must be a string.',
			);
		}

		const spreedsheetsService = await this.#getSpreedsheetsService();

		const spreedsheet = await spreedsheetsService.values.get({
			spreadsheetId,
			range,
		});

		return {
			spreedsheet: spreedsheet.data.values,
		};
	}

	static mapSpreedsheetContactsToHubSpot(spreedsheet) {
		if (!spreedsheet || !Array.isArray(spreedsheet)) {
			throw new Error(
				'Argument {spreedsheet} is required and must an array of items.',
			);
		}

		const withoutHeaders = spreedsheet.slice(1);

		return withoutHeaders.map((row) => ({
			properties: {
				company: row[0],
				firstname: row[1].split(' ')[0],
				lastname: row[1].split(' ')[1],
				email: row[2],
				phone: row[3],
				website: row[4],
			},
		}));
	}
}
