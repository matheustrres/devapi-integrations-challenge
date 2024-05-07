import { NotificationListener } from './core/notification/notification-listener.js';
import { Notification } from './core/notification/notification.js';
import { GoogleSheets } from './libs/google-sheets.js';
import { HubSpot } from './libs/hubspot.js';
import { SpreadsheetModel } from './models/spreadsheet.js';
import { Logger } from './utils/logger.js';

const googleSheets = new GoogleSheets({
	googleApiKey: process.env.GOOGLE_API_KEY,
});

const hubSpotNotification = new Notification();
const hubSpotNotificationListener = new NotificationListener(
	'HubSpotNotification',
);

hubSpotNotification.addListener(hubSpotNotificationListener);

const hubSpot = new HubSpot(
	process.env.HUBSPOT_ACCESS_TOKEN,
	hubSpotNotification,
);

const logger = new Logger('DevApi');

(async () => {
	try {
		const { spreadsheet } = await googleSheets.getSpreadsheet({
			spreadsheetId: '1VUP5yPfk25qgDYBB1PrpC-S5hjjGbrKOhmJ_tibeWwA',
			range: 'Página1!A1:E30',
		});

		const { contacts } = await hubSpot.createContactsInBatch({
			inputs: new SpreadsheetModel().mapSpreadsheetToHubSpot(spreadsheet),
		});

		logger.info(`Contacts sent to HubSpot: ${contacts.length}`);
	} catch (error) {
		logger.error(error);
	}
})();
