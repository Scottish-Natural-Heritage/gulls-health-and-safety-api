import database from '../models/index.js';

const {Measure} = database;

const MeasureController = {
  findOne: async (id: number) => {
    return Measure.findByPk(id);
  },

  findAll: async () => {
    return Measure.findAll();
  },
}

export {MeasureController as default};
