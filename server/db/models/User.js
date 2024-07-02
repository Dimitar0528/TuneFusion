import { Model, DataTypes } from "sequelize";
import { sequelizeInstance } from "../connection.js";

class User extends Model {
}

User.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.CHAR,
      defaultValue: null,
    },
    first_name: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    last_name: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    gender: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    is_subscribed_to_newsletter: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeInstance, // Pass the initialized sequelize connection
    modelName: "User",
    tableName: "users",
  }
);

export default User;
