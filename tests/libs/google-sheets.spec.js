import { rejects, throws } from 'node:assert';
import { describe, it } from 'node:test';

import { GoogleSheets } from '../../src/libs/google-sheets.js';

function makeSUT() {
	return {
		sut: new GoogleSheets({
			googleApiKey: 'random_google_api_key',
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
});
