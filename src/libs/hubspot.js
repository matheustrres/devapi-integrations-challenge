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
			this.#mapMissingPropertiesForCreationBatch({ inputs, invalidContacts });
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

	#mapMissingPropertiesForCreationBatch({ inputs, invalidContacts }) {
		if (!Array.isArray(inputs) || !Array.isArray(invalidContacts)) {
			throw new TypeError(
				'Both arguments {inputs} and {invalidContacts} are required and must be an array.',
			);
		}

		for (let [index, input] of inputs.entries()) {
			if (invalidContacts.includes(input)) {
				const missingProperties = HubSpot.#requiredContactProperties.filter(
					(prop) => !input.properties[prop],
				);

				this.#notification.notify(
					`Contact [${index++}] is missing properties: ${missingProperties.join(', ')}`,
				);
			}
		}
	}
}
