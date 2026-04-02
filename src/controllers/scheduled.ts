import * as jwt from 'jsonwebtoken';
import {Op} from 'sequelize';
import jwk from '../config/jwk.js';
import database from '../models/index.js';
import config from '../config/app';
import MultiUseFunctions from '../multi-use-functions';
import {
  FOURTEEN_DAY_MAGIC_LINK_NOTIFY_TEMPLATE_ID,
  FOURTEEN_DAY_REMINDER_NOTIFY_TEMPLATE_ID,
  TWENTY_ONE_DAY_WITHDRAWAL_NOTIFY_TEMPLATE_ID,
  EXPIRED_NO_RETURN_NOTIFY_TEMPLATE_ID,
  EXPIRED_NO_FINAL_RETURN_NOTIFY_TEMPLATE_ID,
  LICENCE_EXPIRES_SOON_NOTIFY_TEMPLATE_ID,
  LICENSING_REPLY_TO_NOTIFY_EMAIL_ID,
  FIRST_OF_MONTH_REMINDER_FOR_LICENCES_WITH_OVERDUE_RETURNS,
} from '../notify-template-ids';
import LicenceController from './license';
import {ApplicationInterface} from './application.js';

// Disabled rules because Notify client has no index.js and implicitly has "any" type, and this is how the import is done
// in the Notify documentation - https://docs.notifications.service.gov.uk/node.html
/* eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, unicorn/prefer-module, prefer-destructuring */
const NotifyClient = require('notifications-node-client').NotifyClient;

const {
  Application,
  Assessment,
  Contact,
  Address,
  License,
  Note,
  Revocation,
  Returns,
  Withdrawal,
  UploadedImage,
  PSpecies,
  PActivity,
} = database;

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
    await notifyClient.sendEmail(FOURTEEN_DAY_MAGIC_LINK_NOTIFY_TEMPLATE_ID, emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: LICENSING_REPLY_TO_NOTIFY_EMAIL_ID,
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
    await notifyClient.sendEmail(FOURTEEN_DAY_REMINDER_NOTIFY_TEMPLATE_ID, emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: LICENSING_REPLY_TO_NOTIFY_EMAIL_ID,
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
    await notifyClient.sendEmail(TWENTY_ONE_DAY_WITHDRAWAL_NOTIFY_TEMPLATE_ID, emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: LICENSING_REPLY_TO_NOTIFY_EMAIL_ID,
    });
  }
};

/**
 * This function calls the Notify API and asks for a reminder email to be sent to
 * the specified email address informing the recipient that the licence has expired
 * and has no return of any type against it.
 *
 * @param {any} emailDetails The details to use in the email to be sent.
 * @param {any} emailAddress The email address to send the email to.
 */
const sendLicenceExpiredNoReturnEmail = async (emailDetails: any, emailAddress: any) => {
  if (config.notifyApiKey) {
    const notifyClient = new NotifyClient(config.notifyApiKey);
    await notifyClient.sendEmail(EXPIRED_NO_RETURN_NOTIFY_TEMPLATE_ID, emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: LICENSING_REPLY_TO_NOTIFY_EMAIL_ID,
    });
  }
};

/**
 * This function calls the Notify API and asks for a reminder email to be sent to
 * the specified email address informing the recipient that the licence has expired
 * and has no final return against it.
 *
 * @param {any} emailDetails The details to use in the email to be sent.
 * @param {any} emailAddress The email address to send the email to.
 */
const sendLicenceExpiredNoFinalReturnEmail = async (emailDetails: any, emailAddress: any) => {
  if (config.notifyApiKey) {
    const notifyClient = new NotifyClient(config.notifyApiKey);
    await notifyClient.sendEmail(EXPIRED_NO_FINAL_RETURN_NOTIFY_TEMPLATE_ID, emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: LICENSING_REPLY_TO_NOTIFY_EMAIL_ID,
    });
  }
};

