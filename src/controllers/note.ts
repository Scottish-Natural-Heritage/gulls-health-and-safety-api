import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {Note} = database;

/**
 * Local interface of the application.
 */
interface NoteInterface {
  ApplicationId: number;
  Note: string;
  createdBy: string;
}

const NoteController = {
  findOne: async (id: number) => {
    return Note.findByPk(id);
  },

  findAll: async () => {
    return Note.findAll();
  },

  findAllApplicationNotes: async (id: number) => {
    return Note.findAll({where: {ApplicationId: id}});
  },

  /**
   * The create function writes the incoming Note to the appropriate database tables.
   *
   * @param {any } applicationId The application that the Note will be based on.
   * @param {any | undefined} incomingNote The Note details.
   * @returns {any} Returns newNote, the newly created Note.
   */
  create: async (applicationId: any, incomingNote: any) => {
    let newNote;
    // Start a transaction.
    await database.sequelize.transaction(async (t: transaction) => {
      incomingNote.ApplicationId = applicationId;

      // Add the Note to the DB.
      newNote = await Note.create(incomingNote, {transaction: t});
    });

    // If all went well and we have a new application return it.
    if (newNote) {
      return newNote as NoteInterface;
    }

    // If no new application was added to the DB return undefined.
    return undefined;
  },
};

export {NoteController as default};
export {NoteInterface};
