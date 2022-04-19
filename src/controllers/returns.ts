import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {Returns, ReturnSpecies, ReturnActivity} = database;

interface SpeciesIds {
  HerringGullId: number | undefined;
  BlackHeadedGullId: number | undefined;
  CommonGullId: number | undefined;
  GreatBlackBackedGullId: number | undefined;
  LesserBlackBackedGullId: number | undefined;
}

const ReturnsController = {
  findOne: async (id: number) => {
    return Returns.findByPk(id, {paranoid: false,
    include: [
      {
        model: ReturnSpecies,
        as: 'ReturnSpecies',
        paranoid: false,
        include: [
          {
            model: ReturnActivity,
            as: 'ReturnHerringGull',
            paranoid: false,
          },
          {
            model: ReturnActivity,
            as: 'ReturnBlackHeadedGull',
            paranoid: false,
          },
          {
            model: ReturnActivity,
            as: 'ReturnCommonGull',
            paranoid: false,
          },
          {
            model: ReturnActivity,
            as: 'ReturnGreatBlackBackedGull',
            paranoid: false,
          },
          {
            model: ReturnActivity,
            as: 'ReturnLesserBlackBackedGull',
            paranoid: false,
          },
        ],
      },
    ]})
  },

  findAll: async () => {
    return Returns.findAll();
  },
}
