import { Logger } from '../../utils/logger.js';

export class NotificationListener extends Array {
	#logger;
	#notifications = [];

	static #validate(className) {
		if (!className || typeof className !== 'string') {
			throw new TypeError(
				'Argument {className} is required and must be a string.',
			);
		}
	}

	constructor(className) {
		super(0);

		NotificationListener.#validate(className);

		this.#logger = new Logger(className);
	}

	subscribe(notification) {
		this.#notifications.push(notification);

		this.#logger.info(`New notification received: ${notification.message}`);
	}
}
