'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Applications', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      licenceHolderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Contacts',
          key: 'id'
        }
      },
      licenceApplicantId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Contacts',
          key: 'id'
        }
      },
      licenceHolderAddressId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Addresses',
          key: 'id'
        }
      },
      siteAddressId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Addresses',
          key: 'id'
        }
      },
      speciesId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Species',
          key: 'id'
        }
      },
      isResidentialSite: {
        type: Sequelize.BOOLEAN
      },
      siteType: {
        type: Sequelize.STRING
      },
      previousLicenceNumber: {
        type: Sequelize.STRING
      },
      supportingInformation: {
        type: Sequelize.STRING
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Applications');
  }
};
