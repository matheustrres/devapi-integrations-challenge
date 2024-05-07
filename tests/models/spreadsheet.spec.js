import { ok, throws } from 'node:assert';
import { describe, it } from 'node:test';

import { SpreadsheetModel } from '../../src/models/spreadsheet.js';
import { spreadsheet } from '../fixtures/spreadsheet.js';

describe('SpreadsheetModel', () => {
	describe('mapSpreadsheetToHubSpot', () => {
		it('should throw if no spreadsheet is provided', () => {
			throws(() => new SpreadsheetModel().mapSpreadsheetToHubSpot(), {
				message: 'Argument {spreadsheet} is required and must be an array.',
			});
		});

		it('should map Google spreadsheet to HubSpot', () => {
			const hubSpotContacts = new SpreadsheetModel().mapSpreadsheetToHubSpot(
				spreadsheet,
			);

			for (const { properties } of hubSpotContacts) {
				ok(properties.company);
				ok(properties.firstname);
				ok(properties.lastname);
				ok(properties.email);
				ok(properties.phone);
				ok(properties.website);
			}
		});
	});
});
