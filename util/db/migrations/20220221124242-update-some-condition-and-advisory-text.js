/* eslint-disable unicorn/prefer-module */

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    up: async (queryInterface, Sequelize) => {
      const updatedCondition1 =
        'You must carry out nest and egg clearance, egg pricking, egg oiling and use of dummy eggs once a fortnight at a minimum, but preferably once a week. You should make particular effort in the early breeding season.';

      await queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "condition" = ? WHERE "id" = 4;`, {
        replacements: [updatedCondition1],
        type: Sequelize.QueryTypes.UPDATE,
      });

      const updatedCondition2 =
        'You must destroy any eggs before disposing of them.  Any eggs found to be in the process of hatching must either be taken to a wildlife rehabilitation centre or humanely dispatched.';

      await queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "condition" = ? WHERE "id" = 6;`, {
        replacements: [updatedCondition2],
        type: Sequelize.QueryTypes.UPDATE,
      });

      const updatedCondition3 =
        'You must record the number of eggs oiled, pricked or replaced with dummy eggs as well as the dates on which they were destroyed.';

      await queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "condition" = ? WHERE "id" = 21;`, {
        replacements: [updatedCondition3],
        type: Sequelize.QueryTypes.UPDATE,
      });

      const updatedAdvisory1 =
        "Gull nests that are not in use are not protected. You don't need a licence to clear them and we do not count them in the permitted numbers of this licence.";

      await queryInterface.sequelize.query(`UPDATE gulls."Advisories" SET "advisory" = ? WHERE "id" = 2;`, {
        replacements: [updatedAdvisory1],
        type: Sequelize.QueryTypes.UPDATE,
      });
    },

    down: async (queryInterface, Sequelize) => {
      const updatedAdvisory1 =
        'Gull nests that are not in use or being built are not protected and their clearance does not require a licence and therefore do not count in the permitted numbers of this licence.';

      await queryInterface.sequelize.query(`UPDATE gulls."Advisories" SET "advisory" = ? WHERE "id" = 2;`, {
        replacements: [updatedAdvisory1],
        type: Sequelize.QueryTypes.UPDATE,
      });

      const updatedCondition3 =
        'You must record the number of eggs destroyed as well as the dates on which they were destroyed.';

      await queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "condition" = ? WHERE "id" = 21;`, {
        replacements: [updatedCondition3],
        type: Sequelize.QueryTypes.UPDATE,
      });

      const updatedCondition2 =
        'If you remove eggs under this licence, which are in the process of hatching, you must humanely destroy them before disposal.';

      await queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "condition" = ? WHERE "id" = 6;`, {
        replacements: [updatedCondition2],
        type: Sequelize.QueryTypes.UPDATE,
      });

      const updatedCondition1 =
        'You must carry out nest and egg clearance and/or egg pricking/egg oiling/use of dummy eggs once a fortnight at a minimum, but preferably once a week. You should make particular effort in the early breeding season.';

      await queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "condition" = ? WHERE "id" = 4;`, {
        replacements: [updatedCondition1],
        type: Sequelize.QueryTypes.UPDATE,
      });
    },
  };
} else {
  module.exports = {
    up: async (queryInterface, Sequelize) => {
      const updatedCondition1 =
        'You must carry out nest and egg clearance, egg pricking, egg oiling and use of dummy eggs once a fortnight at a minimum, but preferably once a week. You should make particular effort in the early breeding season.';

      await queryInterface.sequelize.query(`UPDATE Conditions SET condition = ? WHERE id = 4;`, {
        replacements: [updatedCondition1],
        type: Sequelize.QueryTypes.UPDATE,
      });

      const updatedCondition2 =
        'You must destroy any eggs before disposing of them.  Any eggs found to be in the process of hatching must either be taken to a wildlife rehabilitation centre or humanely dispatched.';

      await queryInterface.sequelize.query(`UPDATE Conditions SET condition = ? WHERE id = 6;`, {
        replacements: [updatedCondition2],
        type: Sequelize.QueryTypes.UPDATE,
      });

      const updatedCondition3 =
        'You must record the number of eggs oiled, pricked or replaced with dummy eggs as well as the dates on which they were destroyed.';

      await queryInterface.sequelize.query(`UPDATE Conditions SET condition = ? WHERE id = 21;`, {
        replacements: [updatedCondition3],
        type: Sequelize.QueryTypes.UPDATE,
      });

      const updatedAdvisory1 =
        "Gull nests that are not in use are not protected. You don't need a licence to clear them and we do not count them in the permitted numbers of this licence.";

      await queryInterface.sequelize.query(`UPDATE Advisories SET advisory = ? WHERE id = 2;`, {
        replacements: [updatedAdvisory1],
        type: Sequelize.QueryTypes.UPDATE,
      });
    },

    down: async (queryInterface, Sequelize) => {
      const updatedAdvisory1 =
        'Gull nests that are not in use or being built are not protected and their clearance does not require a licence and therefore do not count in the permitted numbers of this licence.';

      await queryInterface.sequelize.query(`UPDATE Advisories SET advisory = ? WHERE id = 2;`, {
        replacements: [updatedAdvisory1],
        type: Sequelize.QueryTypes.UPDATE,
      });

      const updatedCondition3 =
        'You must record the number of eggs destroyed as well as the dates on which they were destroyed.';

      await queryInterface.sequelize.query(`UPDATE Conditions SET condition = ? WHERE id = 21;`, {
        replacements: [updatedCondition3],
        type: Sequelize.QueryTypes.UPDATE,
      });

      const updatedCondition2 =
        'If you remove eggs under this licence, which are in the process of hatching, you must humanely destroy them before disposal.';

      await queryInterface.sequelize.query(`UPDATE Conditions SET condition = ? WHERE id = 6;`, {
        replacements: [updatedCondition2],
        type: Sequelize.QueryTypes.UPDATE,
      });

      const updatedCondition1 =
        'You must carry out nest and egg clearance and/or egg pricking/egg oiling/use of dummy eggs once a fortnight at a minimum, but preferably once a week. You should make particular effort in the early breeding season.';

      await queryInterface.sequelize.query(`UPDATE Conditions SET condition = ? WHERE id = 4;`, {
        replacements: [updatedCondition1],
        type: Sequelize.QueryTypes.UPDATE,
      });
    },
  };
}
