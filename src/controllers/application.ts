import * as jwt from 'jsonwebtoken';

import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';
import config from '../config/app';
import jwk from '../config/jwk.js';

const {Application, Contact, Address, Activity, Issue, Measure, Species, Assessment} = database;

// Disabled rules because Notify client has no index.js and implicitly has "any" type, and this is how the import is done
// in the Notify documentation - https://docs.notifications.service.gov.uk/node.html
/* eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, unicorn/prefer-module, prefer-destructuring */
const NotifyClient = require('notifications-node-client').NotifyClient;

/**
 * Local interface to hold the species ID foreign keys.
 */
interface SpeciesIds {
  HerringGullId: number | undefined;
  BlackHeadedGullId: number | undefined;
  CommonGullId: number | undefined;
  GreatBlackBackedGullId: number | undefined;
  LesserBlackBackedGullId: number | undefined;
}

/**
 * Local interface of the application.
 */
interface ApplicationInterface {
  id: number;
  LicenceHolderId: number;
  LicenceApplicantId: number;
  LicenceHolderAddressId: number;
  SiteAddressId: number;
  SpeciesId: number;
  isResidentialSite: boolean;
  siteType: string;
  previousLicence: boolean;
  previousLicenceNumber: string;
  supportingInformation: string;
  confirmedByLicensingHolder: boolean;
}

// Create a more user friendly displayable date from a date object.
const createDisplayDate = (date: Date) => {
  return date.toLocaleDateString('en-GB', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
};

/**
 * This function returns an object containing the details required for the license holder direct email.
 *
 * @param {any} newApplication The newly created application, from which we get the application ID.
 * @param {any} licenceHolderContact The licence holder's contact details.
 * @param {any} siteAddress The address of the site to which the licence pertains.
 * @returns {any} An object with the required details set.
 */
const setLicenceHolderDirectEmailDetails = (newApplication: any, licenceHolderContact: any, siteAddress: any) => {
  return {
    licenceName: licenceHolderContact.name,
    applicationDate: createDisplayDate(new Date(newApplication.createdAt)),
    siteName: siteAddress.addressLine1,
    id: newApplication.id,
  };
};

/**
 * This function returns an object containing the details required for the licence holder and the
 * licence applicant confirmation emails.
 *
 * @param {number} id The confirmed application's reference number.
 * @param {string} createdAt The date the application was created on.
 * @param {any} licenceHolderContact The licence holder's contact details.
 * @param {any} onBehalfContact The licence applicant's contact details.
 * @param {any} siteAddress The address of the site to which the licence pertains.
 * @returns {any} An object with the required details set.
 */
const setHolderApplicantConfirmEmailDetails = (
  id: number,
  createdAt: string,
  licenceHolderContact: any,
  onBehalfContact: any,
  siteAddress: any,
) => {
  return {
    lhName: licenceHolderContact.name,
    laName: onBehalfContact.name,
    applicationDate: createDisplayDate(new Date(createdAt)),
    siteName: siteAddress.addressLine1,
    id,
  };
};

/**
 * This function calls the Notify API and asks for an email to be sent with the supplied details.
 *
 * @param {any} emailDetails The details to use in the email to be sent.
 * @param {any} emailAddress The email address to send the email to.
 */
const sendLicenceHolderDirectEmail = async (emailDetails: any, emailAddress: any) => {
  if (config.notifyApiKey) {
    const notifyClient = new NotifyClient(config.notifyApiKey);
    notifyClient.sendEmail('5892536f-15cb-4787-82dc-d9b83ccc00ba', emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: '4b49467e-2a35-4713-9d92-809c55bf1cdd',
    });
  }
};

/**
 * This function returns an object containing the details required for the license applicant notification email.
 *
 * @param {any} licenceApplicantContact The licence applicant's contact details.
 * @param {any} licenceHolderContact The licence holder's contact details.
 * @returns {any} An object with the required details set.
 */
const setLicenceApplicantNotificationDetails = (licenceApplicantContact: any, licenceHolderContact: any) => {
  return {
    laName: licenceApplicantContact.name,
    lhName: licenceHolderContact.name,
    lhOrg: licenceHolderContact.organisation,
    lhEmail: licenceHolderContact.emailAddress,
  };
};

