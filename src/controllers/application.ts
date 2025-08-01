import * as jwt from 'jsonwebtoken';
import {type Request} from '@hapi/hapi';
import transaction from 'sequelize/types/transaction';
import {Op, Sequelize, fn, col} from 'sequelize';
import database from '../models/index.js';
import config from '../config/app';
import jwk from '../config/jwk.js';
import MultiUseFunctions from '../multi-use-functions';

const {
  Application,
  Contact,
  Address,
  Activity,
  PActivity,
  Issue,
  Measure,
  Species,
  PSpecies,
  Assessment,
  AssessmentMeasure,
  License,
  LicenseAdvisory,
  Advisory,
  LicenseCondition,
  Condition,
  Note,
  Revocation,
  Withdrawal,
  Returns,
  Amendment,
  SiteCategories,
  UploadedImage,
} = database;

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
  PSpeciesId: number;
  siteType: string;
  siteCategory: string;
  previousLicence: boolean;
  previousLicenceNumber: string;
  supportingInformation: string;
  confirmedByLicenseHolder: boolean;
  confirmedAt?: Date;
  staffNumber: string;
  fourteenDayReminder: boolean;
}

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
    applicationDate: MultiUseFunctions.createDisplayDate(new Date(newApplication.createdAt)),
    siteAddress: MultiUseFunctions.createSummaryAddress(siteAddress),
    id: newApplication.id,
  };
};

/**
 * This function returns an object containing the details required for the magic link return email.
 *
 * @param {number} id The confirmed application's reference number.
 * @param {any} contact The licence holder's or licence applicants contact details.
 * @param {string} magicLinkUrl The magic link url minus the token.
 * @returns {any} An object with the required details set.
 */
const setReturnLoginMagicLinkEmailDetails = async (id: number, contact: any, magicLinkUrl: string) => {
  // Get the private key.
  const privateKey = await jwk.getPrivateKey({type: 'pem'});

  // Create JWT.
  const token = jwt.sign({}, privateKey as string, {
    algorithm: 'ES256',
    expiresIn: '2h',
    noTimestamp: true,
    subject: `${id}`,
  });

  // Append JWT to magic link url.
  const magicLink = `${magicLinkUrl}${token}`;

  return {
    id,
    personName: contact.name,
    magicLink,
  };
};

/**
 * This function calls the Notify API and asks for an email to be sent with the supplied details.
 *
 * @param {any} emailDetails The details to use in the email to be sent.
 * @param {any} emailAddress The email address to send the email to.
 */
const sendReturnLoginMagicLinkEmail = async (emailDetails: any, emailAddress: any) => {
  if (config.notifyApiKey) {
    const notifyClient = new NotifyClient(config.notifyApiKey);
    await notifyClient.sendEmail('5e00dcb7-52ac-4197-a1ca-ed7f4d3508ee', emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: '4b49467e-2a35-4713-9d92-809c55bf1cdd',
    });
  }
};

/**
 * This function calls the Notify API and asks for an email to be sent with the supplied details.
 *
 * @param {any} emailDetails Email details.
 * @param {any} emailAddress Email address.
 */
const sendWithdrawalEmail = async (emailDetails: any, emailAddress: any) => {
  if (config.notifyApiKey) {
    const notifyClient = new NotifyClient(config.notifyApiKey);
    await notifyClient.sendEmail('9866806b-ccd6-4b72-8e34-776076900546', emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: '4b49467e-2a35-4713-9d92-809c55bf1cdd',
    });
  }
};

const setWithdrawalEmailDetails = (
  id: number,
  licenceHolderContact: any,
  onBehalfContact: any,
  siteAddress: any,
  withdrawalReason: string,
) => {
  return {
    lhName: licenceHolderContact.name,
    onBehalfName: onBehalfContact.name,
    siteAddress: MultiUseFunctions.createSummaryAddress(siteAddress),
    withdrawalReason,
    id,
  };
};

/**
 * This function calls the Notify API and asks for a refusal email to be sent.
 *
 * @param {any} emailDetails The details to use in the email to be sent.
 * @param {any} emailAddress The email address to send the email to.
 */
const sendRefusalEmail = async (emailDetails: any, emailAddress: any) => {
  if (config.notifyApiKey) {
    const notifyClient = new NotifyClient(config.notifyApiKey);
    await notifyClient.sendEmail('5e1470bb-6953-4320-b405-4031c8d1d51b', emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: '4b49467e-2a35-4713-9d92-809c55bf1cdd',
    });
  }
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
    applicationDate: MultiUseFunctions.createDisplayDate(new Date(createdAt)),
    siteAddress: MultiUseFunctions.createSummaryAddress(siteAddress),
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
    await notifyClient.sendEmail('5892536f-15cb-4787-82dc-d9b83ccc00ba', emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: '4b49467e-2a35-4713-9d92-809c55bf1cdd',
    });
  }
};

/**
 * This function returns an object containing the details required for the license applicant notification email.
 *
 * @param {any} applicationId The ID of the new application.
 * @param {any} licenceApplicantContact The licence applicant's contact details.
 * @param {any} licenceHolderContact The licence holder's contact details.
 * @returns {any} An object with the required details set.
 */
