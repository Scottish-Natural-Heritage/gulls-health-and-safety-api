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

/**
 * This function creates a human readable date from a JavaScript Date object.
 * An example of the format is "Thursday, December 23, 2013".
 *
 * @param {Date} date The JavaScript date object to use.
 * @returns {string} The human readable date as a string.
 */
const createDisplayDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
};

/**
 * This function creates a short human readable date from a JavaScript Date object.
 * An example of the format is "13/03/2023".
 *
 * @param {Date} date The JavaScript date object to use.
 * @returns {string} The human readable date as a string.
 */
const createShortDisplayDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB');
};

const MultiUseFunctions = {
  createSummaryAddress,
  createDisplayDate,
  createShortDisplayDate,
};

export default MultiUseFunctions;
