export function isCorporateEmail(email) {
	const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com'];

	const domain = email.split('@')[1];

	return allowedDomains.includes(domain);
}
