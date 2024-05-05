import { Client as HubSpotClient } from '@hubspot/api-client';

import { Notification } from '../core/notification/notification.js';
import { isCorporateEmail } from '../utils/is-corporate-email.js';
import { Logger } from '../utils/logger.js';

export class HubSpot {
	#logger = new Logger('HubSpot');

	#client;
	#notification;

	static #requiredContactProperties = [
		'company',
		'firstname',
		'lastname',
		'email',
		'phone',
		'website',
	];

	static #validate(accessToken, notification) {
		if (!accessToken || typeof accessToken !== 'string') {
			throw new TypeError(
				'Argument {accessToken} is required and must be a string.',
			);
		}

		if (!notification || !(notification instanceof Notification)) {
			throw new TypeError(
				'Argument {notification} is required and must be an instance of Notification.',
			);
		}
	}

	constructor(accessToken, notification) {
		HubSpot.#validate(accessToken, notification);

		this.#client = new HubSpotClient({
			accessToken,
		});

		this.#notification = notification;
	}

	async createContactsInBatch({ inputs }) {
		if (!Array.isArray(inputs)) {
			throw new Error('Argument {inputs} is required and must be an array.');
		}

		const invalidContacts = inputs.filter(
			({ properties }) =>
				!HubSpot.#requiredContactProperties.every((prop) => properties[prop]),
		);

		if (invalidContacts.length) {
			for (const [index, { properties }] of invalidContacts.entries()) {
				const missingProperties = HubSpot.#requiredContactProperties.filter(
					(prop) => !properties[prop],
				);

				this.#notification.notify(
					`Contact [${index + 1}] is missing properties: ${missingProperties.join(', ')}`,
				);
			}
		}

		const corporateInputs = inputs.filter(({ properties }) =>
			isCorporateEmail(properties.email),
		);

		const nonCorporateInputsLength = inputs.length - corporateInputs.length;

		this.#logger.info(`${corporateInputs.length} corporate inputs found`);
		this.#logger.info(`${nonCorporateInputsLength} non-corporate inputs found`);

		const contacts = await this.#client.crm.contacts.batchApi.create({
			inputs: corporateInputs,
		});

		return {
			contacts,
		};
	}
}
