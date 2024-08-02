/* eslint-disable unicorn/prefer-module */

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    up: async (queryInterface, Sequelize) => {
      // prettier-ignore
      const updatedAdvisory1 =
        'This licence is granted subject to compliance with the conditions as specified. Anything done otherwise than in accordance with the terms of this licence may constitute an offence.';

      await queryInterface.sequelize.query(`UPDATE gulls."Advisories" SET "advisory" = ? WHERE "id" = 3;`, {
        replacements: [updatedAdvisory1],
        type: Sequelize.QueryTypes.UPDATE,
      });
    },

    down: async (queryInterface, Sequelize) => {
      const updatedAdvisory1 =
        'This licence is granted subject to compliance with the conditions as specified. Anything done otherwise than in accordance with the terms of the licence may constitute an offence. It is the responsibility of the licence holder, agents and assistants working under this licence to report to NatureScot any breaches of the licence conditions that they become aware of as soon as is reasonably possible.';

      await queryInterface.sequelize.query(`UPDATE gulls."Advisories" SET "advisory" = ? WHERE "id" = 3;`, {
        replacements: [updatedAdvisory1],
        type: Sequelize.QueryTypes.UPDATE,
      });
    },
  };
} else {
  module.exports = {
    up: async (queryInterface, Sequelize) => {
      // prettier-ignore
      const updatedAdvisory1 =
        'This licence is granted subject to compliance with the conditions as specified. Anything done otherwise than in accordance with the terms of this licence may constitute an offence.';

      await queryInterface.sequelize.query(`UPDATE Advisories SET advisory = ? WHERE id = 3;`, {
        replacements: [updatedAdvisory1],
        type: Sequelize.QueryTypes.UPDATE,
      });
    },

    down: async (queryInterface, Sequelize) => {
      const updatedAdvisory1 =
        'This licence is granted subject to compliance with the conditions as specified. Anything done otherwise than in accordance with the terms of the licence may constitute an offence. It is the responsibility of the licence holder, agents and assistants working under this licence to report to NatureScot any breaches of the licence conditions that they become aware of as soon as is reasonably possible.';

      await queryInterface.sequelize.query(`UPDATE Advisories SET advisory = ? WHERE id = 3;`, {
        replacements: [updatedAdvisory1],
        type: Sequelize.QueryTypes.UPDATE,
      });
    },
  };
}
