/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Grab the condition as a object.
    const conditionF = await queryInterface.sequelize.query('SELECT * FROM gulls."Conditions" WHERE "id" = 6;', {
      type: Sequelize.QueryTypes.SELECT,
    });

    // Mark it as deleted.
    conditionF[0].deletedAt = new Date();

    await queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "deletedAt" = ? WHERE "id" = ?;`, {
      replacements: [conditionF[0].deletedAt, conditionF[0].id],
      type: Sequelize.QueryTypes.UPDATE,
    });

    await queryInterface.bulkInsert('Conditions', [
      {
        id: 29,
        condition:
          'You must destroy any eggs before disposing of them. If any eggs are found to be in the process of hatching, these can only be humanely dispatched or taken to a wildlife rehabilitation centre if you have a licence to kill or relocate chicks. If you do not have a licence to kill or relocate chicks, please request an amendment before carrying out any further work by emailing licensing@nature.scot.',
        orderNumber: 6,
        default: false,
        category: 'What you must do',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // eslint-disable-next-line prefer-destructuring
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Conditions', {id: {[Op.in]: [29]}}, {truncate: true});

    // Grab the condition as a object.
    const conditionF = await queryInterface.sequelize.query('SELECT * FROM gulls."Conditions" WHERE "id" = 6;', {
      type: Sequelize.QueryTypes.SELECT,
    });

    // Mark it as no longer deleted.
    conditionF[0].deletedAt = null;

    await queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "deletedAt" = ? WHERE "id" = ?;`, {
      replacements: [conditionF[0].deletedAt, conditionF[0].id],
      type: Sequelize.QueryTypes.UPDATE,
    });
  },
};
