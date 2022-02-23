/* eslint-disable unicorn/prefer-module */
module.exports = {
  up: async (queryInterface) => {
    // prettier-ignore
    await queryInterface.bulkInsert('Conditions', [
      {
        id: 16,
        condition:
          'You must keep details of actions you or your representative take under this licence throughout the licence period.',
        orderNumber: 16,
        default: true,
        category: 'Recording and reporting requirements',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 17,
        condition:
          'You need to capture details of all the preventative measures employed including what method you used, the frequency and any success it has had.',
        orderNumber: 17,
        default: true,
        category: 'Recording and reporting requirements',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 18,
        condition:
          'You must provide these details to NatureScot within one month of this licence expiring or otherwise coming to an end.',
        orderNumber: 18,
        default: true,
        category: 'Recording and reporting requirements',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 19,
        condition: 'You must record the number of nests destroyed as well as the dates on which they were destroyed.',
        orderNumber: 19,
        default: false,
        category: 'Recording and reporting requirements',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 20,
        condition: 'You must record the number of eggs destroyed as well as the dates on which they were destroyed.',
        orderNumber: 20,
        default: false,
        category: 'Recording and reporting requirements',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 21,
        condition: 'You must record the number of eggs destroyed as well as the dates on which they were destroyed.',
        orderNumber: 21,
        default: false,
        category: 'Recording and reporting requirements',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 22,
        condition: 'You must record the number of chicks taken to wildlife rescue centre and method used to take them.',
        orderNumber: 22,
        default: false,
        category: 'Recording and reporting requirements',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 23,
        condition: 'You must record the number of chicks taken and relocated nearby and method used to take them.',
        orderNumber: 23,
        default: false,
        category: 'Recording and reporting requirements',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 24,
        condition:
          'You must record the number of chicks killed as well as the dates they were killed and the methods you used.',
        orderNumber: 24,
        default: false,
        category: 'Recording and reporting requirements',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 25,
        condition:
          'You must record the number of adults killed as well as the dates they were killed and the methods you used.',
        orderNumber: 25,
        default: false,
        category: 'Recording and reporting requirements',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 26,
        condition: 'If you no longer require this licence, submit a final return, even if it is a nil return.',
        orderNumber: 26,
        default: true,
        category: 'General',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    // prettier-ignore
    // eslint-disable-next-line prefer-destructuring
    const Op = Sequelize.Op
    await queryInterface.bulkDelete(
      'Conditions',
      {id: {[Op.in]: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25]}},
      {truncate: true},
    );
  },
};
