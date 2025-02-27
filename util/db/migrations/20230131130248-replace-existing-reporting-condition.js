/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Grab the condition as a object.
    const condition1 = await queryInterface.sequelize.query('SELECT * FROM gulls."Conditions" WHERE "id" = 11;', {
      type: Sequelize.QueryTypes.SELECT,
    });

    // Mark it as deleted.
    condition1[0].deletedAt = new Date();

    await queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "deletedAt" = ? WHERE "id" = ?;`, {
      replacements: [condition1[0].deletedAt, condition1[0].id],
      type: Sequelize.QueryTypes.UPDATE,
    });

    // Grab the condition as a object.
    const condition2 = await queryInterface.sequelize.query('SELECT * FROM gulls."Conditions" WHERE "id" = 18;', {
      type: Sequelize.QueryTypes.SELECT,
    });

    // Mark it as deleted.
    condition2[0].deletedAt = new Date();

    await queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "deletedAt" = ? WHERE "id" = ?;`, {
      replacements: [condition2[0].deletedAt, condition2[0].id],
      type: Sequelize.QueryTypes.UPDATE,
    });

    await queryInterface.bulkInsert('Conditions', [
      {
        id: 28,
        condition:
          'You must provide these details as activity, site and final returns to NatureScot within one month of this licence expiring or otherwise coming to an end.',
        orderNumber: 28,
        default: true,
        category: 'Recording and reporting requirements',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    // eslint-disable-next-line prefer-destructuring
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Conditions', {id: {[Op.in]: [28]}}, {truncate: true});

    // Grab the condition as a object.
    const condition2 = await queryInterface.sequelize.query('SELECT * FROM gulls."Conditions" WHERE "id" = 18;', {
      type: Sequelize.QueryTypes.SELECT,
    });

    // Mark it as no longer deleted.
    condition2[0].deletedAt = null;

    await queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "deletedAt" = ? WHERE "id" = ?;`, {
      replacements: [condition2[0].deletedAt, condition2[0].id],
      type: Sequelize.QueryTypes.UPDATE,
    });

    // Grab the condition as a object.
    const condition1 = await queryInterface.sequelize.query('SELECT * FROM gulls."Conditions" WHERE "id" = 11;', {
      type: Sequelize.QueryTypes.SELECT,
    });

    // Mark it as no longer deleted.
    condition1[0].deletedAt = null;

    await queryInterface.sequelize.query(`UPDATE gulls."Conditions" SET "deletedAt" = ? WHERE "id" = ?;`, {
      replacements: [condition1[0].deletedAt, condition1[0].id],
      type: Sequelize.QueryTypes.UPDATE,
    });
  },
};
