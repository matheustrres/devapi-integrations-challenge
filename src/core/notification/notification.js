import { NotificationListener } from './notification-listener.js';

export class Notification {
	#listeners = new NotificationListener('Notification');

	#message;

	constructor() {}

	addListener(listener) {
		if (!listener || !(listener instanceof NotificationListener)) {
			throw new TypeError(
				'Argument {listener} must be an instance of NotificationListener.',
			);
		}

		this.#listeners.push(listener);
	}

	notify(message) {
		this.#message = message;

		this.#listeners.forEach((listener) => listener.subscribe(this));
	}

	get message() {
		return this.#message;
	}
}
