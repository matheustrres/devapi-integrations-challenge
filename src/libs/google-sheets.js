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

	async getSpreedsheet({ spreadsheetId, range }) {
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

		const spreedsheet = await this.#httpClient.get({
			endpoint: `/v4/spreadsheets/${spreadsheetId}?${params}`,
		});

		if (spreedsheet.error) {
			throw new Error(spreedsheet.error.message);
		}

		return {
			spreedsheet: spreedsheet.sheets[0].data[0].rowData,
		};
	}

	static mapSpreedsheetContactsToHubSpot(spreedsheet) {
		if (!spreedsheet || !Array.isArray(spreedsheet)) {
			throw new TypeError(
				'Argument {spreedsheet} is required and must be an array.',
			);
		}

		const withoutHeaders = spreedsheet.slice(1);

		return withoutHeaders.map(({ values: rowValue }) => {
			return {
				properties: {
					company: rowValue[0].formattedValue,
					firstname: rowValue[1].formattedValue.split(' ')[0],
					lastname: rowValue[1].formattedValue.split(' ')[1],
					email: rowValue[2].formattedValue,
					phone: rowValue[3].formattedValue,
					website: rowValue[4].formattedValue,
				},
			};
		});
	}
}
