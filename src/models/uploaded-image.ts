import {DataTypes, Model, type Sequelize} from 'sequelize';

const UploadedImageModel = (sequelize: Sequelize) => {
  class UploadedImage extends Model {
    public id!: number;
    public ApplicationId!: number;
    public filename!: string;
    public uuid!: string;
  }

  UploadedImage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ApplicationId: {
        type: DataTypes.NUMBER,
        references: {
          model: 'Applications',
          key: 'id',
        },
      },
      filename: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'UploadedImage',
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  return UploadedImage;
};

export {UploadedImageModel as default};
