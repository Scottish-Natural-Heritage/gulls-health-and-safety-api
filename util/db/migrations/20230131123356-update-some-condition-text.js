/* eslint-disable unicorn/prefer-module */

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    up: async (queryInterface, Sequelize) => {
      const updatedCondition1 =
        'You must employ non-licensable measures first. If these are unsuccessful, then you must use a hierarchical approach to licensed control: \n\n 1. clearance of nests, then; \n 2. destruction or replacement of eggs, then; \n 3. taking of chicks, then; \n 4. killing of chicks, then; \n 5. killing of adults \n\n  ...only where each activity is permitted under this licence.';

      await queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "condition" = ? WHERE "id" = 8;`, {
        replacements: [updatedCondition1],
        type: Sequelize.QueryTypes.UPDATE,
      });

      const updatedCondition2 =
        'This licence only authorises where there is no other satisfactory course of action: \n\n - the species, activities and numbers listed on this licence \n - at the location specified \n - and during the period stated on this licence.';

      await queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "condition" = ? WHERE "id" = 1;`, {
        replacements: [updatedCondition2],
        type: Sequelize.QueryTypes.UPDATE,
      });

    },

    down: async (queryInterface, Sequelize) => {
      const revertedCondition2 =
        'This licence only authorises where there is no other satisfactory course of action: the species, activities and numbers listed on this licence, at the location specified and during the period stated on this licence.';

      await queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "condition" = ? WHERE "id" = 1;`, {
        replacements: [revertedCondition2],
        type: Sequelize.QueryTypes.UPDATE,
      });

      const revertedCondition1 =
        'You must employ non-licensable measures first. If these are unsuccessful, then you must use a hierarchical approach to licensed control: clearance of nests, then; destruction or replacement of eggs, then; taking of chicks, then; killing of chicks, then; killing of adults - only where each activity is permitted under this licence.';

      await queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "condition" = ? WHERE "id" = 8;`, {
        replacements: [revertedCondition1],
        type: Sequelize.QueryTypes.UPDATE,
      });


    },
  };
} else {
  module.exports = {
    up: async (queryInterface, Sequelize) => {
      const updatedCondition1 =
        'You must employ non-licensable measures first. If these are unsuccessful, then you must use a hierarchical approach to licensed control: \n\n 1. clearance of nests, then; \n 2. destruction or replacement of eggs, then; \n 3. taking of chicks, then; \n 4. killing of chicks, then; \n 5. killing of adults \n\n  ...only where each activity is permitted under this licence.';

      await queryInterface.sequelize.query(`UPDATE Conditions SET condition = ? WHERE id = 8;`, {
        replacements: [updatedCondition1],
        type: Sequelize.QueryTypes.UPDATE,
      });

      const updatedCondition2 =
        'This licence only authorises where there is no other satisfactory course of action: \n\n - the species, activities and numbers listed on this licence \n - at the location specified \n - and during the period stated on this licence.';

      await queryInterface.sequelize.query(`UPDATE Conditions SET condition = ? WHERE id = 1;`, {
        replacements: [updatedCondition2],
        type: Sequelize.QueryTypes.UPDATE,
      });


    },

    down: async (queryInterface, Sequelize) => {
      const revertedCondition2 =
        'This licence only authorises where there is no other satisfactory course of action: \n\n - the species, activities and numbers listed on this licence \n - at the location specified \n - and during the period stated on this licence.';

      await queryInterface.sequelize.query(`UPDATE Conditions SET condition = ? WHERE id = 1;`, {
        replacements: [revertedCondition2],
        type: Sequelize.QueryTypes.UPDATE,
      });

      const revertedCondition1 =
        'You must employ non-licensable measures first. If these are unsuccessful, then you must use a hierarchical approach to licensed control: \n\n 1. clearance of nests, then; \n 2. destruction or replacement of eggs, then; \n 3. taking of chicks, then; \n 4. killing of chicks, then; \n 5. killing of adults \n\n  ...only where each activity is permitted under this licence.';

      await queryInterface.sequelize.query(`UPDATE Conditions SET condition = ? WHERE id = 8;`, {
        replacements: [revertedCondition1],
        type: Sequelize.QueryTypes.UPDATE,
      });


    },
  };
}