/**
 * This function calls the Notify API and asks for an email to be send with the supplied details.
 *
 * @param {any} emailDetails The details to use in the email to be sent.
 * @param {any} emailAddress The email address to send the email to.
 */
const sendLicenceApplicantNotificationEmail = async (emailDetails: any, emailAddress: any) => {
  if (config.notifyApiKey) {
    const notifyClient = new NotifyClient(config.notifyApiKey);
    notifyClient.sendEmail('6955dccf-c7ad-460f-8d5d-82ad984d018a', emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: '4b49467e-2a35-4713-9d92-809c55bf1cdd',
    });
  }
};

/**
 * This function returns an object containing the details required for the licence holders magic link email.
 *
 * @param {string} confirmBaseUrl The micro-frontend we want to send the lh to to confirm their licence.
 * @param {number} applicationId The application we want the lh to confirm.
 * @param {any} licenceHolderContact The licence holder's contact details.
 * @param {any} licenceApplicantContact The licence applicant's contact details.
 * @returns {any} An object with the required details set.
 */
const setLicenceHolderMagicLinkDetails = async (
  confirmBaseUrl: string,
  applicationId: number,
  licenceHolderContact: any,
  licenceApplicantContact: any,
) => {
  // Get the private key.
  const privateKey = await jwk.getPrivateKey({type: 'pem'});

  // Create JWT.
  const token = jwt.sign({}, privateKey as string, {
    algorithm: 'ES256',
    expiresIn: '28 days',
    noTimestamp: true,
    subject: `${applicationId}`,
  });

  // Append JWT to confirm url.
  const magicLink = `${confirmBaseUrl}${token}`;

  return {
    lhName: licenceHolderContact.name,
    onBehalfName: licenceApplicantContact.name,
    onBehalfOrg: licenceApplicantContact.organisation,
    onBehalfEmail: licenceApplicantContact.emailAddress,
    magicLink,
  };
};

/**
 * This function calls the Notify API and asks for an email to be sent to the licence holder
 * and the licence applicant to confirm the application.
 *
 * @param {any} emailDetails The details to use in the email to be sent.
 * @param {any} emailAddress The email address to send the email to.
 */
const sendLicenceHolderMagicLinkEmail = async (emailDetails: any, emailAddress: any) => {
  if (config.notifyApiKey) {
    const notifyClient = new NotifyClient(config.notifyApiKey);
    notifyClient.sendEmail('e2d7bea5-c487-448c-afa4-1360fe966eab', emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: '4b49467e-2a35-4713-9d92-809c55bf1cdd',
    });
  }
};

/**
 * This function calls the Notify API and asks for an email to be send with the supplied details.
 *
 * @param {any} emailDetails The details to use in the email to be sent.
 * @param {any} emailAddress The email address to send the email to.
 */
const sendHolderApplicantConfirmEmail = async (emailDetails: any, emailAddress: any) => {
  if (config.notifyApiKey) {
    const notifyClient = new NotifyClient(config.notifyApiKey);
    notifyClient.sendEmail('b227af1f-4709-4be5-a111-66605dcf0525', emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: '4b49467e-2a35-4713-9d92-809c55bf1cdd',
    });
  }
};

