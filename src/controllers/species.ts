import database from '../models/index.js';

const {Species, Activity} = database;

const SpeciesController = {
  findOne: async (id: number) => {
    return Species.findByPk(id);
  },

  findAll: async () => {
    return Species.findAll(
      {
        include: [
          {
            model: Activity,
            as: 'HerringGull'
          },
          {
            model: Activity,
            as: 'BlackHeadedGull'
          },
          {
            model: Activity,
            as: 'CommonGull'
          },
          {
            model: Activity,
            as: 'GreatBlackBlackedGull'
          },
          {
            model: Activity,
            as: 'LesserBlackBlackedGull'
          }
        ]
      }
    );
  },
}

export {SpeciesController as default};
