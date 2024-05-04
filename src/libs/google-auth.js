import { GoogleAuth } from 'google-auth-library';

export class GoogleAuthorization {
	#auth;

	static #validate({ clientEmail, privateKey, scopes }) {
		if (!clientEmail || typeof clientEmail !== 'string') {
			throw new TypeError(
				'Argument {clientEmail} is required and must be a string.',
			);
		}

		if (!privateKey || typeof privateKey !== 'string') {
			throw new TypeError(
				'Argument {privateKey} is required and must be a string.',
			);
		}

		if (!scopes || !Array.isArray(scopes)) {
			throw new TypeError(
				'Argument {scopes} is required and must be an array of strings',
			);
		}
	}

	constructor({ clientEmail, privateKey, scopes }) {
		GoogleAuthorization.#validate({ privateKey, clientEmail, scopes });

		this.#auth = new GoogleAuth({
			credentials: {
				private_key: privateKey,
				client_email: clientEmail,
			},
			scopes,
		});
	}

	async getClient() {
		return await this.#auth.getClient();
	}
}
