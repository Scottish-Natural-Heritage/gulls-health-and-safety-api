/* eslint-disable unicorn/prefer-module */

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    up: async (queryInterface, Sequelize) => {
      // Grab the applications as an array of objects.
      const applicationsResultsArray = await queryInterface.sequelize.query('SELECT * FROM gulls."Applications";', {
        type: Sequelize.QueryTypes.SELECT,
      });

      const activitiesResultsArray = await queryInterface.sequelize.query('SELECT * FROM gulls."Activities";', {
        type: Sequelize.QueryTypes.SELECT,
      });

      const speciesResultsArray = await queryInterface.sequelize.query('SELECT * FROM gulls."Species";', {
        type: Sequelize.QueryTypes.SELECT,
      });

      const updateActivitiesQueries = [];
      // Loop through the updated results and update the expiryDate field with the new value.
      for (const result of activitiesResultsArray) {
        // Get an integer value of what the user has entered into the activities table in the quantityNestsToRemove column.
        let displayableNestRange;
        // prettier-ignore
        switch (result.quantityNestsToRemove) {
        case 'upTo10':
          displayableNestRange = 10;
          break;
        case 'upTo50':
          displayableNestRange = 50;
          break;
        case 'upTo100':
          displayableNestRange = 100;
          break;
        case 'upTo500':
          displayableNestRange = 500;
          break;
        case 'upTo1000':
          displayableNestRange = 1000;
          break;
        default:
          displayableNestRange = 0;
          break;
        }

        // Get an integer value of what the user has entered into the activities table in the quantityNestsWhereEggsDestroyed column.
        let displayableEggRange;
        // prettier-ignore
        switch (result.quantityNestsWhereEggsDestroyed) {
        case 'upTo10':
          displayableEggRange = 10;
          break;
        case 'upTo50':
          displayableEggRange = 50;
          break;
        case 'upTo100':
          displayableEggRange = 100;
          break;
        case 'upTo500':
          displayableEggRange = 500;
          break;
        case 'upTo1000':
          displayableEggRange = 1000;
          break;
        default:
          displayableEggRange = 0;
          break;
        }

        updateActivitiesQueries.push(
          queryInterface.sequelize.query(
            `INSERT INTO gulls."PermittedActivities" ("id", "removeNests", "quantityNestsToRemove", "eggDestruction", "quantityNestsWhereEggsDestroyed", "chicksToRescueCentre", "quantityChicksToRescue", "chicksRelocateNearby", "quantityChicksToRelocate", "killChicks", "quantityChicksToKill", "killAdults", "quantityAdultsToKill", "createdAt", "updatedAt") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
            {
              replacements: [
                result.id,
                result.removeNests,
                displayableNestRange,
                result.eggDestruction,
                displayableEggRange,
                result.chicksToRescueCentre,
                result.quantityChicksToRescue,
                result.chicksRelocateNearby,
                result.quantityChicksToRelocate,
                result.killChicks,
                result.quantityChicksToKill,
                result.killAdults,
                result.quantityAdultsToKill,
                result.createdAt,
                result.updatedAt,
              ],
              type: Sequelize.QueryTypes.INSERT,
            },
          ),
        );
      }

      await Promise.all(updateActivitiesQueries);

      const updateSpeciesQueries = [];
      // Loop through the updated results and update the expiryDate field with the new value.
      for (const result of speciesResultsArray) {
        updateSpeciesQueries.push(
          queryInterface.sequelize.query(
            `INSERT INTO gulls."PermittedSpecies" ("id", "HerringGullId", "BlackHeadedGullId", "CommonGullId", "GreatBlackBackedGullId", "LesserBlackBackedGullId", "createdAt", "updatedAt") VALUES (?,?,?,?,?,?,?,?);`,
            {
              replacements: [
                result.id,
                result.HerringGullId,
                result.BlackHeadedGullId,
                result.CommonGullId,
                result.GreatBlackBackedGullId,
                result.LesserBlackBackedGullId,
                result.createdAt,
                result.updatedAt,
              ],
              type: Sequelize.QueryTypes.INSERT,
            },
          ),
        );
      }

      await Promise.all(updateSpeciesQueries);

      const updateQueries = [];
      // Loop through the updated results and update the expiryDate field with the new value.
      for (const result of applicationsResultsArray) {
        updateQueries.push(
          queryInterface.sequelize.query(`UPDATE gulls."Applications" SET "PermittedSpeciesId" = ? WHERE id = ?;`, {
            replacements: [result.SpeciesId, result.id],
            type: Sequelize.QueryTypes.UPDATE,
          }),
        );
      }

      await Promise.all(updateQueries);
    },
    down: async (queryInterface, Sequelize) => {
      // For the opposite set all expiry date values to null.
      await queryInterface.sequelize.query(`UPDATE gulls."Applications" SET "PermittedSpeciesId" = null;`, {
        type: Sequelize.QueryTypes.UPDATE,
      });
      await queryInterface.sequelize.query(`DELETE FROM gulls."PermittedSpecies";`, {
        type: Sequelize.QueryTypes.UPDATE,
      });
      await queryInterface.sequelize.query(`DELETE FROM gulls."PermittedActivities";`, {
        type: Sequelize.QueryTypes.UPDATE,
      });
    },
  };
} else {
  module.exports = {
    up: async (queryInterface, Sequelize) => {
      const activitiesResultsArray = await queryInterface.sequelize.query('SELECT * FROM Activities;', {
        type: Sequelize.QueryTypes.SELECT,
      });

      const speciesResultsArray = await queryInterface.sequelize.query('SELECT * FROM Species;', {
        type: Sequelize.QueryTypes.SELECT,
      });

      // Grab the applications as an array of objects.
      const applicationsResultsArray = await queryInterface.sequelize.query('SELECT * FROM Applications;', {
        type: Sequelize.QueryTypes.SELECT,
      });

      const updateActivitiesQueries = [];

      for (const result of activitiesResultsArray) {
        // Get an integer value of what the user has entered into the activities table in the quantityNestsToRemove column.
        let displayableNestRange;
        // prettier-ignore
        switch (result.quantityNestsToRemove) {
        case 'upTo10':
          displayableNestRange = 10;
          break;
        case 'upTo50':
          displayableNestRange = 50;
          break;
        case 'upTo100':
          displayableNestRange = 100;
          break;
        case 'upTo500':
          displayableNestRange = 500;
          break;
        case 'upTo1000':
          displayableNestRange = 1000;
          break;
        default:
          displayableNestRange = 0;
          break;
        }

        // Get an integer value of what the user has entered into the activities table in the quantityNestsWhereEggsDestroyed column.
        let displayableEggRange;
        // prettier-ignore
        switch (result.quantityNestsWhereEggsDestroyed) {
        case 'upTo10':
          displayableEggRange = 10;
          break;
        case 'upTo50':
          displayableEggRange = 50;
          break;
        case 'upTo100':
          displayableEggRange = 100;
          break;
        case 'upTo500':
          displayableEggRange = 500;
          break;
        case 'upTo1000':
          displayableEggRange = 1000;
          break;
        default:
          displayableEggRange = 0;
          break;
        }

        // Loop through the updated results and update the expiryDate field with the new value.
        updateActivitiesQueries.push(
          queryInterface.sequelize.query(
            `INSERT INTO PermittedActivities (id, removeNests, quantityNestsToRemove, eggDestruction, quantityNestsWhereEggsDestroyed, chicksToRescueCentre, quantityChicksToRescue, chicksRelocateNearby, quantityChicksToRelocate, killChicks, quantityChicksToKill, killAdults, quantityAdultsToKill, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
            {
              replacements: [
                result.id,
                result.removeNests,
                displayableNestRange,
                result.eggDestruction,
                displayableEggRange,
                result.chicksToRescueCentre,
                result.quantityChicksToRescue,
                result.chicksRelocateNearby,
                result.quantityChicksToRelocate,
                result.killChicks,
                result.quantityChicksToKill,
                result.killAdults,
                result.quantityAdultsToKill,
                result.createdAt,
                result.updatedAt,
              ],
              type: Sequelize.QueryTypes.INSERT,
            },
          ),
        );
      }

      await Promise.all(updateActivitiesQueries);

      const updateSpeciesQueries = [];
      // Loop through the updated results and update the expiryDate field with the new value.
      for (const result of speciesResultsArray) {
        updateSpeciesQueries.push(
          queryInterface.sequelize.query(
            `INSERT INTO PermittedSpecies (id, HerringGullId, BlackHeadedGullId, CommonGullId, GreatBlackBackedGullId, LesserBlackBackedGullId, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?);`,
            {
              replacements: [
                result.id,
                result.HerringGullId,
                result.BlackHeadedGullId,
                result.CommonGullId,
                result.GreatBlackBackedGullId,
                result.LesserBlackBackedGullId,
                result.createdAt,
                result.updatedAt,
              ],
              type: Sequelize.QueryTypes.INSERT,
            },
          ),
        );
      }

      await Promise.all(updateSpeciesQueries);

      const updateQueries = [];
      // Loop through the updated results and update the expiryDate field with the new value.
      for (const result of applicationsResultsArray) {
        updateQueries.push(
          queryInterface.sequelize.query(`UPDATE Applications SET PermittedSpeciesId = ? WHERE id = ?;`, {
            replacements: [result.SpeciesId, result.id],
            type: Sequelize.QueryTypes.UPDATE,
          }),
        );
      }

      await Promise.all(updateQueries);
    },
    down: async (queryInterface, Sequelize) => {
      // For the opposite set all expiry date values to null.
      await queryInterface.sequelize.query(`UPDATE Applications SET PermittedSpeciesId = null;`, {
        type: Sequelize.QueryTypes.UPDATE,
      });
      await queryInterface.sequelize.query(`DELETE FROM PermittedSpecies;`, {
        type: Sequelize.QueryTypes.UPDATE,
      });
      await queryInterface.sequelize.query(`DELETE FROM PermittedActivities;`, {
        type: Sequelize.QueryTypes.UPDATE,
      });
    },
  };
}
