import { Model, DataTypes } from "sequelize";
import { sequelizeInstance } from "../connection.js";
import User from "./User.js";

class PlayList extends Model { }

PlayList.init(
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
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        img_src: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        visibility: {
            type: DataTypes.ENUM('public', 'private'),
            allowNull: false,
        },
        created_by: {
            type: DataTypes.STRING,
            references: {
                model: User,
                key: "name",
            },
        }, 
        liked_by: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
    },
    {
        sequelize: sequelizeInstance,
        modelName: "PlayList",
        tableName: "playlists",
    }
);

export default PlayList;
