/* eslint-disable unicorn/prefer-module */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // prettier-ignore
    // eslint-disable-next-line prefer-destructuring
    const Op = Sequelize.Op
    await queryInterface.bulkDelete('Advisories', {id: {[Op.in]: [9]}});
  },
  down: async (queryInterface) => {
    // prettier-ignore
    await queryInterface.bulkInsert('Advisories', [
      {
        id: 9,
        advisory:
          'It is the responsibility of the licence holder to ensure that all contact details are up to date. Not advising NatureScot of changes to licence holder contact details could result in the licence being revoked.',
        orderNumber: 9,
        default: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
};
