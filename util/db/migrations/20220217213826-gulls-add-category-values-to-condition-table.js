/* eslint-disable unicorn/prefer-module */

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    up: async (queryInterface, Sequelize) => {
      // Grab the conditions as an array of objects.
      const firstConditionsResultsArray = await queryInterface.sequelize.query(
        'SELECT * FROM gulls."Conditions" WHERE "id" IN (1, 2);',
        {
          type: Sequelize.QueryTypes.SELECT,
        },
      );
      const secondConditionsResultsArray = await queryInterface.sequelize.query(
        'SELECT * FROM gulls."Conditions" WHERE "id" IN (3, 4, 5, 6, 7, 8, 9);',
        {
          type: Sequelize.QueryTypes.SELECT,
        },
      );
      const thirdConditionsResultsArray = await queryInterface.sequelize.query(
        'SELECT * FROM gulls."Conditions" WHERE "id" IN (10, 11);',
        {
          type: Sequelize.QueryTypes.SELECT,
        },
      );
      const fourthConditionsResultsArray = await queryInterface.sequelize.query(
        'SELECT * FROM gulls."Conditions" WHERE "id" IN (12, 13, 14, 15);',
        {
          type: Sequelize.QueryTypes.SELECT,
        },
      );

      const updateFirstConditionsQueries = [];
      const updateSecondConditionsQueries = [];
      const updateThirdConditionsQueries = [];
      const updateFourthConditionsQueries = [];
      // Loop through the updated results and update the category field with the new value.
      for (const result of firstConditionsResultsArray) {
        result.category = 'What the licence covers';
      }

      // Loop through the updated results and update the category field with the new value.
      for (const result of firstConditionsResultsArray) {
        updateFirstConditionsQueries.push(
          queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "category" = ? WHERE "id" = ?;`, {
            replacements: [result.category, result.id],
            type: Sequelize.QueryTypes.UPDATE,
          }),
        );
      }

      await Promise.all(updateFirstConditionsQueries);

      // Loop through the updated results and update the category field with the new value.
      for (const result of secondConditionsResultsArray) {
        result.category = 'What you must do';
      }

      // Loop through the updated results and update the category field with the new value.
      for (const result of secondConditionsResultsArray) {
        updateSecondConditionsQueries.push(
          queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "category" = ? WHERE "id" = ?;`, {
            replacements: [result.category, result.id],
            type: Sequelize.QueryTypes.UPDATE,
          }),
        );
      }

      await Promise.all(updateSecondConditionsQueries);

      // Loop through the updated results and update the category field with the new value.
      for (const result of thirdConditionsResultsArray) {
        result.category = 'Recording and reporting requirements';
      }

      // Loop through the updated results and update the category field with the new value.
      for (const result of thirdConditionsResultsArray) {
        updateThirdConditionsQueries.push(
          queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "category" = ? WHERE "id" = ?;`, {
            replacements: [result.category, result.id],
            type: Sequelize.QueryTypes.UPDATE,
          }),
        );
      }

      await Promise.all(updateThirdConditionsQueries);

      // Loop through the updated results and update the category field with the new value.
      for (const result of fourthConditionsResultsArray) {
        result.category = 'General';
      }

      // Loop through the updated results and update the category field with the new value.
      for (const result of fourthConditionsResultsArray) {
        updateFourthConditionsQueries.push(
          queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "category" = ? WHERE "id" = ?;`, {
            replacements: [result.category, result.id],
            type: Sequelize.QueryTypes.UPDATE,
          }),
        );
      }

      await Promise.all(updateFourthConditionsQueries);
    },
    down: async (queryInterface, Sequelize) => {
      // For the opposite set all expiry date values to null.
      await queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "category" = null;`, {
        type: Sequelize.QueryTypes.UPDATE,
      });
    },
  };
} else {
  module.exports = {
    up: async (queryInterface, Sequelize) => {
      // Grab the conditions as an array of objects.
      const firstConditionsResultsArray = await queryInterface.sequelize.query(
        'SELECT * FROM Conditions WHERE id IN (1, 2);',
        {
          type: Sequelize.QueryTypes.SELECT,
        },
      );
      const secondConditionsResultsArray = await queryInterface.sequelize.query(
        'SELECT * FROM Conditions WHERE id IN (3, 4, 5, 6, 7, 8, 9);',
        {
          type: Sequelize.QueryTypes.SELECT,
        },
      );
      const thirdConditionsResultsArray = await queryInterface.sequelize.query(
        'SELECT * FROM Conditions WHERE id IN (10, 11);',
        {
          type: Sequelize.QueryTypes.SELECT,
        },
      );
      const fourthConditionsResultsArray = await queryInterface.sequelize.query(
        'SELECT * FROM Conditions WHERE id IN (12, 13, 14, 15);',
        {
          type: Sequelize.QueryTypes.SELECT,
        },
      );

      const updateFirstConditionsQueries = [];
      const updateSecondConditionsQueries = [];
      const updateThirdConditionsQueries = [];
      const updateFourthConditionsQueries = [];
      // Loop through the updated results and update the category field with the new value.
      for (const result of firstConditionsResultsArray) {
        result.category = 'What the licence covers';
      }

      // Loop through the updated results and update the category field with the new value.
      for (const result of firstConditionsResultsArray) {
        updateFirstConditionsQueries.push(
          queryInterface.sequelize.query(`UPDATE Conditions SET category = ? WHERE id = ?;`, {
            replacements: [result.category, result.id],
            type: Sequelize.QueryTypes.UPDATE,
          }),
        );
      }

      await Promise.all(updateFirstConditionsQueries);

      // Loop through the updated results and update the category field with the new value.
      for (const result of secondConditionsResultsArray) {
        result.category = 'What you must do';
      }

      // Loop through the updated results and update the category field with the new value.
      for (const result of secondConditionsResultsArray) {
        updateSecondConditionsQueries.push(
          queryInterface.sequelize.query(`UPDATE Conditions SET category = ? WHERE id = ?;`, {
            replacements: [result.category, result.id],
            type: Sequelize.QueryTypes.UPDATE,
          }),
        );
      }

      await Promise.all(updateSecondConditionsQueries);

      // Loop through the updated results and update the category field with the new value.
      for (const result of thirdConditionsResultsArray) {
        result.category = 'Recording and reporting requirements';
      }

      // Loop through the updated results and update the category field with the new value.
      for (const result of thirdConditionsResultsArray) {
        updateThirdConditionsQueries.push(
          queryInterface.sequelize.query(`UPDATE Conditions SET category = ? WHERE id = ?;`, {
            replacements: [result.category, result.id],
            type: Sequelize.QueryTypes.UPDATE,
          }),
        );
      }

      await Promise.all(updateThirdConditionsQueries);

      // Loop through the updated results and update the category field with the new value.
      for (const result of fourthConditionsResultsArray) {
        result.category = 'General';
      }

      // Loop through the updated results and update the category field with the new value.
      for (const result of fourthConditionsResultsArray) {
        updateFourthConditionsQueries.push(
          queryInterface.sequelize.query(`UPDATE Conditions SET category = ? WHERE id = ?;`, {
            replacements: [result.category, result.id],
            type: Sequelize.QueryTypes.UPDATE,
          }),
        );
      }

      await Promise.all(updateFourthConditionsQueries);
    },
    down: async (queryInterface, Sequelize) => {
      // For the opposite set all expiry date values to null.
      await queryInterface.sequelize.query(`UPDATE Conditions SET category = null;`, {
        type: Sequelize.QueryTypes.UPDATE,
      });
    },
  };
}
