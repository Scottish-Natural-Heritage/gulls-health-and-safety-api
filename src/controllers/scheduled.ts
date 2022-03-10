import * as jwt from 'jsonwebtoken';

import jwk from '../config/jwk.js';
import database from '../models/index.js';

import config from '../config/app';
import {ApplicationInterface} from './application.js';

// Disabled rules because Notify client has no index.js and implicitly has "any" type, and this is how the import is done
// in the Notify documentation - https://docs.notifications.service.gov.uk/node.html
/* eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, unicorn/prefer-module, prefer-destructuring */
const NotifyClient = require('notifications-node-client').NotifyClient;

const {Application, Contact, Address} = database;

/**
 * This function returns a summary address built from the address fields of an address object.
 *
 * @param {any} fullAddress The address to use to build the summary address from.
 * @returns {string} Returns a string containing the summary address.
 */
const createSummaryAddress = (fullAddress: any): string => {
  const address = [];
  address.push(fullAddress.addressLine1.trim());
  // As addressLine2 is optional we need to check if it exists.
  if (fullAddress.addressLine2) {
    address.push(fullAddress.addressLine2.trim());
  }

  address.push(fullAddress.addressTown.trim(), fullAddress.addressCounty.trim(), fullAddress.postcode.trim());

  return address.join(', ');
};

// Create a more user friendly displayable date from a date object, format (dd/mm/yyy).
const createDisplayDate = (date: Date) => {
  return date.toLocaleDateString('en-GB', {year: 'numeric', month: 'numeric', day: 'numeric'});
};

/**
 * This function calls the Notify API and asks for a 14 day reminder email to be sent to
 * the to be licence holder asking them to confirm their details.
 *
 * @param {any} emailDetails The details to use in the email to be sent.
 * @param {any} emailAddress The email address to send the email to.
 */
const sendReminderMagicLinkEmail = async (emailDetails: any, emailAddress: any) => {
  if (config.notifyApiKey) {
    const notifyClient = new NotifyClient(config.notifyApiKey);
    await notifyClient.sendEmail('328d9fa5-b7be-443b-85f5-1b2c80f94022', emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: '4b49467e-2a35-4713-9d92-809c55bf1cdd',
    });
  }
};

/**
 * This function calls the Notify API and asks for a 14 day reminder email to be sent to
 * the licence applicant.
 *
 * @param {any} emailDetails The details to use in the email to be sent.
 * @param {any} emailAddress The email address to send the email to.
 */
const sendReminderEmailForApplicant = async (emailDetails: any, emailAddress: any) => {
  if (config.notifyApiKey) {
    const notifyClient = new NotifyClient(config.notifyApiKey);
    await notifyClient.sendEmail('52c8aa89-7fec-41c2-bb02-646ed61470d3', emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: '4b49467e-2a35-4713-9d92-809c55bf1cdd',
    });
  }
};

/**
 * This function calls the Notify API and asks for a 21 day withdraw email to be sent.
 *
 * @param {any} emailDetails The details to use in the email to be sent.
 * @param {any} emailAddress The email address to send the email to.
 */
const sendWithdrawEmail = async (emailDetails: any, emailAddress: any) => {
  if (config.notifyApiKey) {
    const notifyClient = new NotifyClient(config.notifyApiKey);
    await notifyClient.sendEmail('d2dfaf64-49fb-4383-9713-33aa55898afa', emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: '4b49467e-2a35-4713-9d92-809c55bf1cdd',
    });
  }
};

/**
 * This function returns an object containing the details required for the licence holder
 * fourteen day reminder email.
 *
 * @param {number} id The confirmed application's reference number.
 * @param {string} applicationDate The date the application was created on.
 * @param {any} licenceHolderContact The licence holder's contact details.
 * @param {any} onBehalfContact The licence applicant's contact details.
 * @param {any} siteAddress The address of the site to which the licence pertains.
 * @param {string} confirmBaseUrl The URL to use when creating the magic link.
 * @returns {any} An object with the required details set.
 */
const set14DayReminderEmailDetails = async (
  id: number,
  applicationDate: string,
  licenceHolderContact: any,
  onBehalfContact: any,
  siteAddress: any,
  confirmBaseUrl: string,
) => {
  // Get the private key.
  const privateKey = await jwk.getPrivateKey({type: 'pem'});

  // Create JWT.
  const token = jwt.sign({}, privateKey as string, {
    algorithm: 'ES256',
    expiresIn: '7 days',
    noTimestamp: true,
    subject: `${id}`,
  });

  // Append JWT to confirm url.
  const magicLink = `${confirmBaseUrl}${token}`;

  return {
    lhName: licenceHolderContact.name,
    applicationDate: createDisplayDate(new Date(applicationDate)),
    onBehalfName: onBehalfContact.name,
    onBehalfOrg: onBehalfContact.organisation ? onBehalfContact.organisation : 'No organisation provided',
    onBehalfEmail: onBehalfContact.emailAddress,
    siteAddress: createSummaryAddress(siteAddress),
    magicLink,
    id,
  };
};

