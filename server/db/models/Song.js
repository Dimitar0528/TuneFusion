import { Model, DataTypes } from "sequelize";
import { sequelizeInstance } from "../connection.js";

class Song extends Model { }

Song.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img_src: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    audio_src: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    sequelize: sequelizeInstance,
    modelName: "Song",
    tableName: "songs",
  }
);

export default Song