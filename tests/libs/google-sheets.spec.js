import { rejects, throws } from 'node:assert';
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
	it('should throw if required arguments are not provided', () => {
		const { sut } = makeSUT();

		rejects(() => sut.getSpreedsheet({}), {
			message:
				'Both arguments {spreadsheetId} and {range} are required and must be a string.',
		});
	});

	it('should throw if an invalid spreedsheet id is provided', async () => {
		const { sut } = makeSUT();

		rejects(
			() =>
				sut.getSpreedsheet({
					spreadsheetId: 'invalid_spreedsheet_id',
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
				sut.getSpreedsheet({
					spreadsheetId: '1VUP5yPfk25qgDYBB1PrpC-S5hjjGbrKOhmJ_tibeWwA',
					range: 'Data!A2:F14',
				}),
			{
				message: 'Unable to parse range: Data!A2:F14',
			},
		);
	});
});
