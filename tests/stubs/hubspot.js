import { NotificationListener } from '../../src/core/notification/notification-listener.js';
import { Notification } from '../../src/core/notification/notification.js';
import { HubSpot } from '../../src/libs/hubspot.js';
import { hubSpotCreationBatchResult } from '../fixtures/hubspot-batch.js';

export class HubSpotStub extends HubSpot {
	#areInputsInvalid = false;

	constructor(accessToken = process.env.HUBSPOT_ACCESS_TOKEN) {
		const hubSpotNotification = new Notification();
		const hubSpotNotificationListener = new NotificationListener(
			'HubSpotNotificationListener',
		);

		hubSpotNotification.addListener(hubSpotNotificationListener);

		super(accessToken, hubSpotNotification);
	}

	async createContactsInBatch({ inputs }) {
		if (this.#areInputsInvalid) {
			throw new Error('Argument {inputs} is required and must be an array.');
		}

		return {
			contacts: {
				status: 'COMPLETE',
				results: hubSpotCreationBatchResult,
				startedAt: new Date().toISOString(),
				completedAt: new Date().toISOString(),
			},
		};
	}

	emitInputsAreInvalidError() {
		this.#areInputsInvalid = true;
		return this;
	}
}
