module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Species', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      HerringGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Activities',
          key: 'id',
        },
      },
      BlackHeadedGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Activities',
          key: 'id',
        },
      },
      CommonGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Activities',
          key: 'id',
        },
      },
      GreatBlackBackedGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Activities',
          key: 'id',
        },
      },
      LesserBlackBackedGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Activities',
          key: 'id',
        },
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
    await queryInterface.dropTable('Species');
  },
};
