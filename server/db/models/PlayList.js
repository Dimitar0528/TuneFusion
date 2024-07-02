import { Model, DataTypes } from "sequelize";
import { sequelizeInstance } from "../connection.js";

class PlayList extends Model { }

PlayList.init(
    {
        playlist_uuid: {
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
        user_uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,

            references: {
                model: User,
                key: "uuid",
            },
        },
        
    },
    {
        sequelize: sequelizeInstance,
        modelName: "PlayList",
        tableName: "playlists",
    }
);

export default Song