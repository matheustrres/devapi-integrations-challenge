import { Client as HubSpotClient } from '@hubspot/api-client';

export class HubSpot {
	#client;

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

	async createContact({ company, firstName, lastName, email, phone, website }) {
		if (!arguments.length) {
			throw new Error(
				'Arguments for creating a contact are required and must be a string.',
			);
		}

		const contact = await this.#client.crm.contacts.basicApi.create({
			properties: {
				company,
				firstname: firstName,
				lastname: lastName,
				email,
				phone,
				website,
			},
		});

		return contact;
	}

	async createContactsInBatch({ inputs }) {
		if (!Array.isArray(inputs)) {
			throw new Error(
				'Inputs are required for creating contacts and must be an array.',
			);
		}

		inputs.forEach((input) => {
			const { company, firstname, lastname, email, phone, website } =
				input.properties;

			if (!company || !firstname || !lastname || !email || !phone || !website) {
				throw new Error(
					'Each input object must have properties: company, firstname, lastname, email, phone, and website.',
				);
			}
		});

		const contacts = await this.#client.crm.contacts.batchApi.create({
			inputs,
		});

		return {
			contacts,
		};
	}
}
