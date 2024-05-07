import { Notification } from '../core/notification/notification.js';
import { generateQueryParams } from '../utils/funcs/gen-query-params.js';
import { HttpClient } from '../utils/http-client.js';

export class GoogleSheets {
	#httpClient;
	#googleApiKey;
	#notification;

	static #validate({ googleApiKey, notification }) {
		if (!googleApiKey || typeof googleApiKey !== 'string') {
			throw new TypeError(
				'Argument {googleApiKey} is required and must be a string.',
			);
		}

		if (!notification || !(notification instanceof Notification)) {
			throw new TypeError(
				'Argument {notification} is required and must be instance of Notification.',
			);
		}
	}

	constructor({ googleApiKey, notification }) {
		GoogleSheets.#validate({ googleApiKey, notification });

		this.#httpClient = new HttpClient('https://sheets.googleapis.com');
		this.#googleApiKey = googleApiKey;
		this.#notification = notification;
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

		const { error, sheets } = await this.#httpClient.get({
			endpoint: `/v4/spreadsheets/${spreadsheetId}?${params}`,
		});

		if (error) throw new Error(error.message);

		const spreedsheet = this.#mapSpreedsheetToHubSpot(
			sheets[0].data[0].rowData,
		);

		return {
			spreedsheet,
		};
	}

	#mapSpreedsheetToHubSpot(spreedsheet) {
		if (!spreedsheet || !Array.isArray(spreedsheet)) {
			throw new TypeError(
				'Argument {spreedsheet} is required and must be an array.',
			);
		}

		const { invalidColumns, validColumns } =
			GoogleSheets.#mapSpreedsheetColumns({
				spreedsheet,
			});

		if (invalidColumns.length) {
			for (const [
				,
				{ columnIndex, missingProperties },
			] of invalidColumns.entries()) {
				this.#notification.notify(
					`Spreedsheet column [${columnIndex}] is missing properties: ${missingProperties.join(', ')}`,
				);
			}
		}

		return validColumns.map(({ values: columnValue }) => ({
			properties: {
				company: columnValue[0].formattedValue,
				firstname: columnValue[1].formattedValue.split(' ')[0],
				lastname: columnValue[1].formattedValue.split(' ')[1],
				email: columnValue[2].formattedValue,
				phone: columnValue[3].formattedValue,
				website: columnValue[4].formattedValue,
			},
		}));
	}

	static #mapSpreedsheetColumns({ spreedsheet }) {
		const spreedsheetHeaders = spreedsheet[0].values.map(
			({ formattedValue }) => formattedValue,
		);

		const spreedsheetWithoutHeaders = spreedsheet.slice(1);

		const invalidColumns = [];

		const validColumns = spreedsheetWithoutHeaders.filter(
			(column, columnIndex) => {
				const columnMissingProperties = [];

				spreedsheetHeaders.forEach((header, headerIndex) => {
					if (!column.values[headerIndex]?.formattedValue) {
						columnMissingProperties.push(header);
					}
				});

				if (columnMissingProperties.length) {
					invalidColumns.push({
						columnIndex: columnIndex + 2,
						missingProperties: columnMissingProperties,
					});

					return false;
				}

				return true;
			},
		);

		return {
			validColumns,
			invalidColumns,
		};
	}
}
