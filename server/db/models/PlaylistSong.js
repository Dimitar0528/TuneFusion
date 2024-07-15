import { Model, DataTypes } from "sequelize";
import { sequelizeInstance } from "../connection.js";
import Song from "./Song.js";
import PlayList from "./PlayList.js";
class PlaylistSong extends Model { }

PlaylistSong.init(
    {
        playlist_uuid: {
            type: DataTypes.UUID,
            references: {
                model: PlayList,
                key: "uuid",
            },
            allowNull: false,
        },
        song_uuid: {
            type: DataTypes.UUID,
            references: {
                model: Song,
                key: "uuid",
            },
            allowNull: false,
        },
    },
    {
        updatedAt: false,
        sequelize: sequelizeInstance,
        modelName: "PlaylistSong",
    }
);

export default PlaylistSong;