/**
 * This function calls the Notify API and asks for a reminder email to be sent to
 * the specified email address informing the recipient that the licence will shortly
 * expire.
 *
 * @param {any} emailDetails The details to use in the email to be sent.
 * @param {any} emailAddress The email address to send the email to.
 */
const sendLicenceSoonExpiredEmail = async (emailDetails: any, emailAddress: any) => {
  if (config.notifyApiKey) {
    const notifyClient = new NotifyClient(config.notifyApiKey);
    await notifyClient.sendEmail(LICENCE_EXPIRES_SOON_NOTIFY_TEMPLATE_ID, emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: LICENSING_REPLY_TO_NOTIFY_EMAIL_ID,
    });
  }
};

/**
 * This function calls the Notify API and asks for a reminder email to be sent to
 * the specified email address to remind current gull health and safety licence holders
 * and applicants that are permitted to clear nests and eggs their licence activity
 * and site visit return is due.
 *
 * @param {any} emailDetails The details to use in the email to be sent.
 * @param {any} emailAddress The email address to send the email to.
 */
const sendMonthlyReturnsReminderForOverdueReturns = async (emailDetails: any, emailAddress: any) => {
  if (config.notifyApiKey) {
    const notifyClient = new NotifyClient(config.notifyApiKey);
    await notifyClient.sendEmail(FIRST_OF_MONTH_REMINDER_FOR_LICENCES_WITH_OVERDUE_RETURNS, emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: LICENSING_REPLY_TO_NOTIFY_EMAIL_ID,
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
    applicationDate: MultiUseFunctions.createShortDisplayDate(new Date(applicationDate)),
    onBehalfName: onBehalfContact.name,
    onBehalfOrg: onBehalfContact.organisation ? onBehalfContact.organisation : 'No organisation provided',
    onBehalfEmail: onBehalfContact.emailAddress,
    siteAddress: MultiUseFunctions.createSummaryAddress(siteAddress),
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
    applicationDate: MultiUseFunctions.createShortDisplayDate(new Date(applicationDate)),
    laName: onBehalfContact.name,
    lhOrg: licenceHolderContact.organisation ? licenceHolderContact.organisation : 'No organisation provided',
    lhEmail: licenceHolderContact.emailAddress,
    siteAddress: MultiUseFunctions.createSummaryAddress(siteAddress),
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
    applicationDate: MultiUseFunctions.createShortDisplayDate(new Date(applicationDate)),
    siteAddress: MultiUseFunctions.createSummaryAddress(siteAddress),
    id,
  };
};

const setReturnReminderEmailDetails = (id: number, contact: any, siteAddress: any) => {
  return {
    id,
    name: contact.name,
    siteAddress: MultiUseFunctions.createSummaryAddress(siteAddress),
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

  /**
   * This function returns all applications which have a permitted activity to either remove nests or destroy eggs.
   *
   * @returns {any} Returns an array of applications.
   */

  findAllApplicantsNoReturnCurrentSeason: async () => {
    return Application.findAll({
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
        {
          model: License,
          as: 'License',
          include: [
            {
              model: Returns,
              as: 'Returns',
            },
          ],
        },
        {
          model: Revocation,
          as: 'Revocation',
        },
        {
          model: Withdrawal,
          as: 'Withdrawal',
        },
        {
          model: PSpecies,
          as: 'PSpecies',
          required: true,
          include: [
            {
              model: PActivity,
              as: 'PHerringGull',
            },
            {
              model: PActivity,
              as: 'PBlackHeadedGull',
            },
            {
              model: PActivity,
              as: 'PCommonGull',
            },
            {
              model: PActivity,
              as: 'PGreatBlackBackedGull',
            },
            {
              model: PActivity,
              as: 'PLesserBlackBackedGull',
            },
          ],
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

  /**
   * Gets all applications submitted before the 20th May 2022.
   *
   * @returns {Application[]} A collection of all applications submitted before 20th May 2022.
   */
  getPreTest3Applications: async () => {
    return Application.findAll({
      where: {
        createdAt: {
          [Op.lt]: new Date('2022-05-20 00:00:01.001 +00:00'),
        },
      },
      include: [
        {
          model: Revocation,
          as: 'Revocation',
        },
        {
          model: License,
          as: 'License',
        },
      ],
    });
  },

  /**
   * Gets all applications, including contact, address, licence, withdrawal, revocation
   * and return details. To be used to send out reminder emails.
   *
   * @returns {Application[]} All applications, including contact, address, withdrawal, revocation,
   * licence and returns data.
   */
  getApplications: async () => {
    return Application.findAll({
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
        {
          model: License,
          as: 'License',
          include: [
            {
              model: Returns,
              as: 'Returns',
            },
          ],
        },
        {
          model: Revocation,
          as: 'Revocation',
        },
        {
          model: Withdrawal,
          as: 'Withdrawal',
        },
      ],
    });
  },

  /**
   * Sends out the reminder emails if a licence has expired with no returns, no final return
   * or is valid but due to expire.
   *
   * @param {any} licences A collection of all licences to be sent a reminder.
   * @param {string} reminderType The type of reminder, either `expiredNoReturn`, `expiredNoFinalReturn`
   * or `dueToExpire`, depending on which email is to be sent.
   * @returns {number} Returns the number of emails sent.
   */
  sendReturnReminder: async (licences: any, reminderType: string): Promise<number> => {
    // A count of the number of emails sent.
    let sentCount = 0;

    // Loop through the collection of licences and set up their email details.
    // Then send the email.
    for (const licence of licences) {
      const holderEmailDetails = setReturnReminderEmailDetails(licence.id, licence.LicenceHolder, licence.SiteAddress);

      let applicantEmailDetails;

      // If the licence holder and applicant are different set up email details for applicant too.
      if (licence.LicenceHolder.id !== licence.LicenceApplicant.id) {
        applicantEmailDetails = setReturnReminderEmailDetails(
          licence.id,
          licence.LicenceApplicant,
          licence.SiteAddress,
        );
      }

      /* eslint-disable no-await-in-loop */

      // Check reminder type and send the correct template.
      if (reminderType === 'expiredNoReturn') {
        await sendLicenceExpiredNoReturnEmail(holderEmailDetails, licence.LicenceHolder.emailAddress);
        sentCount++;
        if (applicantEmailDetails) {
          await sendLicenceExpiredNoReturnEmail(applicantEmailDetails, licence.LicenceApplicant.emailAddress);
          sentCount++;
        }
      }

      if (reminderType === 'expiredNoFinalReturn') {
        await sendLicenceExpiredNoFinalReturnEmail(holderEmailDetails, licence.LicenceHolder.emailAddress);
        sentCount++;
        if (applicantEmailDetails) {
          await sendLicenceExpiredNoFinalReturnEmail(applicantEmailDetails, licence.LicenceApplicant.emailAddress);
          sentCount++;
        }
      }

      if (reminderType === 'dueToExpire') {
        await sendLicenceSoonExpiredEmail(holderEmailDetails, licence.LicenceHolder.emailAddress);
        sentCount++;
        if (applicantEmailDetails) {
          await sendLicenceSoonExpiredEmail(applicantEmailDetails, licence.LicenceApplicant.emailAddress);
          sentCount++;
        }
      }

      if (reminderType === 'threeWeeksInNoReturn') {
        await sendMonthlyReturnsReminderForOverdueReturns(holderEmailDetails, licence.LicenceHolder.emailAddress);
        sentCount++;
        if (applicantEmailDetails) {
          await sendMonthlyReturnsReminderForOverdueReturns(
            applicantEmailDetails,
            licence.LicenceApplicant.emailAddress,
          );
          sentCount++;
        }
      }
    }

    /* eslint-enable no-await-in-loop */

    return sentCount;
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

  /**
   * Hard-deletes any Notes and UploadedImages still attached to withdrawn applications.
   *
   * This is only needed to handle applications withdrawn before Note and UploadedImage deletion was added to the
   * withdraw function.
   *
   * TODO: Once any previous applications have been cleaned up, this function can be removed.
   *
   * @returns {number} The number of withdrawn applications processed.
   */
  cleanupWithdrawnApplications: async (): Promise<number> => {
    const withdrawals = await Withdrawal.findAll({attributes: ['ApplicationId']});
    const applicationIds: number[] = withdrawals
      .map((w) => {
        return w.ApplicationId;
      })
      .filter(Boolean);

    if (applicationIds.length === 0) return 0;

    await Note.destroy({where: {ApplicationId: applicationIds}, force: true});
    await UploadedImage.destroy({where: {ApplicationId: applicationIds}, force: true});

    return applicationIds.length;
  },

  /**
   * Returns all refused, expired and revoked applications that are more than 5 years past
   * their relevant terminal date and have not yet had retention applied.
   *
   * - Refused: 5 years past Assessment.updatedAt (when decision was set to false)
   * - Expired: 5 years past License.periodTo, with no Revocation
   * - Revoked: 5 years past Revocation.createdAt (Application is soft-deleted)
   *
   * @returns An array of applications past their retention period.
   */
  getApplicationsPastRetention: async () => {
    const fiveYearsAgo: Date = new Date(new Date().setFullYear(new Date().getFullYear() - 5));

    const [refused, expired, revoked] = await Promise.all([
      // Refused: confirmed applications with a failed assessment, no licence issued
      Application.findAll({
        paranoid: true,
        where: {
          retentionAppliedAt: {[Op.is]: null},
          '$ApplicationAssessment.decision$': false,
          '$ApplicationAssessment.updatedAt$': {[Op.lte]: fiveYearsAgo},
          '$License.ApplicationId$': {[Op.is]: null},
        },
        include: [
          {model: Assessment, as: 'ApplicationAssessment', required: true},
          {model: License, as: 'License', required: false},
        ],
        subQuery: false,
      }),
      // Expired: issued licences where periodTo is more than 5 years ago, not revoked
      Application.findAll({
        paranoid: true,
        where: {
          retentionAppliedAt: {[Op.is]: null},
          '$License.periodTo$': {[Op.lte]: fiveYearsAgo},
          '$Revocation.ApplicationId$': {[Op.is]: null},
        },
        include: [
          {model: License, as: 'License', required: true},
          {model: Revocation, as: 'Revocation', required: false},
        ],
        subQuery: false,
      }),
      // Revoked: soft-deleted applications with a Revocation more than 5 years ago
      Application.findAll({
        paranoid: false,
        where: {
          deletedAt: {[Op.not]: null},
          retentionAppliedAt: {[Op.is]: null},
          '$Revocation.createdAt$': {[Op.lte]: fiveYearsAgo},
        },
        include: [{model: Revocation, as: 'Revocation', required: true}],
        subQuery: false,
      }),
    ]);

    return [...refused, ...expired, ...revoked];
  },

  /**
   * Redacts PII from contact and address records for a refused, expired or revoked application,
   * hard-deletes its officer notes, then marks it as having had retention applied.
   *
   * Uses paranoid: false on updates to handle revoked applications whose records are soft-deleted.
   *
   * @param {any} application The application to apply retention to.
   */
  applyRetentionToApplication: async (application: any): Promise<void> => {
    const contactIds = [...new Set([application.LicenceHolderId, application.LicenceApplicantId])].filter(Boolean);
    const addressIds = [...new Set([application.LicenceHolderAddressId, application.SiteAddressId])].filter(Boolean);

    await database.sequelize.transaction(async (t: any) => {
      if (contactIds.length > 0) {
        await Contact.update(
          {
            name: 'No data',
            organisation: null,
            emailAddress: 'no.data@example.com', // This is value needed to pass validation in src/models/contact.ts,  ContactModel: isEmail: true
            phoneNumber: null,
          },
          {where: {id: contactIds}, paranoid: false, transaction: t},
        );
      }

      if (addressIds.length > 0) {
        await Address.update(
          {
            addressLine1: 'No data',
            addressLine2: null,
            addressTown: 'No data',
            addressCounty: null,
          },
          {where: {id: addressIds}, paranoid: false, transaction: t},
        );
      }

      await Note.destroy({where: {ApplicationId: application.id}, force: true, transaction: t});
      await UploadedImage.destroy({where: {ApplicationId: application.id}, force: true, transaction: t});

      await Application.update(
        {retentionAppliedAt: new Date()},
        {where: {id: application.id}, paranoid: false, transaction: t},
      );
    });
  },

  /**
   * Returns all confirmed, undetermined (unassigned or in-progress) applications whose last
   * transaction (Application.updatedAt) was more than 6 months ago and have not yet had
   * retention applied.
   *
   * @returns {any[]} An array of undetermined applications past their retention period.
   */
  getUndeterminedApplicationsPastRetention: async () => {
    const sixMonthsAgo: Date = new Date(new Date().setMonth(new Date().getMonth() - 6));

    return Application.findAll({
      where: {
        confirmedByLicenseHolder: true,
        retentionAppliedAt: {[Op.is]: null},
        updatedAt: {[Op.lte]: sixMonthsAgo},
        '$License.ApplicationId$': {[Op.is]: null},
        '$Withdrawal.ApplicationId$': {[Op.is]: null},
        '$Revocation.ApplicationId$': {[Op.is]: null},
        '$ApplicationAssessment.decision$': {[Op.not]: false},
      },
      include: [
        {model: Contact, as: 'LicenceHolder'},
        {model: Contact, as: 'LicenceApplicant'},
        {model: Address, as: 'LicenceHolderAddress'},
        {model: Address, as: 'SiteAddress'},
        {model: License, as: 'License', required: false},
        {model: Withdrawal, as: 'Withdrawal', required: false},
        {model: Revocation, as: 'Revocation', required: false},
        {model: Assessment, as: 'ApplicationAssessment', required: false},
      ],
      subQuery: false,
    });
  },

  /**
   * Redacts PII from all contact and address records associated with the given application,
   * then marks the application as having had retention applied.
   *
   * @param {any} application The application to apply retention to.
   */
  applyRetentionToUndeterminedApplication: async (application: any): Promise<void> => {
    const contactIds = [...new Set([application.LicenceHolderId, application.LicenceApplicantId])];
    const addressIds = [...new Set([application.LicenceHolderAddressId, application.SiteAddressId])];

    await database.sequelize.transaction(async (t: any) => {
      await Contact.update(
        {
          name: 'No data',
          organisation: null,
          emailAddress: 'No data',
          phoneNumber: null,
        },
        {where: {id: contactIds}, transaction: t},
      );

      await Address.update(
        {
          addressLine1: 'No data',
          addressLine2: null,
          addressTown: 'No data',
          addressCounty: null,
        },
        {where: {id: addressIds}, transaction: t},
      );

      await application.update({retentionAppliedAt: new Date()}, {transaction: t});
    });
  },

  /**
   * This function will call the LicenceController's reSendEmails function to re-issue licences.
   *
   * @param {any} licences The collection of licenses to be re-issued.
   * @returns {number} Returns the count of licences re-issued.
   */
  resendLicenceEmails: async (licences: any): Promise<number> => {
    let sentCount = 0;

    /* eslint-disable no-await-in-loop */
    for (const licence of licences) {
      await LicenceController.reSendEmails(licence.id);
      sentCount++;
    }
    /* eslint-enable no-await-in-loop */

    return sentCount;
  },
};

export {ScheduledController as default};
