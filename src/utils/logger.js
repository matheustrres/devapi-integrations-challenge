export class Logger {
	#className;

	static #COLORS = {
		RESET: '\u001b[0m',
		GREEN: '\u001b[32m',
		BLUE: '\u001b[34m',
		YELLOW: '\u001b[33m',
		RED: '\u001b[31m',
		BOLD: '\u001b[1m',
	};

	constructor(className) {
		this.#className = className;
	}

	static get currentDate() {
		const date = new Intl.DateTimeFormat('pt-BR', {
			timeStyle: 'long',
			dateStyle: 'short',
		}).format(new Date());

		return date;
	}

	info(message) {
		console.log(
			`${Logger.currentDate} ${Logger.#COLORS.BOLD}${Logger.#COLORS.GREEN}${this.#className} ${Logger.#COLORS.BLUE}INFO ${Logger.#COLORS.RESET}${message}`,
		);
	}

	warn(message) {
		console.warn(
			`${Logger.currentDate} ${Logger.#COLORS.BOLD}${Logger.#COLORS.GREEN}${this.#className} ${Logger.#COLORS.YELLOW}WARN ${Logger.#COLORS.RESET}${message}`,
		);
	}

	error(message) {
		console.error(
			`${Logger.currentDate} ${Logger.#COLORS.BOLD}${Logger.#COLORS.GREEN}${this.#className} ${Logger.#COLORS.RED}ERROR ${Logger.#COLORS.RESET}${message}`,
		);
	}
}
