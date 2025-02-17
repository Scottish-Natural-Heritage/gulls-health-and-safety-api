import database from '../models/index.js';

const {UploadedImage} = database;

const AddressController = {
  findOne: async (id: number) => {
    return UploadedImage.findByPk(id);
  },

  findAll: async () => {
    return UploadedImage.findAll();
  },

  create: async (applicationId: number, filename: string) => {
    return UploadedImage.create({ApplicationId: applicationId, filename});
  },

  delete: async (id: number) => {
    return UploadedImage.destroy({where: {id}});
  },
};

export {AddressController as default};
