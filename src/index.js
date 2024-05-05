import { NotificationListener } from './core/notification/notification-listener.js';
import { Notification } from './core/notification/notification.js';
import { GoogleAuthorization } from './libs/google-auth.js';
import { GoogleSheets } from './libs/google-sheets.js';
import { HubSpot } from './libs/hubspot.js';
import { Logger } from './utils/logger.js';

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

const hubSpotNotification = new Notification();
const hubSpotNotificationListener = new NotificationListener(
	'HubSpotNotificationListener',
);

hubSpotNotification.addListener(hubSpotNotificationListener);

const hubSpot = new HubSpot(
	process.env.HUBSPOT_ACCESS_TOKEN,
	hubSpotNotification,
);

const logger = new Logger('DevApi');

(async () => {
	try {
		const { spreedsheet } = await googleSheets.getSpreedsheet({
			spreadsheetId: '1VUP5yPfk25qgDYBB1PrpC-S5hjjGbrKOhmJ_tibeWwA',
			range: 'Página1!A1:E30',
		});

		const { contacts: hubSpotContacts } = await hubSpot.createContactsInBatch({
			inputs: GoogleSheets.mapSpreedsheetContactsToHubSpot(spreedsheet),
		});

		logger.info(`Contacts sent to HubSpot: ${hubSpotContacts.results.length}`);
	} catch (error) {
		logger.error(error);
	}
})();
