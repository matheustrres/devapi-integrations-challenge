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

		console.log(sheets[0].data[0].rowData);

		const spreadsheet = this.#mapSpreadsheetToHubSpot(
			sheets[0].data[0].rowData,
		);

		return {
			spreadsheet,
		};
	}

	#mapSpreadsheetToHubSpot(spreadsheet) {
		if (!spreadsheet || !Array.isArray(spreadsheet)) {
			throw new TypeError(
				'Argument {spreadsheet} is required and must be an array.',
			);
		}

		const { invalidColumns, validColumns } =
			GoogleSheets.#mapSpreadsheetColumns({
				spreadsheet,
			});

		if (invalidColumns.length) {
			for (const [
				,
				{ columnIndex, missingProperties },
			] of invalidColumns.entries()) {
				this.#notification.notify(
					`Spreadsheet column [${columnIndex}] is missing properties: ${missingProperties.join(', ')}`,
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

	static #mapSpreadsheetColumns({ spreadsheet }) {
		const spreadsheetHeaders = spreadsheet[0].values.map(
			({ formattedValue }) => formattedValue,
		);

		const spreadsheetWithoutHeaders = spreadsheet.slice(1);

		const invalidColumns = [];

		const validColumns = spreadsheetWithoutHeaders.filter(
			(column, columnIndex) => {
				const columnMissingProperties = [];

				spreadsheetHeaders.forEach((header, headerIndex) => {
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
