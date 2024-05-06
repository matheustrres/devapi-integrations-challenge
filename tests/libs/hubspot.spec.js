import { rejects, throws } from 'node:assert';
import { describe, it } from 'node:test';

import { NotificationListener } from '../../src/core/notification/notification-listener.js';
import { Notification } from '../../src/core/notification/notification.js';
import { HubSpot } from '../../src/libs/hubspot.js';

function makeSUT(accessToken = process.env.HUBSPOT_ACCESS_TOKEN) {
	const hubSpotNotification = new Notification();
	const hubSpotNotificationListener = new NotificationListener(
		'HubSpotNotificationListener',
	);

	hubSpotNotification.addListener(hubSpotNotificationListener);

	return {
		hubSpotNotification,
		sut: new HubSpot(accessToken, hubSpotNotification),
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
		it('should throw if an array of inputs are not provided', () => {
			const { sut } = makeSUT();

			rejects(() => sut.createContactsInBatch({}), {
				message: 'Argument {inputs} is required and must be an array.',
			});
		});
	});
});
