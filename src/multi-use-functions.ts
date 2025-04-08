/**
 * This function returns a summary address built from the address fields of an address object.
 *
 * @param {any} fullAddress The address to use to build the summary address from.
 * @returns {string} Returns a string containing the summary address.
 */
const createSummaryAddress = (fullAddress: any): string => {
  const address = [];

  address.push(
    fullAddress?.addressLine1?.trim() ?? '',
    fullAddress?.addressLine2?.trim() ?? '',
    fullAddress?.addressTown?.trim() ?? '',
    fullAddress?.addressCounty?.trim() ?? '',
    fullAddress?.postcode?.trim() ?? '',
  );

  return address
    .filter((item) => {
      return item !== '';
    })
    .join(', ');
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

/**
 * This function returns a list of measures, either tried, intended to be tried, or not intended
 * to be tried, formatted as bullet points for the notify API.
 *
 * @param {any} applicationMeasures The list of measures.
 * @param {string} measuresStatus Either `Tried`, `Intend` or `No`.
 * @returns {string} Returns a formatted list of bullet pointed measures.
 */
const createAdditionalMeasures = (applicationMeasures: any, measuresStatus: string): string => {
  const measures: string[] = [];

  if (applicationMeasures?.preventNesting === measuresStatus) {
    measures.push('* Physically preventing nesting');
  }

  if (applicationMeasures?.removeOldNests === measuresStatus) {
    measures.push('* Removing old nests and potential nesting material');
  }

  if (applicationMeasures?.removeLitter === measuresStatus) {
    measures.push('* Removing or preventing access to attractants such as litter and food waste');
  }

  if (applicationMeasures?.humanDisturbance === measuresStatus) {
    measures.push('* Human disturbance');
  }

  if (applicationMeasures?.scaringDevices === measuresStatus) {
    measures.push('* Scaring devices - static or automatic');
  }

  if (applicationMeasures?.hawking === measuresStatus) {
    measures.push('* Hawking by birds of prey');
  }

  if (applicationMeasures?.disturbanceByDogs === measuresStatus) {
    measures.push('* Disturbance by dogs');
  }

  if (measures.length > 0) {
    return measures.join('\n');
  }

  return '';
};

/**
 * This function creates a list of the species identified in the licence application, using
 * a `*` (star) to signify a bullet point to the Notify API.
 *
 * @param {any} species The list of species associated with the licence application.
 * @returns {string} Returns the list of species to which the licence pertains, formatted
 * as bullet points for the Notify API.
 */
const createIdentifiedSpecies = (species: any): string => {
  const identifiedSpecies: string[] = [];
  if (species.HerringGullId) {
    identifiedSpecies.push('* Herring gull');
  }

  if (species.BlackHeadedGullId) {
    identifiedSpecies.push('* Black-headed gull');
  }

  if (species.CommonGullId) {
    identifiedSpecies.push('* Common gull');
  }

  if (species.GreatBlackBackedGullId) {
    identifiedSpecies.push('* Great black-backed gull');
  }

  if (species.LesserBlackBackedGullId) {
    identifiedSpecies.push('* Lesser black-backed gull');
  }

  return identifiedSpecies.join('\n');
};

/**
 * This function returns a list of issues declared in the licence application, formatted
 * with a `*` (star) to represent bullet points with the Notify API.
 *
 * @param {any} applicationIssues The list of issues associated with the application.
 * @returns {string} Returns a list of issues to which the licence application
 * pertains, formatted as bullet points for the Notify API.
 */
const createIssues = (applicationIssues: any): string => {
  const issues: string[] = [];
  if (applicationIssues.aggression) {
    issues.push('* Aggression resulting in direct strikes');
  }

  if (applicationIssues.diveBombing) {
    issues.push('* Frequent dive-bombing');
  }

  if (applicationIssues.noise) {
    issues.push('* Noise disturbance');
  }

  if (applicationIssues.droppings) {
    issues.push('* Droppings contaminating foodstuffs');
  }

  if (applicationIssues.nestingMaterial) {
    issues.push(
      '* Build-up of nesting material in gas flues, air-conditioning units, active chimney pots or drainage systems',
    );
  }

  if (applicationIssues.atHeightAggression) {
    issues.push('* Disturbance or aggression on sites where people are working at height or with machinery');
  }

  if (applicationIssues.other) {
    issues.push('* Other issues');
  }

  return issues.join('\n');
};

/**
 * This function returns a list of measures, either tried, intended to be tried, or not intended
 * to be tried, formatted as bullet points for the notify API.
 *
 * @param {any} applicationMeasures The list of measures.
 * @param {string} measuresStatus Either `Tried`, `Intend` or `No`.
 * @returns {string} Returns a formatted list of bullet pointed measures.
 */
const createMeasures = (applicationMeasures: any, measuresStatus: string): string => {
  const measures: string[] = [];

  if (applicationMeasures.preventNesting === measuresStatus) {
    measures.push('* Physically preventing nesting');
  }

  if (applicationMeasures.removeOldNests === measuresStatus) {
    measures.push('* Removing old nests and potential nesting material');
  }

  if (applicationMeasures.removeLitter === measuresStatus) {
    measures.push('* Removing or preventing access to attractants such as litter and food waste');
  }

  if (applicationMeasures.humanDisturbance === measuresStatus) {
    measures.push('* Human disturbance');
  }

  if (applicationMeasures.scaringDevices === measuresStatus) {
    measures.push('* Scaring devices - static or automatic');
  }

  if (applicationMeasures.hawking === measuresStatus) {
    measures.push('* Hawking by birds of prey');
  }

  if (applicationMeasures.disturbanceByDogs === measuresStatus) {
    measures.push('* Disturbance by dogs');
  }

  if (measures.length > 0) {
    return measures.join('\n');
  }

  return '* Nothing selected by applicant';
};

/**
 * This function creates a list of the applied for licence activities results.
 *
 * @param {any} species The species and activities which the licence will pertain to.
 * @returns {string} Returns a list of the applied for licence activities results, formatted for the Notify API.
 */
const createAppliedFor = (species: any): string => {
  const proposalResult = [];
  if (species.HerringGullId) {
    proposalResult.push(addActivityResults(species.HerringGull, 'Herring gull'));
  }

  if (species.BlackHeadedGullId) {
    proposalResult.push(addActivityResults(species.BlackHeadedGull, 'Black-headed gull'));
  }

  if (species.CommonGullId) {
    proposalResult.push(addActivityResults(species.CommonGull, 'Common gull'));
  }

  if (species.GreatBlackBackedGullId) {
    proposalResult.push(addActivityResults(species.GreatBlackBackedGull, 'Great black-backed gull'));
  }

  if (species.LesserBlackBackedGullId) {
    proposalResult.push(addActivityResults(species.LesserBlackBackedGull, 'Lesser black-backed gull'));
  }

  return proposalResult.join('\n');
};

/**
 * This function adds proposal results to the list of proposal results.
 *
 * @param {any} species The species and activities the licence pertains to.
 * @param {string} speciesType The specific species to create the list of proposal results for.
 * @returns {string} Returns a list of proposal results for a given species, formatted as bullet
 * points for the Notify API.
 */
const addActivityResults = (species: any, speciesType: string): string => {
  const proposalResults: string[] = [];
  if (species.removeNests) {
    proposalResults.push(
      `* ${speciesType}: To take and destroy ${displayableUpToRanges(
        species.quantityNestsToRemove,
      )} nests and any eggs they contain by hand.`,
    );
  }

  if (species.eggDestruction) {
    proposalResults.push(
      `* ${speciesType}: To take and destroy eggs from ${displayableUpToRanges(
        species.quantityNestsWhereEggsDestroyed,
      )} nests by oiling, pricking or replacing with dummy eggs.`,
    );
  }

  if (species.chicksToRescueCentre) {
    proposalResults.push(
      `* ${speciesType}: To take ${String(
        species.quantityChicksToRescue,
      )} chicks to a wildlife rescue centre by hand, net or trap.`,
    );
  }

  if (species.chicksRelocateNearby) {
    proposalResults.push(
      `* ${speciesType}: To take ${String(
        species.quantityChicksToRelocate,
      )} chicks and relocate nearby by hand, net or trap.`,
    );
  }

  if (species.killChicks) {
    proposalResults.push(
      `* ${speciesType}: To kill up to ${String(
        species.quantityChicksToKill,
      )} chicks by shooting or by hand, net or trap.`,
    );
  }

  if (species.killAdults) {
    proposalResults.push(
      `* ${speciesType}: To kill up to ${String(
        species.quantityAdultsToKill,
      )} adults by shooting, falconry or by hand, net or trap.`,
    );
  }

  return proposalResults.join('\n');
};

/**
 * This function returns a slightly prettier and more accurate string of
 * ranges for display on the confirm page.
 *
 * @param {string} range The range to made more readable.
 * @returns {string} A more accurate and readable range as a string.
 */
const displayableRanges = (range: string | undefined): string => {
  let displayableRange = '';
  switch (range) {
    case 'upTo10': {
      displayableRange = '1 - 10';
      break;
    }

    case 'upTo25': {
      displayableRange = '11 - 25';
      break;
    }

    case 'upTo50': {
      displayableRange = '26 - 50';
      break;
    }

    case 'upTo100': {
      displayableRange = '51 - 100';
      break;
    }

    case 'upTo250': {
      displayableRange = '101 - 250';
      break;
    }

    case 'upTo500': {
      displayableRange = '251 - 500';
      break;
    }

    case 'upTo1000': {
      displayableRange = '501 - 1000';
      break;
    }

    default: {
      displayableRange = '';
      break;
    }
  }

  return displayableRange;
};

/**
 * This function returns a slightly prettier and more accurate string of the upper end of the range.
 *
 * @param {string} range The range to made more readable.
 * @returns {string} The upper end of the range.
 */
const displayableUpperRange = (range: string | undefined): string => {
  let upperRangeValue = '';
  switch (range) {
    case 'upTo10': {
      upperRangeValue = '10';
      break;
    }

    case 'upTo25': {
      upperRangeValue = '25';
      break;
    }

    case 'upTo50': {
      upperRangeValue = '50';
      break;
    }

    case 'upTo100': {
      upperRangeValue = '100';
      break;
    }

    case 'upTo250': {
      upperRangeValue = '250';
      break;
    }

    case 'upTo500': {
      upperRangeValue = '500';
      break;
    }

    case 'upTo1000': {
      upperRangeValue = '1000';
      break;
    }

    default: {
      upperRangeValue = '';
      break;
    }
  }

  return upperRangeValue;
};

/**
 * This function returns a slightly prettier and more accurate string of ranges in syntax up to X.
 *
 * @param {string} range The range to made more readable.
 * @returns {string} A more accurate and readable range as a string.
 */
const displayableUpToRanges = (range: string | undefined): string => {
  if (range === '10' || range === 'upTo10') {
    return 'up to 10';
  }

  if (range === '25' || range === 'upTo25') {
    return 'up to 25';
  }

  if (range === '50' || range === 'upTo50') {
    return 'up to 50';
  }

  if (range === '100' || range === 'upTo100') {
    return 'up to 100';
  }

  if (range === '250' || range === 'upTo250') {
    return 'up to 250';
  }

  if (range === '500' || range === 'upTo500') {
    return 'up to 500';
  }

  if (range === '1000' || range === 'upTo1000') {
    return 'up to 1000';
  }

  return '';
};

/**
 * This function creates a list of the proposed licence activities results.
 *
 * @param {any} species The species and activities which the licence will pertain to.
 * @returns {string} Returns a list of the proposal results, formatted for the Notify API.
 */
const createProposalResult = (species: any): string => {
  const proposalResult = [];
  if (species.HerringGullId) {
    proposalResult.push(addActivityResults(species.PHerringGull, 'Herring gull'));
  }

  if (species.BlackHeadedGullId) {
    proposalResult.push(addActivityResults(species.PBlackHeadedGull, 'Black-headed gull'));
  }

  if (species.CommonGullId) {
    proposalResult.push(addActivityResults(species.PCommonGull, 'Common gull'));
  }

  if (species.GreatBlackBackedGullId) {
    proposalResult.push(addActivityResults(species.PGreatBlackBackedGull, 'Great black-backed gull'));
  }

  if (species.LesserBlackBackedGullId) {
    proposalResult.push(addActivityResults(species.PLesserBlackBackedGull, 'Lesser black-backed gull'));
  }

  return proposalResult.join('\n');
};

const MultiUseFunctions = {
  createSummaryAddress,
  createDisplayDate,
  createShortDisplayDate,
  createAdditionalMeasures,
  createIdentifiedSpecies,
  createIssues,
  createMeasures,
  createAppliedFor,
  createProposalResult,
  displayableRanges,
  displayableUpperRange,
  displayableUpToRanges,
};

export default MultiUseFunctions;
