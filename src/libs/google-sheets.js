import { generateQueryParams } from '../utils/funcs/gen-query-params.js';
import { HttpClient } from '../utils/http-client.js';

export class GoogleSheets {
	#httpClient;
	#googleApiKey;

	static #validate(googleApiKey) {
		if (!googleApiKey || typeof googleApiKey !== 'string') {
			throw new TypeError(
				'Argument {googleApiKey} is required and must be a string.',
			);
		}
	}

	constructor({ googleApiKey }) {
		GoogleSheets.#validate(googleApiKey);

		this.#httpClient = new HttpClient('https://sheets.googleapis.com');
		this.#googleApiKey = googleApiKey;
	}

	async getSpreadsheet({ spreadsheetId, range }) {
		if (!spreadsheetId || !range) {
			throw new TypeError(
				'Both arguments {spreadsheetId} and {range} are required and must be a string.',
			);
		}

		const params = generateQueryParams({
			ranges: range,
			includeGridData: true,
			key: this.#googleApiKey,
		});

		const { error, sheets } = await this.#httpClient.get({
			endpoint: `/v4/spreadsheets/${spreadsheetId}?${params}`,
		});

		if (error) throw new Error(error.message);

		return {
			spreadsheet: sheets[0].data[0].rowData,
		};
	}
}
