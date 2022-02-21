/* eslint-disable unicorn/prefer-module */

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    up: async (queryInterface, Sequelize) => {
      // Grab the condition as a object.
      const condition = await queryInterface.sequelize.query('SELECT * FROM gulls."Conditions" WHERE "id" = 10;', {
        type: Sequelize.QueryTypes.SELECT,
      });

      // Mark it as deleted.
      condition[0].deletedAt = new Date();

      await queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "deletedAt" = ? WHERE "id" = ?;`, {
        replacements: [condition[0].deletedAt, condition[0].id],
        type: Sequelize.QueryTypes.UPDATE,
      });
    },
    down: async (queryInterface, Sequelize) => {
      // For the opposite set all expiry date values to null.
      await queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "deletedAt" = null;`, {
        type: Sequelize.QueryTypes.UPDATE,
      });
    },
  };
} else {
  module.exports = {
    up: async (queryInterface, Sequelize) => {
      // Grab the condition as a object.
      const condition = await queryInterface.sequelize.query('SELECT * FROM Conditions WHERE id = 10;', {
        type: Sequelize.QueryTypes.SELECT,
      });

      // Mark it as deleted.
      condition[0].deletedAt = new Date();

      await queryInterface.sequelize.query(`UPDATE Conditions SET deletedAt = ? WHERE id = ?;`, {
        replacements: [condition[0].deletedAt, condition[0].id],
        type: Sequelize.QueryTypes.UPDATE,
      });
    },
    down: async (queryInterface, Sequelize) => {
      // For the opposite set all expiry date values to null.
      await queryInterface.sequelize.query(`UPDATE Conditions SET deletedAt = null;`, {
        type: Sequelize.QueryTypes.UPDATE,
      });
    },
  };
}
