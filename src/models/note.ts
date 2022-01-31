import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the Note.
 */
interface NoteInterface {
  id?: number;
  ApplicationId?: number;
  Note?: string;
  createdBy?: string;
}

/**
 * Build a Note model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Note model.
 */
const NoteModel = (sequelize: Sequelize) => {
  class Note extends Model {
    public id!: number;
    public ApplicationId!: number;
    public Note!: string;
    public createdBy!: string;
  }

  Note.init(
    {
      Note: {
        type: DataTypes.TEXT,
      },
      createdBy: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Note',
      timestamps: true,
      paranoid: true,
    },
  );

  return Note;
};

export {NoteModel as default};
export {NoteInterface};
