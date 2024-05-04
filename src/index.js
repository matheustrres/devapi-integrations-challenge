import { GoogleAuthorization } from './libs/google-auth.js';
import { GoogleSheets } from './libs/google-sheets.js';
import { HubSpot } from './libs/hubspot.js';

const SPREADSHEETS_SCOPES = [
	'https://www.googleapis.com/auth/spreadsheets',
	'https://www.googleapis.com/auth/spreadsheets.readonly',
];

const googleAuthorization = new GoogleAuthorization({
	clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
	privateKey: process.env.GOOGLE_PRIVATE_KEY,
	scopes: SPREADSHEETS_SCOPES,
});

const googleSheets = new GoogleSheets(googleAuthorization);
const hubSpot = new HubSpot(process.env.HUBSPOT_ACCESS_TOKEN);

(async () => {
	try {
		const { spreedsheet } = await googleSheets.getSpreedsheet({
			spreadsheetId: '1VUP5yPfk25qgDYBB1PrpC-S5hjjGbrKOhmJ_tibeWwA',
			range: 'Página1!A1:F6',
		});

		const { contacts: hubSpotContacts } = await hubSpot.createContactsInBatch({
			inputs: GoogleSheets.mapSpreedsheetContactsToHubSpot(spreedsheet),
		});

		console.log(hubSpotContacts);
	} catch (error) {
		console.error(error);
	}
})();