const ApplicationController = {
  findOne: async (id: number) => {
    return Application.findByPk(id, {
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
          model: Species,
          as: 'Species',
          include: [
            {
              model: Activity,
              as: 'HerringGull',
            },
            {
              model: Activity,
              as: 'BlackHeadedGull',
            },
            {
              model: Activity,
              as: 'CommonGull',
            },
            {
              model: Activity,
              as: 'GreatBlackBackedGull',
            },
            {
              model: Activity,
              as: 'LesserBlackBackedGull',
            },
          ],
        },
        {
          model: Issue,
          as: 'ApplicationIssue',
        },
        {
          model: Measure,
          as: 'ApplicationMeasure',
        },
        {
          model: Assessment,
          as: 'ApplicationAssessment',
        },
      ],
    });
  },

  findAll: async () => {
    return Application.findAll();
  },

  /**
   * This function returns all applications, including the licence holder and applicant details,
   * and the site address details.
   *
   * @returns {any} Returns an array of applications with the contact and site address details included.
   */
  findAllSummary: async () => {
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
          as: 'SiteAddress',
        },
      ],
    });
  },

  /**
   * The create function writes the incoming application to the appropriate database tables.
   *
   * @param {any | undefined} onBehalfContact The on behalf contact details.
   * @param {any | undefined} licenceHolderContact The license holder contact details.
   * @param {any | undefined} address The license holder's address.
   * @param {any | undefined} siteAddress The site's address.
   * @param {any | undefined} issue The issue details.
   * @param {any | undefined} herringActivity The herring gull activities to be licensed.
   * @param {any | undefined} blackHeadedActivity The black-headed gull activities to be licensed.
   * @param {any | undefined} commonActivity The common gull activities to be licensed.
   * @param {any | undefined} greatBlackBackedActivity The great black-backed gull activities to be licensed.
   * @param {any | undefined} lesserBlackBackedActivity The lesser black-backed gull activities to be licensed.
   * @param {any | undefined} measure The measures taken / not taken details.
   * @param {any | undefined} incomingApplication The application details.
   * @param {string} confirmBaseUrl The micro-frontend we want to send the lh to to confirm their licence.
   * @returns {ApplicationInterface} Returns newApplication, the newly created application.
   */
  create: async (
    onBehalfContact: any | undefined,
    licenceHolderContact: any,
    address: any,
    siteAddress: any | undefined,
    issue: any,
    herringActivity: any | undefined,
    blackHeadedActivity: any | undefined,
    commonActivity: any | undefined,
    greatBlackBackedActivity: any | undefined,
    lesserBlackBackedActivity: any | undefined,
    measure: any,
    incomingApplication: any,
    confirmBaseUrl: string,
  ) => {
    const speciesIds: SpeciesIds = {
      HerringGullId: undefined,
      BlackHeadedGullId: undefined,
      CommonGullId: undefined,
      GreatBlackBackedGullId: undefined,
      LesserBlackBackedGullId: undefined,
    };
    let newApplication;
    // Start a transaction.
    await database.sequelize.transaction(async (t: transaction) => {
      let newOnBehalfContact;
      let newSiteAddress;
      // Add the licence holder details to DB, and optional on-behalf contact details.
      const newLicenceHolderContact = await Contact.create(licenceHolderContact, {transaction: t});
      if (onBehalfContact) {
        newOnBehalfContact = await Contact.create(onBehalfContact, {transaction: t});
      }

      // Add licence holder address to DB and Site address. Check if the addresses are the same.
      const newAddress = await Address.create(address, {transaction: t});
      if (siteAddress) {
        newSiteAddress = await Address.create(siteAddress, {transaction: t});
      } else {
        siteAddress = address;
      }

      // Add any species specific activities to the DB and get their IDs.
      if (herringActivity) {
        const herringGull = await Activity.create(herringActivity, {transaction: t});
        speciesIds.HerringGullId = herringGull.id;
      }

      if (blackHeadedActivity) {
        const blackHeadedGull = await Activity.create(blackHeadedActivity, {transaction: t});
        speciesIds.BlackHeadedGullId = blackHeadedGull.id;
      }

      if (commonActivity) {
        const commonGull = await Activity.create(commonActivity, {transaction: t});
        speciesIds.CommonGullId = commonGull.id;
      }

      if (greatBlackBackedActivity) {
        const greatBlackBackedGull = await Activity.create(greatBlackBackedActivity, {transaction: t});
        speciesIds.GreatBlackBackedGullId = greatBlackBackedGull.id;
      }

      if (lesserBlackBackedActivity) {
        const lesserBlackBackedGull = await Activity.create(lesserBlackBackedActivity, {transaction: t});
        speciesIds.LesserBlackBackedGullId = lesserBlackBackedGull.id;
      }

      // Set the species foreign keys in the DB.
      const newSpecies = await Species.create(speciesIds, {transaction: t});

      // Set the application's foreign keys.
      incomingApplication.LicenceHolderId = newLicenceHolderContact.id;
      incomingApplication.LicenceApplicantId = newOnBehalfContact ? newOnBehalfContact.id : newLicenceHolderContact.id;
      incomingApplication.LicenceHolderAddressId = newAddress.id;
      incomingApplication.SiteAddressId = newSiteAddress ? newSiteAddress.id : newAddress.id;
      incomingApplication.SpeciesId = newSpecies.id;

      let newId; // The prospective random ID of the new application.
      let existingApplication; // Possible already assigned application.
      let remainingAttempts = 10; // Allow 10 attempts to check if the ID is in use.
      let foundExistingId = true; // Assume true until checked.

      // Generate a random 6 digit ID and check if it's already in use.
      // No await in loop disabled because we need to wait for the result.
      /* eslint-disable no-await-in-loop */
      while (foundExistingId && remainingAttempts > 0) {
        newId = Math.floor(Math.random() * 999_999);
        existingApplication = await Application.findByPk(newId);
        if (!existingApplication) {
          foundExistingId = false;
        }

        remainingAttempts--;
      }
      /* eslint-enable no-await-in-loop */

      incomingApplication.id = newId;

      // Add the application to the DB.
      newApplication = await Application.create(incomingApplication, {transaction: t});

      // Add any measures taken / tried / etc to the DB.
      measure.ApplicationId = newApplication.id;
      await Measure.create(measure, {transaction: t});

      // Add any issues declared to the DB.
      issue.ApplicationId = newApplication.id;
      await Issue.create(issue, {transaction: t});
    });

    // If the licence applicant applied on the license holder behalf so send them a confirmation email
    // and send the email to the license holder containing the magic link.
    if (newApplication && onBehalfContact) {
      // Set the details of the emails.
      const emailDetails = setLicenceApplicantNotificationDetails(onBehalfContact, licenceHolderContact);
      const magicLinkEmailDetails = await setLicenceHolderMagicLinkDetails(
        confirmBaseUrl,
        (newApplication as any).id,
        licenceHolderContact,
        onBehalfContact,
      );
      try {
        // Send the email using the Notify service's API.
        await sendLicenceApplicantNotificationEmail(emailDetails, onBehalfContact.emailAddress);
        await sendLicenceHolderMagicLinkEmail(magicLinkEmailDetails, licenceHolderContact.emailAddress);
      } catch (error: unknown) {
        return error;
      }
    } else {
      // Else if the licence holder applied directly send them a confirmation email.
      // Set the details of the email.
      const emailDetails = setLicenceHolderDirectEmailDetails(newApplication, licenceHolderContact, siteAddress);
      try {
        // Send the email using the Notify service's API.
        await sendLicenceHolderDirectEmail(emailDetails, licenceHolderContact.emailAddress);
      } catch (error: unknown) {
        return error;
      }
    }

    // If all went well and we have a new application return it.
    if (newApplication) {
      return newApplication as ApplicationInterface;
    }

    // If no new application was added to the DB return undefined.
    return undefined;
  },

  confirm: async (id: number, confirmApplication: ApplicationInterface) => {
    let confirmedApplication;
    // Start the transaction.
    await database.sequelize.transaction(async (t: transaction) => {
      // Save the new values to the database.
      confirmedApplication = await Application.update(confirmApplication, {where: {id}, transaction: t});
    });

    // If we have a confirmed application get some of its details to use in the confirmation emails.
    if (confirmedApplication) {
      const updatedApplication: any = await Application.findByPk(id, {
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
            as: 'SiteAddress',
          },
        ],
      });

      // The details required to generate the confirmation emails.
      let emailDetails;

      // Set the details required to generate the confirmation emails.
      if (updatedApplication) {
        emailDetails = setHolderApplicantConfirmEmailDetails(
          updatedApplication.id,
          updatedApplication.createdAt,
          updatedApplication.LicenceHolder,
          updatedApplication.LicenceApplicant,
          updatedApplication.SiteAddress,
        );
      }

      try {
        // Send the email using the Notify service's API.
        await sendHolderApplicantConfirmEmail(emailDetails, updatedApplication.LicenceHolder.emailAddress);
        await sendHolderApplicantConfirmEmail(emailDetails, updatedApplication.LicenceApplicant.emailAddress);
      } catch (error: unknown) {
        return error;
      }
    }

    // If all went well and we have confirmed a application return it.
    if (confirmedApplication) {
      return confirmedApplication as ApplicationInterface;
    }

    // If no application was confirmed return undefined.
    return undefined;
  },
};

export {ApplicationController as default};
export {ApplicationInterface};