const set14DayReminderEmailDetailsForApplicant = async (
  id: number,
  applicationDate: string,
  licenceHolderContact: any,
  onBehalfContact: any,
  siteAddress: any,
) => {
  return {
    lhName: licenceHolderContact.name,
    applicationDate: createDisplayDate(new Date(applicationDate)),
    laName: onBehalfContact.name,
    lhOrg: licenceHolderContact.organisation ? licenceHolderContact.organisation : 'No organisation provided',
    lhEmail: licenceHolderContact.emailAddress,
    siteAddress: createSummaryAddress(siteAddress),
    id,
  };
};

const set21DayWithdrawEmailDetails = (
  id: number,
  applicationDate: string,
  licenceHolderContact: any,
  onBehalfContact: any,
  siteAddress: any,
) => {
  return {
    lhName: licenceHolderContact.name,
    onBehalfName: onBehalfContact.name,
    applicationDate: createDisplayDate(new Date(applicationDate)),
    siteAddress: createSummaryAddress(siteAddress),
    id,
  };
};

const ScheduledController = {
  getUnconfirmed: async () => {
    return Application.findAll({
      where: {confirmedByLicenseHolder: false, fourteenDayReminder: false || null},
      include: [
        {
          model: Contact,
          as: 'LicenceHolder',
        },
        {
          model: Contact,
          as: 'LicenceApplicant',
        },
        {
          model: Address,
          as: 'LicenceHolderAddress',
        },
        {
          model: Address,
          as: 'SiteAddress',
        },
      ],
    });
  },

  getUnconfirmedReminded: async () => {
    return Application.findAll({
      where: {confirmedByLicenseHolder: false, fourteenDayReminder: true},
      include: [
        {
          model: Contact,
          as: 'LicenceHolder',
        },
        {
          model: Contact,
          as: 'LicenceApplicant',
        },
        {
          model: Address,
          as: 'LicenceHolderAddress',
        },
        {
          model: Address,
          as: 'SiteAddress',
        },
      ],
    });
  },

  checkUnconfirmedAndSendReminder: async (unconfirmed: any, confirmBaseUrl: any) => {
    const todayDateMinusFourteenDays: Date = new Date(new Date().setDate(new Date().getDate() - 14));

    // Filter any unconfirmed applications to only include those that are 14 days old or older.
    unconfirmed = unconfirmed.filter((application: any) => {
      return new Date(application.createdAt) <= todayDateMinusFourteenDays;
    });

    for (const application of unconfirmed) {
      // Loop through each application and create personalisation object, the await needs to be part of the loop.
      // eslint-disable-next-line no-await-in-loop
      const emailDetails = await set14DayReminderEmailDetails(
        application.id,
        application.createdAt,
        application.LicenceHolder,
        application.LicenceApplicant,
        application.SiteAddress,
        confirmBaseUrl,
      );

      // eslint-disable-next-line no-await-in-loop
      const applicantEmailDetails = await set14DayReminderEmailDetailsForApplicant(
        application.id,
        application.createdAt,
        application.LicenceHolder,
        application.LicenceApplicant,
        application.SiteAddress,
      );

      // Send the reminder emails, the awaits needs to be part of the loop.
      /* eslint-disable no-await-in-loop */
      await sendReminderMagicLinkEmail(emailDetails, application.LicenceHolder.emailAddress);
      await sendReminderEmailForApplicant(applicantEmailDetails, application.LicenceApplicant.emailAddress);
      /* eslint-enable no-await-in-loop */
    }

    // Return the unconfirmed array of applications or undefined if empty.
    return unconfirmed ? (unconfirmed as ApplicationInterface[]) : undefined;
  },

  checkUnconfirmedAndWithdraw: async (unconfirmed: any) => {
    const todayDateMinusTwentyOneDays: Date = new Date(new Date().setDate(new Date().getDate() - 21));

    // Filter any unconfirmed applications to only include those that are 21 days old or older.
    unconfirmed = unconfirmed.filter((application: any) => {
      return new Date(application.createdAt) <= todayDateMinusTwentyOneDays;
    });

    for (const application of unconfirmed) {
      // Loop through each application and create personalisation object.
      const emailDetails = set21DayWithdrawEmailDetails(
        application.id,
        application.createdAt,
        application.LicenceHolder,
        application.LicenceApplicant,
        application.SiteAddress,
      );

      // Send the withdraw emails, the awaits needs to be part of the loop.
      /* eslint-disable no-await-in-loop */
      await sendWithdrawEmail(emailDetails, application.LicenceHolder.emailAddress);
      await sendWithdrawEmail(emailDetails, application.LicenceApplicant.emailAddress);
      /* eslint-enable no-await-in-loop */
    }

    // Return the unconfirmed array of applications or undefined if empty.
    return unconfirmed ? (unconfirmed as ApplicationInterface[]) : undefined;
  },
};

export {ScheduledController as default};
