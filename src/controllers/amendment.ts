import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';
import config from '../config/app';

const {
  Amendment,
  ASpecies,
  AActivity,
  AmendCondition,
  AmendAdvisory,
} = database;

interface SpeciesIds {
  HerringGullId: number | undefined;
  BlackHeadedGullId: number | undefined;
  CommonGullId: number | undefined;
  GreatBlackBackedGullId: number | undefined;
  LesserBlackBackedGullId: number | undefined;
}

interface AmendmentInterface {

}

const AmendmentController = {
  /**
   * This function returns a single amendment by ID.
   *
   * @param {number} id The primary key of the desired amendment.
   * @returns {any} Returns the amendment.
   */
   findOne: async (id: number) => {
    return Amendment.findByPk(id, {
      paranoid: false,
      include: [
        {
          model: ASpecies,
          as: 'ASpecies',
          paranoid: false,
          include: [
            {
              model: AActivity,
              as: 'AHerringGull',
              paranoid: false,
            },
            {
              model: AActivity,
              as: 'ABlackHGull',
              paranoid: false,
            },
            {
              model: AActivity,
              as: 'ACommonGull',
              paranoid: false,
            },
            {
              model: AActivity,
              as: 'AGreatBBGull',
              paranoid: false,
            },
            {
              model: AActivity,
              as: 'ALesserBBGull',
              paranoid: false,
            },
          ],
        },
        {
          model: AmendCondition,
          as: 'AmendConditions',
        },
        {
          model: AmendAdvisory,
          as: 'AmendAdvisories',
        },
      ],
    });
  },

  /**
   * This function gets all amendments from the database.
   *
   * @returns {any} Returns all amendments.
   */
  findAll: async () => {
    return Amendment.findAll();
  },


}

export {AmendmentController as default};
export {AmendmentInterface};
