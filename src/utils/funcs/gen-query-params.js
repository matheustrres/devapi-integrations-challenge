export function generateQueryParams(params) {
	if (!params || typeof params !== 'object') {
		throw new TypeError('Argument {params} is required and must be an object.');
	}

	return Object.entries(params)
		.filter(([_, value]) => value)
		.map(([key, value]) => `${key}=${value}`)
		.join('&');
}
