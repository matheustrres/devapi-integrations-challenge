import { deepStrictEqual, ok, rejects, throws } from 'node:assert';
import { describe, it } from 'node:test';

import { GoogleSheets } from '../../src/libs/google-sheets.js';

function makeSUT(googleApiKey = process.env.GOOGLE_API_KEY) {
	return {
		sut: new GoogleSheets({
			googleApiKey,
		}),
	};
}

describe('GoogleSheets', () => {
	it('should throw if argument googleApiKey is not provided', () => {
		throws(() => new GoogleSheets({}), {
			message: 'Argument {googleApiKey} is required and must be a string.',
		});
	});

	describe('.getSpreadsheet', () => {
		it('should throw if required arguments are not provided', () => {
			const { sut } = makeSUT();

			rejects(() => sut.getSpreadsheet({}), {
				message:
					'Both arguments {spreadsheetId} and {range} are required and must be a string.',
			});
		});

		it('should throw if an invalid spreadsheet id is provided', async () => {
			const { sut } = makeSUT();

			rejects(
				() =>
					sut.getSpreadsheet({
						spreadsheetId: 'invalid_spreadsheet_id',
						range: 'Página1!A1:E20',
					}),
				{
					message: 'Requested entity was not found.',
				},
			);
		});

		it('should throw if an invalid range is provided', async () => {
			const { sut } = makeSUT();

			rejects(
				() =>
					sut.getSpreadsheet({
						spreadsheetId: '1VUP5yPfk25qgDYBB1PrpC-S5hjjGbrKOhmJ_tibeWwA',
						range: 'Data!A2:F14',
					}),
				{
					message: 'Unable to parse range: Data!A2:F14',
				},
			);
		});

		it('should get a spreadsheet', async () => {
			const { sut } = makeSUT();

			const { spreadsheet } = await sut.getSpreadsheet({
				spreadsheetId: '1VUP5yPfk25qgDYBB1PrpC-S5hjjGbrKOhmJ_tibeWwA',
				range: 'Página1!A1:E20',
			});

			ok(spreadsheet);
			deepStrictEqual(
				spreadsheet[0].values[0].formattedValue,
				'Nome da empresa',
			);
			deepStrictEqual(spreadsheet[0].values[1].formattedValue, 'Nome completo');
			deepStrictEqual(spreadsheet[0].values[2].formattedValue, 'Email');
			deepStrictEqual(spreadsheet[0].values[3].formattedValue, 'Telefone');
			deepStrictEqual(spreadsheet[0].values[4].formattedValue, 'Website');
		});
	});
});
