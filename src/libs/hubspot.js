import { Notification } from '../core/notification/notification.js';
import { HttpClient } from '../utils/http-client.js';
import { Logger } from '../utils/logger.js';

export class HubSpot {
	#logger = new Logger('HubSpot');

	#accessToken;
	#httpClient;
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

		this.#accessToken = accessToken;
		this.#notification = notification;

		this.#httpClient = new HttpClient('https://api.hubapi.com/crm');
	}

	async createContactsInBatch({ inputs }) {
		if (!inputs || !Array.isArray(inputs)) {
			throw new TypeError(
				'Argument {inputs} is required and must be an array.',
			);
		}

		const invalidContacts = inputs.filter(
			({ properties }) =>
				!HubSpot.#requiredContactProperties.every((prop) => properties[prop]),
		);

		if (invalidContacts?.length) {
			this.#mapMissingPropertiesForCreationBatch({ inputs, invalidContacts });
		}

		const corporateInputs = inputs.filter(({ properties }) =>
			this.#isCorporateEmail(properties.email),
		);

		const nonCorporateInputsLength = inputs.length - corporateInputs.length;

		this.#logger.info(`${corporateInputs.length} corporate inputs found`);
		this.#logger.info(`${nonCorporateInputsLength} non-corporate inputs found`);

		const mappedBody = corporateInputs.map(({ properties }) => ({
			properties: { ...properties },
		}));

		const { status, results, message } = await this.#httpClient.post({
			endpoint: 'v3/objects/contacts/batch/create',
			headers: {
				Authorization: `Bearer ${this.#accessToken}`,
				'Content-Type': 'application/json',
			},
			body: {
				inputs: mappedBody,
			},
		});

		if (status === 'error') throw new Error(message);

		return {
			contacts: results,
		};
	}

	#isCorporateEmail(email) {
		if (!email || typeof email !== 'string') {
			throw new TypeError('Argument {email} is required and must a string');
		}

		const corporateEmailRegex = /@((gmail|yahoo|hotmail)\.com)$/i;
		return corporateEmailRegex.test(email);
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
