import { Client as HubSpotClient } from '@hubspot/api-client';

import { isCorporateEmail } from '../utils/is-corporate-email.js';
import { Logger } from '../utils/logger.js';

export class HubSpot {
	#logger = new Logger(HubSpot.constructor.name);

	#client;

	static #requiredContactProperties = [
		'company',
		'firstname',
		'lastname',
		'email',
		'phone',
		'website',
	];

	static #validate(accessToken) {
		if (!accessToken || typeof accessToken !== 'string') {
			throw new TypeError(
				'Argument {accessToken} is required and must be a string.',
			);
		}
	}

	constructor(accessToken) {
		HubSpot.#validate(accessToken);

		this.#client = new HubSpotClient({
			accessToken,
		});
	}

	async createContactsInBatch({ inputs }) {
		if (!Array.isArray(inputs)) {
			throw new Error('Argument {inputs} is required and must be an array.');
		}

		const corporateInputs = [];
		const nonCorporateInputs = [];

		inputs.forEach((input, index) => {
			if (isCorporateEmail(input.properties.email)) {
				const missingProperties = HubSpot.#requiredContactProperties.filter(
					(prop) => !input.properties[prop],
				);

				if (missingProperties.length) {
					throw new Error(
						`Input [${index++}] is missing properties ${missingProperties.join(', ')}`,
					);
				}

				corporateInputs.push(input);
			} else {
				nonCorporateInputs.push(input);
			}
		});

		this.#logger.info(
			`${corporateInputs.length} corporate inputs were found and sent to HubSpot`,
		);

		this.#logger.info(
			`${nonCorporateInputs.length} non-corporate inputs were found and not sent to HubSpot.`,
			nonCorporateInputs,
		);

		const contacts = await this.#client.crm.contacts.batchApi.create({
			inputs: corporateInputs,
		});

		return {
			contacts,
		};
	}
}
