import { throws } from 'node:assert';
import { describe, it } from 'node:test';

import { Notification } from '../../src/core/notification/notification.js';
import { HubSpot } from '../../src/libs/hubspot.js';

describe('HubSpot', () => {
	it('should throw if required argument accessToken is not provided', () => {
		throws(() => new HubSpot('', new Notification()), {
			message: 'Argument {accessToken} is required and must be a string.',
		});
	});
});