/* eslint-disable unicorn/prefer-module */
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Conditions', [
      {
        id: 27,
        condition: 'You must provide an activity or site return immediately after each site visit.',
        orderNumber: 27,
        default: false,
        category: 'Recording and reporting requirements',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    // eslint-disable-next-line prefer-destructuring
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Conditions', {id: {[Op.in]: [27]}}, {truncate: true});
  },
};
