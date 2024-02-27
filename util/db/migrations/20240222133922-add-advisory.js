/* eslint-disable unicorn/prefer-module */
module.exports = {
  up: async (queryInterface) => {
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
  down: async (queryInterface) => {
    await queryInterface.dropTable('Advisories');
  },
};
