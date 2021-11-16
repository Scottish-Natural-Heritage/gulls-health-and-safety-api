module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Applications', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      LicenceHolderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Contacts',
          key: 'id',
        },
      },
      LicenceApplicantId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Contacts',
          key: 'id',
        },
      },
      LicenceHolderAddressId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Addresses',
          key: 'id',
        },
      },
      SiteAddressId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Addresses',
          key: 'id',
        },
      },
      SpeciesId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Species',
          key: 'id',
        },
      },
      isResidentialSite: {
        type: Sequelize.BOOLEAN,
      },
      siteType: {
        type: Sequelize.STRING,
      },
      previousLicenceNumber: {
        type: Sequelize.STRING,
      },
      supportingInformation: {
        type: Sequelize.STRING,
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Applications');
  },
};