const setLicenceApplicantNotificationDetails = (
  applicationId: any,
  licenceApplicantContact: any,
  licenceHolderContact: any,
) => {
  return {
    laName: licenceApplicantContact.name,
    lhName: licenceHolderContact.name,
    lhOrg: licenceHolderContact.organisation ? licenceHolderContact.organisation : 'No organisation entered',
    lhEmail: licenceHolderContact.emailAddress,
    id: applicationId,
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
    await notifyClient.sendEmail('6955dccf-c7ad-460f-8d5d-82ad984d018a', emailAddress, {
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
    expiresIn: '21 days',
    noTimestamp: true,
    subject: `${applicationId}`,
  });

  // Append JWT to confirm url.
  const magicLink = `${confirmBaseUrl}${token}`;

  return {
    id: applicationId,
    lhName: licenceHolderContact.name,
    onBehalfName: licenceApplicantContact.name,
    onBehalfOrg: licenceApplicantContact.organisation
      ? licenceApplicantContact.organisation
      : 'No organisation entered',
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
    await notifyClient.sendEmail('e2d7bea5-c487-448c-afa4-1360fe966eab', emailAddress, {
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
    await notifyClient.sendEmail('b227af1f-4709-4be5-a111-66605dcf0525', emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: '4b49467e-2a35-4713-9d92-809c55bf1cdd',
    });
  }
};

/**
 * This function creates a personalisation object to be used by the notify API to create
 * the refusal email.
 *
 * @param {any} application The licence application details.
 * @returns {any} Returns a personalisation shaped object for notify.
 */
const setRefusalEmailDetails = async (application: any): Promise<any> => {
  const measuresToContinue = MultiUseFunctions.createAdditionalMeasures(application?.AssessmentMeasure, 'Continue');
  const additionalMeasuresIntended = MultiUseFunctions.createAdditionalMeasures(
    application?.AssessmentMeasure,
    'Intend',
  );
  return {
    licenceNumber: application.id,
    siteAddressLine1: application.SiteAddress.addressLine1,
    siteAddressLine2: application.SiteAddress.addressLine2 ? application.SiteAddress.addressLine2 : 'No address line 2',
    siteAddressTown: application.SiteAddress.addressTown,
    sitePostcode: application.SiteAddress.postcode,
    addressLine1: application.LicenceHolderAddress.addressLine1,
    addressLine2: application.LicenceHolderAddress.addressLine2
      ? application.LicenceHolderAddress.addressLine2
      : 'No address line 2',
    addressTown: application.LicenceHolderAddress.addressTown,
    postcode: application.LicenceHolderAddress.postcode,
    identifiedSpecies: MultiUseFunctions.createIdentifiedSpecies(application.Species),
    issuesList: MultiUseFunctions.createIssues(application.ApplicationIssue),
    measuresTried: MultiUseFunctions.createMeasures(application.ApplicationMeasure, 'Tried'),
    measuresIntended: MultiUseFunctions.createMeasures(application.ApplicationMeasure, 'Intend'),
    measuresNotTried: MultiUseFunctions.createMeasures(application.ApplicationMeasure, 'No'),
    measuresToContinue,
    additionalMeasuresIntended,
    decisionDetails: application.ApplicationAssessment.refusalReason,
    decisionTest1Pass: application.ApplicationAssessment.testOneDecision === true,
    decisionTest1Fail: application.ApplicationAssessment.testOneDecision === false,
    decisionTest2Pass: application.ApplicationAssessment.testTwoDecision === true,
    decisionTest2Fail: application.ApplicationAssessment.testTwoDecision === false,
    displayContinue: measuresToContinue !== '',
    displayAdditionalIntended: additionalMeasuresIntended !== '',
    appliedForSpecies: MultiUseFunctions.createAppliedFor(application.Species),
    proposalResult: MultiUseFunctions.createProposalResult(application.PSpecies),
    test1Details: application.ApplicationAssessment.testOneAssessment,
    test2Details: application.ApplicationAssessment.testTwoAssessment,
    test3Details: application.ApplicationAssessment.testThreeAssessment
      ? application.ApplicationAssessment.testThreeAssessment
      : '',
  };
};

const ApplicationController = {
  findOne: async (id: number) => {
    const application = await Application.findByPk(id, {paranoid: false});

    if (!application) return null;

    const [
      revocation,
      withdrawal,
      licenceHolder,
      licenceApplicant,
      licenceHolderAddress,
      siteAddress,
      species,
      permittedSpecies,
      issues,
      measures,
      assessments,
      assessmentMeasures,
      notes,
      license,
      siteCategories,
      uploadedImages,
    ] = await Promise.all([
      Revocation.findOne({where: {ApplicationId: id}, paranoid: false}),
      Withdrawal.findOne({where: {ApplicationId: id}, paranoid: false}),
      Contact.findByPk(application.LicenceHolderId, {paranoid: false}),
      Contact.findByPk(application.LicenceApplicantId, {paranoid: false}),
      Address.findByPk(application.LicenceHolderAddressId, {paranoid: false}),
      Address.findByPk(application.SiteAddressId, {paranoid: false}),
      Species.findByPk(application.SpeciesId, {
        paranoid: false,
        include: [
          {model: Activity, as: 'HerringGull', paranoid: false},
          {model: Activity, as: 'BlackHeadedGull', paranoid: false},
          {model: Activity, as: 'CommonGull', paranoid: false},
          {model: Activity, as: 'GreatBlackBackedGull', paranoid: false},
          {model: Activity, as: 'LesserBlackBackedGull', paranoid: false},
        ],
      }),
      PSpecies.findByPk(application.PermittedSpeciesId, {
        paranoid: false,
        include: [
          {model: PActivity, as: 'PHerringGull', paranoid: false},
          {model: PActivity, as: 'PBlackHeadedGull', paranoid: false},
          {model: PActivity, as: 'PCommonGull', paranoid: false},
          {model: PActivity, as: 'PGreatBlackBackedGull', paranoid: false},
          {model: PActivity, as: 'PLesserBlackBackedGull', paranoid: false},
        ],
      }),
      Issue.findOne({where: {ApplicationId: id}, paranoid: false}),
      Measure.findOne({where: {ApplicationId: id}, paranoid: false}),
      Assessment.findOne({where: {ApplicationId: id}, paranoid: false}),
      AssessmentMeasure.findOne({where: {ApplicationId: id}, paranoid: false}),
      Note.findAll({where: {ApplicationId: id}, paranoid: false}),
      License.findOne({
        where: {ApplicationId: id},
        paranoid: false,
        include: [
          {
            model: LicenseAdvisory,
            as: 'LicenseAdvisories',
            include: [{model: Advisory, as: 'Advisory', paranoid: false}],
            paranoid: false,
          },
          {
            model: LicenseCondition,
            as: 'LicenseConditions',
            include: [{model: Condition, as: 'Condition', paranoid: false}],
            paranoid: false,
          },
          {model: Returns, as: 'Returns', paranoid: false},
          {model: Amendment, as: 'Amendment', paranoid: false},
        ],
      }),
      SiteCategories.findByPk(application.SiteCategoriesId, {paranoid: false}),
      UploadedImage.findAll({where: {ApplicationId: id}, paranoid: false}),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
      ...application.toJSON(),
      Revocation: revocation ?? null,
      Withdrawal: withdrawal ?? null,
      LicenceHolder: licenceHolder ?? null,
      LicenceApplicant: licenceApplicant ?? null,
      LicenceHolderAddress: licenceHolderAddress ?? null,
      SiteAddress: siteAddress ?? null,
      Species: species ?? null,
      PSpecies: permittedSpecies ?? null,
      ApplicationIssue: issues,
      ApplicationMeasure: measures,
      ApplicationAssessment: assessments,
      AssessmentMeasure: assessmentMeasures,
      ApplicationNotes: notes,
      License: license ?? null,
      SiteCategories: siteCategories ?? null,
      UploadedImages: uploadedImages,
    };
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
      paranoid: false,
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
        {
          model: License,
          as: 'License',
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
          model: Assessment,
          as: 'ApplicationAssessment',
        },
      ],
    });
  },

  /**
   * Pagination endpoint for gulls register.
   *
   * @param request
   * @param itemsPerPage
   */
  findAllPaginatedSummary: async (request: Request, itemsPerPage: number) => {
    // Checks if using a local database. This allows for case insensitive searching.
    const limit = itemsPerPage;

    // Prevent XSS
    const queryParameters = new URLSearchParams(request.query);

    const searchTerm: string = queryParameters.get('search') ?? '';
    const status: string = queryParameters.get('status') ?? '';
    const licenceOfficerId: string = queryParameters.get('licenceOfficerId') ?? '';
    const queryPageNumber: string = queryParameters.get('page') ?? '1';

    const page: number = Number.parseInt(queryPageNumber, 10);

    const offset = (page - 1) * limit;

    const literalQuery = {
      id: Sequelize.literal(`CAST("Application"."id" AS VARCHAR) LIKE '%${searchTerm}%'`),
    };
    const idSearch = Number.isNaN(Number.parseInt(searchTerm, 10)) ? {} : literalQuery;

    const searchObject = {
      [Op.or]: [
        {
          '$LicenceHolder.name$': {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          '$LicenceApplicant.name$': {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          '$SiteAddress.postcode$': {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          $staffNumber$: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        idSearch,
      ],
    };

    let statusObject;
    let paranoid = false;

    switch (status) {
      case 'unassigned':
        paranoid = true;
        statusObject = {
          $confirmedByLicenseHolder$: true,
          $staffNumber$: {[Op.is]: null},
          '$License.ApplicationId$': {[Op.is]: null},
          '$ApplicationAssessment.decision$': {[Op.not]: false},
        };

        break;
      case 'inProgress':
        paranoid = true;
        statusObject = {
          $confirmedByLicenseHolder$: true,
          $staffNumber$: {[Op.not]: null},
          '$License.ApplicationId$': {[Op.is]: null},
          '$ApplicationAssessment.decision$': {[Op.not]: false},
        };
        break;
      case 'awaitingApproval':
        paranoid = true;
        statusObject = {$confirmedByLicenseHolder$: false};
        break;
      case 'myApplications':
        paranoid = true;
        statusObject = {
          $confirmedByLicenseHolder$: true,
          $staffNumber$: {
            [Op.iLike]: licenceOfficerId,
          },
          '$License.ApplicationId$': {[Op.is]: null},
          '$ApplicationAssessment.decision$': {[Op.not]: false},
        };
        break;

      default:
        statusObject = {};
    }

    return Application.findAndCountAll({
      paranoid,
      ...(status === 'unassigned' && {
        attributes: {
          include: [[fn('COALESCE', col('Application.confirmedAt'), col('Application.createdAt')), 'sortByDate']],
        },
      }),
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
        {
          model: License,
          as: 'License',
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
          model: Assessment,
          as: 'ApplicationAssessment',
        },
        {
          model: SiteCategories,
          as: 'SiteCategories',
        },
      ],
      where: {
        ...(Boolean(searchTerm) && searchObject),
        ...(Boolean(status) && statusObject),
      },
      limit,
      order: status === 'unassigned' ? [[col('sortByDate'), 'ASC']] : [['createdAt', 'DESC']],
      // Only add offset if available
      ...(offset && {offset}),
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
   * @param {any | undefined} pHerringActivity The herring gull activities to be licensed.
   * @param {any | undefined} pBlackHeadedActivity The black-headed gull activities to be licensed.
   * @param {any | undefined} pCommonActivity The common gull activities to be licensed.
   * @param {any | undefined} pGreatBlackBackedActivity The great black-backed gull activities to be licensed.
   * @param {any | undefined} pLesserBlackBackedActivity The lesser black-backed gull activities to be licensed.
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
    pHerringActivity: any | undefined,
    pBlackHeadedActivity: any | undefined,
    pCommonActivity: any | undefined,
    pGreatBlackBackedActivity: any | undefined,
    pLesserBlackBackedActivity: any | undefined,
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
    const pSpeciesIds: SpeciesIds = {
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
        const pHerringGull = await PActivity.create(pHerringActivity, {transaction: t});
        speciesIds.HerringGullId = herringGull.id;
        pSpeciesIds.HerringGullId = pHerringGull.id;
      }

      if (blackHeadedActivity) {
        const blackHeadedGull = await Activity.create(blackHeadedActivity, {transaction: t});
        const pBlackHeadedGull = await PActivity.create(pBlackHeadedActivity, {transaction: t});
        speciesIds.BlackHeadedGullId = blackHeadedGull.id;
        pSpeciesIds.BlackHeadedGullId = pBlackHeadedGull.id;
      }

      if (commonActivity) {
        const commonGull = await Activity.create(commonActivity, {transaction: t});
        const pCommonGull = await PActivity.create(pCommonActivity, {transaction: t});
        speciesIds.CommonGullId = commonGull.id;
        pSpeciesIds.CommonGullId = pCommonGull.id;
      }

      if (greatBlackBackedActivity) {
        const greatBlackBackedGull = await Activity.create(greatBlackBackedActivity, {transaction: t});
        const pGreatBlackBackedGull = await PActivity.create(pGreatBlackBackedActivity, {
          transaction: t,
        });
        speciesIds.GreatBlackBackedGullId = greatBlackBackedGull.id;
        pSpeciesIds.GreatBlackBackedGullId = pGreatBlackBackedGull.id;
      }

      if (lesserBlackBackedActivity) {
        const lesserBlackBackedGull = await Activity.create(lesserBlackBackedActivity, {transaction: t});
        const pLesserBlackBackedGull = await PActivity.create(pLesserBlackBackedActivity, {
          transaction: t,
        });
        speciesIds.LesserBlackBackedGullId = lesserBlackBackedGull.id;
        pSpeciesIds.LesserBlackBackedGullId = pLesserBlackBackedGull.id;
      }

      // Set the species foreign keys in the DB.
      const newSpecies = await Species.create(speciesIds as any, {transaction: t});
      const newPSpecies = await PSpecies.create(pSpeciesIds as any, {transaction: t});

      // Set the site categories foreign key in DB.
      const siteCategoryId: any = await SiteCategories.findOne({
        where: {
          [Op.and]: [{siteCategory: incomingApplication.siteCategory}, {siteType: incomingApplication.siteType}],
        },
        paranoid: false,
      });

      // Set the application's foreign keys.
      incomingApplication.LicenceHolderId = newLicenceHolderContact.id;
      incomingApplication.LicenceApplicantId = newOnBehalfContact ? newOnBehalfContact.id : newLicenceHolderContact.id;
      incomingApplication.LicenceHolderAddressId = newAddress.id;
      incomingApplication.SiteAddressId = newSiteAddress ? newSiteAddress.id : newAddress.id;
      incomingApplication.SpeciesId = newSpecies.id;
      incomingApplication.PermittedSpeciesId = newPSpecies.id;
      incomingApplication.SiteCategoriesId = siteCategoryId.id;

      let newId; // The prospective random ID of the new application.
      let existingApplication; // Possible already assigned application.
      let remainingAttempts = 10; // Allow 10 attempts to check if the ID is in use.
      let foundExistingId = true; // Assume true until checked.

      // Generate a random 6 digit ID between 1000 and 999_999 and checks if it's already in use.
      // No await in loop disabled because we need to wait for the result.
      /* eslint-disable no-await-in-loop */
      while (foundExistingId && remainingAttempts > 0) {
        newId = Math.floor(Math.random() * (999_999 - 1000) + 1000);
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
      const emailDetails = setLicenceApplicantNotificationDetails(
        (newApplication as any).id,
        onBehalfContact,
        licenceHolderContact,
      );
      const magicLinkEmailDetails = await setLicenceHolderMagicLinkDetails(
        confirmBaseUrl,
        (newApplication as any).id,
        licenceHolderContact,
        onBehalfContact,
      );

      // Send the email using the Notify service's API.
      await sendLicenceApplicantNotificationEmail(emailDetails, onBehalfContact.emailAddress);
      await sendLicenceHolderMagicLinkEmail(magicLinkEmailDetails, licenceHolderContact.emailAddress);
      await sendLicenceHolderMagicLinkEmail(magicLinkEmailDetails, 'issuedlicence@nature.scot');
    } else {
      // Else if the licence holder applied directly send them a confirmation email.
      // Set the details of the email.
      const emailDetails = setLicenceHolderDirectEmailDetails(newApplication, licenceHolderContact, siteAddress);

      // Send the email using the Notify service's API.
      await sendLicenceHolderDirectEmail(emailDetails, licenceHolderContact.emailAddress);
    }

    // If all went well and we have a new application return it.
    if (newApplication) {
      return newApplication as ApplicationInterface;
    }

    // If no new application was added to the DB return undefined.
    return undefined;
  },

  /**
   * Adds a new species to an already created activity.
   *
   * @param {any} activity Creates a new activity.
   * @param {string} speciesType The specific species that is selected in the form.
   * @param {any} id The ID of the application.
   * @returns {boolean} True if the record is updated, otherwise false.
   */
  addNewSpecies: async (activity: any, speciesType: string, id: any) => {
    const newActivityAndUpdatedSpecies = await database.sequelize.transaction(async (t: transaction) => {
      const newActivity = await PActivity.create(activity, {transaction: t});

      let item;
      switch (speciesType) {
        case 'herringGull':
          // Save the new object activity id to the relevant species type property where id equal to permitted species id.
          item = await PSpecies.update({HerringGullId: newActivity.id}, {where: {id}, returning: true, transaction: t});
          break;
        case 'blackHeadedGull':
          item = await PSpecies.update(
            {BlackHeadedGullId: newActivity.id},
            {where: {id}, returning: true, transaction: t},
          );
          break;
        case 'commonGull':
          item = await PSpecies.update({CommonGullId: newActivity.id}, {where: {id}, returning: true, transaction: t});
          break;
        case 'greatBlackBackedGull':
          item = await PSpecies.update(
            {GreatBlackBackedGullId: newActivity.id},
            {where: {id}, returning: true, transaction: t},
          );
          break;
        case 'lesserBlackBackedGull':
          item = await PSpecies.update(
            {LesserBlackBackedGullId: newActivity.id},
            {where: {id}, returning: true, transaction: t},
          );
          break;
        default:
          item = undefined;
          break;
      }

      return item;
    });
    // If a record was updated return true.
    if (newActivityAndUpdatedSpecies) {
      return true;
    }

    // Something went wrong so return false.
    return false;
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

      // Send the email using the Notify service's API.
      await sendHolderApplicantConfirmEmail(emailDetails, updatedApplication.LicenceHolder.emailAddress);
      await sendHolderApplicantConfirmEmail(emailDetails, updatedApplication.LicenceApplicant.emailAddress);
    }

    // If all went well and we have confirmed a application return it.
    if (confirmedApplication) {
      return confirmedApplication as ApplicationInterface;
    }

    // If no application was confirmed return undefined.
    return undefined;
  },

  login: async (authentication: any, application: any, magicLinkBaseUrl: any) => {
    // The details required to generate the confirmation emails.
    let emailDetails;

    // Is the license holder or the applicant submitting the return? if it is the licence holder we need to send them a
    // magic link email so they can submit their return. but if it's the applicant then we need to send the applicant the
    // magic link email.
    if (application && authentication.licenceHolder) {
      emailDetails = await setReturnLoginMagicLinkEmailDetails(
        authentication.licenceNumber,
        application.LicenceHolder,
        magicLinkBaseUrl,
      );

      await sendReturnLoginMagicLinkEmail(emailDetails, application.LicenceHolder.emailAddress);
    }

    if (application && !authentication.licenceHolder) {
      emailDetails = await setReturnLoginMagicLinkEmailDetails(
        authentication.licenceNumber,
        application.LicenceApplicant,
        magicLinkBaseUrl,
      );

      await sendReturnLoginMagicLinkEmail(emailDetails, application.LicenceApplicant.emailAddress);
    }
  },

  remind: async (id: number, remindApplication: ApplicationInterface) => {
    let remindedApplication;
    // Start the transaction.
    await database.sequelize.transaction(async (t: transaction) => {
      // Save the new values to the database.
      remindedApplication = await Application.update(remindApplication, {where: {id}, transaction: t});
    });

    // If all went well and we have flagged an application as reminded then return the application.
    if (remindedApplication) {
      return remindedApplication as ApplicationInterface;
    }

    // If no application was reminded return undefined.
    return undefined;
  },

  assign: async (id: number, assignTo: any) => {
    let assign;
    // Start the transaction.
    await database.sequelize.transaction(async (t: transaction) => {
      // Save the new values to the database.
      assign = await Application.update(assignTo, {where: {id}, transaction: t});
    });

    // If all went well and we have confirmed a application return it.
    if (assign) {
      return assign as ApplicationInterface;
    }

    // If no application was confirmed return undefined.
    return undefined;
  },

  /**
   * Soft delete a application in the database (Revoke).
   *
   * @param {number} id A possible ID of a application.
   * @param {object} cleanObject A new revocation object to be added to the database.
   * @returns {boolean} True if the record is deleted, otherwise false.
   */
  delete: async (id: number, cleanObject: any) => {
    try {
      // Start the transaction.
      await database.sequelize.transaction(async (t: transaction) => {
        // Check the application/license exists.
        const application = await Application.findByPk(id, {transaction: t, rejectOnEmpty: true});
        // Find the species record.
        const species = await Species.findByPk(application.SpeciesId, {transaction: t, rejectOnEmpty: true});
        // Find the activities records.
        const herringGullActivity = await Activity.findByPk(species.HerringGullId, {transaction: t});
        if (herringGullActivity) {
          // Soft Delete any Activity attached to the application/license.
          await Activity.destroy({where: {id: herringGullActivity.id}, transaction: t});
        }

        const blackHeadedGullActivity = await Activity.findByPk(species.BlackHeadedGullId, {transaction: t});
        if (blackHeadedGullActivity) {
          // Soft Delete any Activity attached to the application/license.
          await Activity.destroy({where: {id: blackHeadedGullActivity.id}, transaction: t});
        }

        const commonGullActivity = await Activity.findByPk(species.CommonGullId, {transaction: t});
        if (commonGullActivity) {
          // Soft Delete any Activity attached to the application/license.
          await Activity.destroy({where: {id: commonGullActivity.id}, transaction: t});
        }

        const greatBlackBackedGullActivity = await Activity.findByPk(species.GreatBlackBackedGullId, {transaction: t});
        if (greatBlackBackedGullActivity) {
          // Soft Delete any Activity attached to the application/license.
          await Activity.destroy({where: {id: greatBlackBackedGullActivity.id}, transaction: t});
        }

        const lesserBlackBackedGullActivity = await Activity.findByPk(species.LesserBlackBackedGullId, {
          transaction: t,
        });
        if (lesserBlackBackedGullActivity) {
          // Soft Delete any Activity attached to the application/license.
          await Activity.destroy({where: {id: lesserBlackBackedGullActivity.id}, transaction: t});
        }

        // Soft Delete any species record attached to the application/license.
        await Species.destroy({where: {id: species.id}, transaction: t});

        // Find the permitted species record.
        const pSpecies = await PSpecies.findByPk(application.PermittedSpeciesId, {
          transaction: t,
          rejectOnEmpty: true,
        });

        // Find the permitted activities records.
        const pHerringGullActivity = await PActivity.findByPk(pSpecies.HerringGullId, {
          transaction: t,
        });
        if (pHerringGullActivity) {
          // Soft Delete any PermittedActivity attached to the application/license.
          await PActivity.destroy({where: {id: pHerringGullActivity.id}, transaction: t});
        }

        const pBlackHeadedGullActivity = await PActivity.findByPk(pSpecies.BlackHeadedGullId, {
          transaction: t,
        });
        if (pBlackHeadedGullActivity) {
          // Soft Delete any PermittedActivity attached to the application/license.
          await PActivity.destroy({where: {id: pBlackHeadedGullActivity.id}, transaction: t});
        }

        const pCommonGullActivity = await PActivity.findByPk(pSpecies.CommonGullId, {
          transaction: t,
        });
        if (pCommonGullActivity) {
          // Soft Delete any PermittedActivity attached to the application/license.
          await PActivity.destroy({where: {id: pCommonGullActivity.id}, transaction: t});
        }

        const pGreatBlackBackedGullActivity = await PActivity.findByPk(pSpecies.GreatBlackBackedGullId, {
          transaction: t,
        });
        if (pGreatBlackBackedGullActivity) {
          // Soft Delete any PermittedActivity attached to the application/license.
          await PActivity.destroy({where: {id: pGreatBlackBackedGullActivity.id}, transaction: t});
        }

        const pLesserBlackBackedGullActivity = await PActivity.findByPk(pSpecies.LesserBlackBackedGullId, {
          transaction: t,
        });
        if (pLesserBlackBackedGullActivity) {
          // Soft Delete any PermittedActivity attached to the application/license.
          await PActivity.destroy({where: {id: pLesserBlackBackedGullActivity.id}, transaction: t});
        }

        // Soft Delete any Permitted species record attached to the application/license.
        await PSpecies.destroy({where: {id: pSpecies.id}, transaction: t});

        // Soft Delete any Contact attached to the application/license.
        await Contact.destroy({where: {id: application.LicenceHolderId}, transaction: t});
        await Contact.destroy({where: {id: application.LicenceApplicantId}, transaction: t});
        // Soft Delete any Address attached to the application/license.
        await Address.destroy({where: {id: application.LicenceHolderAddressId}, transaction: t});
        await Address.destroy({where: {id: application.SiteAddressId}, transaction: t});
        // Soft delete any Measure or Issue attached to the application/license.
        await Measure.destroy({where: {ApplicationId: id}, transaction: t});
        await Issue.destroy({where: {ApplicationId: id}, transaction: t});
        // Soft delete the assessment attached to the application/license.
        await Assessment.destroy({where: {ApplicationId: id}, transaction: t});
        // Soft delete any Assessment Measure attached to the application/license.
        await AssessmentMeasure.destroy({where: {ApplicationId: id}, transaction: t});
        // Soft delete any advisories or conditions attached to the application/license.
        await LicenseAdvisory.destroy({where: {LicenseId: id}, transaction: t});
        await LicenseCondition.destroy({where: {LicenseId: id}, transaction: t});
        // Soft delete the License attached to the application.
        await License.destroy({where: {ApplicationId: id}, transaction: t});
        // Create the revocation entry.
        await Revocation.create(cleanObject, {transaction: t});
        // Soft Delete the Application/License.
        await Application.destroy({where: {id}, transaction: t});
        // If everything worked then return true.
        return true;
      });
      // Everything worked so return true to the calling code.
      return true;
    } catch {
      // If something went wrong during the transaction return false.
      return false;
    }
  },

  /**
   * Deletes a application in the database (Withdraw).
   *
   * @param {number} id A possible ID of a application.
   * @param {object} cleanObject A new revocation object to be added to the database.
   * @returns {boolean} True if the record is deleted, otherwise false.
   */
  withdraw: async (id: number, cleanObject: any) => {
    try {
      // Start the transaction.
      await database.sequelize.transaction(async (t: transaction) => {
        // Check the application/license exists.
        const application: any = await Application.findByPk(id, {
          transaction: t,
          rejectOnEmpty: true,
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

        // Construct and send the withdrawal email.
        // We have to do it here because the application is deleted after this.
        const emailDetails = setWithdrawalEmailDetails(
          application.id,
          application.LicenceHolder,
          application.LicenceApplicant,
          application.SiteAddress,
          cleanObject.reason,
        );

        // Find the species record.
        const species = await Species.findByPk(application.SpeciesId, {transaction: t, rejectOnEmpty: true});
        // Find the permitted species record.
        const pSpecies = await PSpecies.findByPk(application.PermittedSpeciesId, {
          transaction: t,
          rejectOnEmpty: true,
        });

        // Create a new object that contains only null values to save into the database.
        const nullApp = {
          LicenceHolderId: null,
          LicenceApplicantId: null,
          LicenceHolderAddressId: null,
          SiteAddressId: null,
          SpeciesId: null,
          isResidentialSite: null,
          siteType: null,
          SiteCategoriesId: null,
          previousLicenceNumber: null,
          supportingInformation: null,
          confirmedByLicenseHolder: null,
          previousLicence: null,
          PermittedSpeciesId: null,
          staffNumber: null,
        };
        // Set all values to NULL so we can delete all attached records.
        await Application.update(nullApp, {where: {id}, transaction: t});
        // Create the revocation entry.
        await Withdrawal.create(cleanObject, {transaction: t});

        // Delete any species record attached to the application/license.
        await Species.destroy({where: {id: species.id}, force: true, transaction: t});
        // Delete any PermittedSpecies record attached to the application/license.
        await PSpecies.destroy({where: {id: pSpecies.id}, force: true, transaction: t});

        // Find the activities records.
        const herringGullActivity = await Activity.findByPk(species.HerringGullId, {transaction: t});
        if (herringGullActivity) {
          // Delete any Activity record attached to the application/license.
          await Activity.destroy({where: {id: herringGullActivity.id}, force: true, transaction: t});
        }

        const blackHeadedGullActivity = await Activity.findByPk(species.BlackHeadedGullId, {transaction: t});
        if (blackHeadedGullActivity) {
          // Delete any Activity record attached to the application/license.
          await Activity.destroy({where: {id: blackHeadedGullActivity.id}, force: true, transaction: t});
        }

        const commonGullActivity = await Activity.findByPk(species.CommonGullId, {transaction: t});
        if (commonGullActivity) {
          // Delete any Activity record attached to the application/license.
          await Activity.destroy({where: {id: commonGullActivity.id}, force: true, transaction: t});
        }

        const greatBlackBackedGullActivity = await Activity.findByPk(species.GreatBlackBackedGullId, {transaction: t});
        if (greatBlackBackedGullActivity) {
          // Delete any Activity record attached to the application/license.
          await Activity.destroy({where: {id: greatBlackBackedGullActivity.id}, force: true, transaction: t});
        }

        const lesserBlackBackedGullActivity = await Activity.findByPk(species.LesserBlackBackedGullId, {
          transaction: t,
        });
        if (lesserBlackBackedGullActivity) {
          // Delete any Activity record attached to the application/license.
          await Activity.destroy({where: {id: lesserBlackBackedGullActivity.id}, force: true, transaction: t});
        }

        // Find the permitted activities records.
        const pHerringGullActivity = await PActivity.findByPk(pSpecies.HerringGullId, {
          transaction: t,
        });
        if (pHerringGullActivity) {
          // Delete any PermittedActivity record attached to the application/license.
          await PActivity.destroy({where: {id: pHerringGullActivity.id}, force: true, transaction: t});
        }

        const pBlackHeadedGullActivity = await PActivity.findByPk(pSpecies.BlackHeadedGullId, {
          transaction: t,
        });
        if (pBlackHeadedGullActivity) {
          // Delete any PermittedActivity record attached to the application/license.
          await PActivity.destroy({
            where: {id: pBlackHeadedGullActivity.id},
            force: true,
            transaction: t,
          });
        }

        const pCommonGullActivity = await PActivity.findByPk(pSpecies.CommonGullId, {
          transaction: t,
        });
        if (pCommonGullActivity) {
          // Delete any PermittedActivity record attached to the application/license.
          await PActivity.destroy({where: {id: pCommonGullActivity.id}, force: true, transaction: t});
        }

        const pGreatBlackBackedGullActivity = await PActivity.findByPk(pSpecies.GreatBlackBackedGullId, {
          transaction: t,
        });
        if (pGreatBlackBackedGullActivity) {
          // Delete any PermittedActivity record attached to the application/license.
          await PActivity.destroy({
            where: {id: pGreatBlackBackedGullActivity.id},
            force: true,
            transaction: t,
          });
        }

        const pLesserBlackBackedGullActivity = await PActivity.findByPk(pSpecies.LesserBlackBackedGullId, {
          transaction: t,
        });
        if (pLesserBlackBackedGullActivity) {
          // Delete any PermittedActivity record attached to the application/license.
          await PActivity.destroy({
            where: {id: pLesserBlackBackedGullActivity.id},
            force: true,
            transaction: t,
          });
        }

        // Delete any Contacts attached to the application/license.
        await Contact.destroy({where: {id: application.LicenceHolderId}, force: true, transaction: t});
        await Contact.destroy({where: {id: application.LicenceApplicantId}, force: true, transaction: t});
        // Delete any Address attached to the application/license.
        await Address.destroy({where: {id: application.LicenceHolderAddressId}, force: true, transaction: t});
        await Address.destroy({where: {id: application.SiteAddressId}, force: true, transaction: t});
        // Delete any Measure or Issue attached to the application/license.
        await Measure.destroy({where: {ApplicationId: id}, force: true, transaction: t});
        await Issue.destroy({where: {ApplicationId: id}, force: true, transaction: t});
        // Delete the assessment attached to the application/license.
        await Assessment.destroy({where: {ApplicationId: id}, force: true, transaction: t});
        // Delete any assessment Measure attached to the application/license.
        await AssessmentMeasure.destroy({where: {ApplicationId: id}, force: true, transaction: t});

        // Send the withdrawal email to the license holder.
        await sendWithdrawalEmail(emailDetails, application.LicenceHolder.emailAddress);

        // Send the withdrawal email to the on behalf applicant.
        if (application?.LicenceApplicant?.emailAddress) {
          await sendWithdrawalEmail(emailDetails, application.LicenceApplicant.emailAddress);
        }

        // If everything worked then return true.
        return true;
      });

      // Everything worked so return true to the calling code.
      return true;
    } catch {
      // If something went wrong during the transaction return false.
      return false;
    }
  },

  /**
   * Sends out an email if a application has been refused.
   *
   * @param {any} applicationId A collection of all licences to be sent a reminder.
   */
  setRefusalEmail: async (applicationId: number) => {
    // Get the application.
    const application: any = await ApplicationController.findOne(applicationId);

    // Set the email details personalisation.
    const emailDetails = await setRefusalEmailDetails(application);

    // Try to send the email to the licence holder.
    await sendRefusalEmail(emailDetails, application.LicenceHolder.emailAddress);
    // Check to see if this was an on behalf application.
    if (application.LicenceApplicant !== application.LicenceHolder) {
      // Try to send the email to the licence applicant.
      await sendRefusalEmail(emailDetails, application.LicenceApplicant.emailAddress);
    }

    // And send a copy to the licensing team too.
    await sendRefusalEmail(emailDetails, 'issuedlicence@nature.scot');
  },
};

export {ApplicationController as default};
export {ApplicationInterface};
