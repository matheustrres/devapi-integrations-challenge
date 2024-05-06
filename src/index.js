import { NotificationListener } from './core/notification/notification-listener.js';
import { Notification } from './core/notification/notification.js';
import { GoogleSheets } from './libs/google-sheets.js';
import { HubSpot } from './libs/hubspot.js';
import { Logger } from './utils/logger.js';

const googleSheets = new GoogleSheets({
	googleApiKey: process.env.GOOGLE_API_KEY,
});

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
