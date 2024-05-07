import { deepStrictEqual, ok, rejects, strictEqual, throws } from 'node:assert';
import { describe, it } from 'node:test';

import { hubSpotCreationBatchResult } from './fixtures/hubspot-batch.js';
import { HubSpotStub } from './stubs/hubspot.js';

import { Notification } from '../src/core/notification/notification.js';
import { GoogleSheets } from '../src/libs/google-sheets.js';
import { HubSpot } from '../src/libs/hubspot.js';

function makeSUT(accessToken = process.env.HUBSPOT_ACCESS_TOKEN) {
	return {
		sut: new HubSpotStub(accessToken),
	};
}

describe('HubSpot', () => {
	it('should throw if required argument accessToken is not provided', () => {
		throws(() => new HubSpot('', new Notification()), {
			message: 'Argument {accessToken} is required and must be a string.',
		});
	});

	it('should throw if required argument notification is not provided', () => {
		throws(() => new HubSpot('random_access_token'), {
			message:
				'Argument {notification} is required and must be an instance of Notification.',
		});
	});

	describe('.createContactsInBatch', () => {
		it('should throw if array of inputs are not provided', () => {
			const { sut } = makeSUT();

			sut.emitInputsAreInvalidError();

			rejects(() => sut.createContactsInBatch({}), {
				message: 'Argument {inputs} is required and must be an array.',
			});
		});

		it('should create HubSpot contacts', async () => {
			const { sut } = makeSUT();

			const googleSheets = new GoogleSheets({
				googleApiKey: process.env.GOOGLE_API_KEY,
			});

			const { spreadsheet } = await googleSheets.getSpreadsheet({
				spreadsheetId: '1VUP5yPfk25qgDYBB1PrpC-S5hjjGbrKOhmJ_tibeWwA',
				range: 'Página1!A1:E30',
			});

			const { contacts: result } = await sut.createContactsInBatch({
				inputs: spreadsheet,
			});

			ok(result);
			deepStrictEqual(result.results, hubSpotCreationBatchResult);
		});
	});
});
