/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Advisories', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      advisory: {
        type: Sequelize.TEXT,
      },
      orderNumber: {
        type: Sequelize.INTEGER,
      },
      default: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });

    // Fill the Advisories meta-table
    await queryInterface.bulkInsert('Advisories', [
      {
        id: 1,
        advisory: 'Each rebuild of a nest site is counted as a separate nest.',
        orderNumber: 1,
        default: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        advisory:
          'Gull nests that are not in use or being built are not protected and their clearance does not require a licence and therefore do not count in the permitted numbers of this licence.',
        orderNumber: 2,
        default: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        advisory:
          'This licence is granted subject to compliance with the conditions as specified. Anything done otherwise than in accordance with the terms of this licence may constitute an offence.',
        orderNumber: 3,
        default: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        advisory:
          'Agents may work independently. It is your responsibility to ensure that agents have the appropriate training and experience and that they understand the terms and conditions of this licence.',
        orderNumber: 4,
        default: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        advisory: 'Nothing in this licence shall confer any right of entry on to land or property.',
        orderNumber: 5,
        default: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        advisory: 'This licence may be modified or revoked at any time by NatureScot.',
        orderNumber: 6,
        default: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        advisory:
          'Methods of killing prohibited under section 5 of the Wildlife and Countryside Act 1981 include: automatic weapons and shotguns with a barrel that has an internal diameter at the mule of more than one and three-quarter inches.',
        orderNumber: 7,
        default: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        advisory:
          'This licence only permits the activities specified in the Permitted activities of this licence. It does not permit any other actions that would otherwise be illegal.',
        orderNumber: 8,
        default: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Advisories', {}, {truncate: true});
    await queryInterface.dropTable('Advisories');
  },
};
