/**
 * The ID of the Notify template to be used when a 14 day magic link reminder email is sent.
 */
const FOURTEEN_DAY_MAGIC_LINK_NOTIFY_TEMPLATE_ID = '328d9fa5-b7be-443b-85f5-1b2c80f94022';

/**
 * The ID of the Notify template to be used when a 14 day applicant reminder email is sent.
 */
const FOURTEEN_DAY_REMINDER_NOTIFY_TEMPLATE_ID = '52c8aa89-7fec-41c2-bb02-646ed61470d3';

/**
 * The ID of the Notify template to be used when a 21 day notification email is sent.
 */
const TWENTY_ONE_DAY_WITHDRAWAL_NOTIFY_TEMPLATE_ID = 'd2dfaf64-49fb-4383-9713-33aa55898afa';

/**
 * The ID of the Notify template to be used when a refusal email is sent.
 */
 const REFUSAL_NOTIFY_TEMPLATE_ID = '5e1470bb-6953-4320-b405-4031c8d1d51b';

/**
 * The ID of the Notify template to be used when an expired licence with no returns against it
 * reminder email is sent.
 */
const EXPIRED_NO_RETURN_NOTIFY_TEMPLATE_ID = '5cfc510d-e4cd-4acc-8610-f9a430669384';

/**
 * The ID of the Notify template to be used when an expired licence with no final return
 * against it is sent.
 */
const EXPIRED_NO_FINAL_RETURN_NOTIFY_TEMPLATE_ID = '9390eb90-9ad4-4416-a4e2-42b6573358a1';

/**
 * The ID of the Notify template to be used when a licence will expire soon reminder email
 * is sent.
 */
const LICENCE_EXPIRES_SOON_NOTIFY_TEMPLATE_ID = '0130f081-9d83-40e4-b1de-880721578e57';

/**
 * The ID of the `licensing@nature.scot` reply-to email address.
 */
const LICENSING_REPLY_TO_NOTIFY_EMAIL_ID = '4b49467e-2a35-4713-9d92-809c55bf1cdd';

/**
 * The ID of the email that is sent for licenses that have been valid for at least 3 weeks
 * but are yet to have a Return submitted. These keep being emailed on the first of the month
 * until a return is submitted, then not sent again.
 */
const FIRST_OF_MONTH_REMINDER_FOR_LICENCES_WITH_OVERDUE_RETURNS = 'febe0531-36a7-442d-9560-0b8b9c0817fe';

export {
  FOURTEEN_DAY_MAGIC_LINK_NOTIFY_TEMPLATE_ID,
  FOURTEEN_DAY_REMINDER_NOTIFY_TEMPLATE_ID,
  TWENTY_ONE_DAY_WITHDRAWAL_NOTIFY_TEMPLATE_ID,
  REFUSAL_NOTIFY_TEMPLATE_ID,
  EXPIRED_NO_RETURN_NOTIFY_TEMPLATE_ID,
  EXPIRED_NO_FINAL_RETURN_NOTIFY_TEMPLATE_ID,
  LICENCE_EXPIRES_SOON_NOTIFY_TEMPLATE_ID,
  LICENSING_REPLY_TO_NOTIFY_EMAIL_ID,
  FIRST_OF_MONTH_REMINDER_FOR_LICENCES_WITH_OVERDUE_RETURNS,
};
