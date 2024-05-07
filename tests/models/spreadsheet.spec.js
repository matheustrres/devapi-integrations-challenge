import { throws } from 'node:assert';
import { describe, it } from 'node:test';

import { SpreadsheetModel } from '../../src/models/spreadsheet.js';

describe('SpreadsheetModel', () => {
	describe('mapSpreadsheetToHubSpot', () => {
		it('should throw if no spreadsheet is provided', () => {
			throws(() => new SpreadsheetModel().mapSpreadsheetToHubSpot(), {
				message: 'Argument {spreadsheet} is required and must be an array.',
			});
		});
	});
});
