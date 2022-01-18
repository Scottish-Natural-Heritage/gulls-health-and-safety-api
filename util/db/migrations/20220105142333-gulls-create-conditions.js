/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Conditions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      condition: {
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

    // Fill the Conditions meta-table
    await queryInterface.bulkInsert('Conditions', [
      {
        id: 1,
        condition:
          'This licence only authorises where there is no other satisfactory course of action: the species, activities and numbers listed on this licence, at the location specified and during the period stated on this licence.',
        orderNumber: 1,
        default: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        condition:
          'It is your responsibility, as the licence holder, to ensure that works are appropriately coordinated so that the numbers permitted is not exceeded.',
        orderNumber: 2,
        default: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        condition:
          'You must thoroughly clean potential nesting material and debris from nesting areas at the start of the nesting season or immediately upon receipt of this licence.',
        orderNumber: 3,
        default: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        condition:
          'You must carry out nest and egg clearance and/or egg pricking/egg oiling/use of dummy eggs once a fortnight at a minimum, but preferably once a week. You should make particular effort in the early breeding season.',
        orderNumber: 4,
        default: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        condition:
          'At the beginning of the nesting season, particularly in the early breeding season, you must use human presence, or other means, to scare birds from nesting areas.',
        orderNumber: 5,
        default: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        condition:
          'If you remove eggs under this licence, which are in the process of hatching, you must humanely destroy them before disposal.',
        orderNumber: 6,
        default: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        condition:
          'You must use the most humane methods to kill or take any gull chick or adult that will have the least impact.',
        orderNumber: 7,
        default: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        condition:
          'You must employ non-licensable measures first. If these are unsuccessful, then you must use a hierarchical approach to licensed control: clearance of nests, then; destruction or replacement of eggs, then; taking of chicks, then; killing of chicks, then; killing of adults - only where each activity is permitted under this licence.',
        orderNumber: 8,
        default: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 9,
        condition:
          'You must implement preventative measures as detailed in the Statement of Reason Test 2 (detailed below) as soon as possible and by the end date of this licence. You must provide details of the preventative measures implemented on the licence return.',
        orderNumber: 9,
        default: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 10,
        condition:
          'You must keep details of actions you or your representative take under this licence throughout the licence period including the number of: nests destroyed and the dates on which they were destroyed; eggs destroyed and the dates on which they were destroyed; eggs oiled, pricked or replaced with dummy eggs; chicks taken to wildlife rescue centre and method used to take them; chicks taken and relocated nearby and method used to take them; chicks killed and dates killed and methods used to take and kill them; adults killed, dates killed and methods used to take and kill; details of all preventative measures employed including what method is used, frequency and any success it has had.',
        orderNumber: 10,
        default: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 11,
        condition:
          'You must provide these details to NatureScot within one month of this licence expiring or otherwise coming to an end.',
        orderNumber: 11,
        default: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 12,
        condition:
          'This licence permits the use of semi-automatic weapons but does not permit the use of any other firearm prohibited by section 5 of the Wildlife and Countryside Act 1981 (see Advisory notes below).',
        orderNumber: 12,
        default: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 13,
        condition:
          'Some birds may be found to bear leg-rings or other unique marks. You must report details of any such markings and the date and place of shooting/taking to the British Trust for Ornithology. You will find instructions for doing this at http://blx1.bto.org/euring/lang/pages/rings.jsp?country=EN',
        orderNumber: 13,
        default: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 14,
        condition: 'You may appoint agents to operate under the terms of this licence.',
        orderNumber: 14,
        default: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 15,
        condition:
          'While engaged in work authorised by this licence, you and any agents you appoint must be able to produce a copy of this licence to any Police Officer, authorised person, or official of NatureScot on demand.',
        orderNumber: 15,
        default: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Conditions', {}, {truncate: true});
    await queryInterface.dropTable('Conditions');
  },
};
