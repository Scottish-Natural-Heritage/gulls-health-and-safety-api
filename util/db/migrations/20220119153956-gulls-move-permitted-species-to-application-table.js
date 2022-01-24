/* eslint-disable unicorn/prefer-module */
const databaseConfig = require('../database.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // We're doing a fetch then delete operation, so wrap the whole process in a
    // transaction.
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Get all the constraints on the Licenses table.
      const references = await queryInterface.getForeignKeyReferencesForTable('Licenses');

      // The getForeignKeyReferencesForTable method isn't 'queryable' so we run
      // the filter in JS instead.
      // eslint-disable-next-line unicorn/prefer-array-find
      const ourConstraints = references.filter((constraint) => {
        return (
          constraint.tableName === 'Licenses' &&
          constraint.columnName === 'PermittedSpeciesId' &&
          constraint.referencedTableName === 'PermittedSpecies' &&
          constraint.referencedColumnName === 'id'
        );
      });

      // Remove the foreign key constraint.
      const fkConstraintName = ourConstraints[0].constraintName;

      if (fkConstraintName !== undefined) {
        await queryInterface.removeConstraint('Licenses', fkConstraintName);
      }

      // Remove the column from the table
      await queryInterface.removeColumn(
        {
          schema: databaseConfig.database.schema,
          tableName: 'Licenses',
        },
        'PermittedSpeciesId',
      );

      await queryInterface.addColumn(
        {
          schema: databaseConfig.database.schema,
          tableName: 'Applications',
        },
        'PermittedSpeciesId',
        Sequelize.INTEGER,
      );

      await queryInterface.addConstraint('Applications', {
        type: 'foreign key',
        fields: ['PermittedSpeciesId'],
        references: {
          table: 'PermittedSpecies',
          field: 'id',
        },
      });

      // Remember to commit our changes.
      await transaction.commit();
    } catch (error) {
      // If something has gone wrong undo everything we've done up to
      // this point.
      await transaction.rollback();
      throw error;
    }
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Get all the constraints on the Licenses table.
      const references = await queryInterface.getForeignKeyReferencesForTable('Applications');

      // The getForeignKeyReferencesForTable method isn't 'queryable' so we run
      // the filter in JS instead.
      // eslint-disable-next-line unicorn/prefer-array-find
      const ourConstraints = references.filter((constraint) => {
        return (
          constraint.tableName === 'Applications' &&
          constraint.columnName === 'PermittedSpeciesId' &&
          constraint.referencedTableName === 'PermittedSpecies' &&
          constraint.referencedColumnName === 'id'
        );
      });

      // Remove the foreign key constraint.
      const fkConstraintName = ourConstraints[0].constraintName;

      if (fkConstraintName !== undefined) {
        await queryInterface.removeConstraint('Applications', fkConstraintName);
      }

      // Remove the column from the table
      await queryInterface.removeColumn(
        {
          schema: databaseConfig.database.schema,
          tableName: 'Applications',
        },
        'PermittedSpeciesId',
      );

      await queryInterface.addColumn(
        {
          schema: databaseConfig.database.schema,
          tableName: 'Licenses',
        },
        'PermittedSpeciesId',
        Sequelize.INTEGER,
      );

      await queryInterface.addConstraint('Licenses', {
        type: 'foreign key',
        fields: ['PermittedSpeciesId'],
        references: {
          table: 'PermittedSpecies',
          field: 'id',
        },
      });

      await transaction.commit();
    } catch (error) {
      // If something has gone wrong undo everything we've done up to
      // this point.
      await transaction.rollback();
      throw error;
    }
  },
};
