import { NotificationListener } from '../core/notification/notification-listener.js';
import { Notification } from '../core/notification/notification.js';

export class SpreadsheetModel {
	#notification;

	constructor() {
		this.#notification = new Notification();

		const spreadsheetNotificationListener = new NotificationListener(
			'SpreadsheetNotification',
		);

		this.#notification.addListener(spreadsheetNotificationListener);
	}

	mapSpreadsheetToHubSpot(spreadsheet) {
		if (!spreadsheet || !Array.isArray(spreadsheet)) {
			throw new TypeError(
				'Argument {spreadsheet} is required and must be an array.',
			);
		}

		const { invalidColumns, validColumns } =
			SpreadsheetModel.#mapColumns(spreadsheet);

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

	static #mapColumns(spreadsheet) {
		const spreadsheetHeaders = spreadsheet[0].values.map(
			({ formattedValue }) => formattedValue,
		);

		const spreadsheetWithoutHeaders = spreadsheet.slice(1);

		const invalidColumns = [];

		const validColumns = spreadsheetWithoutHeaders.filter(
			(column, columnIndex) => {
				const columnMissingProperties = [];

				spreadsheetHeaders.forEach((header, headerIndex) => {
					if (!column.values[headerIndex]?.formattedValue)
						columnMissingProperties.push(header);
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
