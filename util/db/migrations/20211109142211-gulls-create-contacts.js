module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Contacts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
        },
      },
      organisation: {
        type: Sequelize.STRING,
      },
      emailAddress: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      phoneNumber: {
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
    await queryInterface.dropTable('Contacts');
  },
};
