import PlayList from './PlayList.js';
import Song from './Song.js';
import PlaylistSong from './PlayListSong.js';
import User from './User.js';

PlayList.belongsToMany(Song, {
    through: PlaylistSong,
    foreignKey: "playlist_uuid",
    otherKey: "song_uuid",
});

Song.belongsToMany(PlayList, {
    through: PlaylistSong,
    foreignKey: "song_uuid",
    otherKey: "playlist_uuid",
});

PlayList.belongsTo(User, { foreignKey: "created_by" });
User.hasMany(PlayList);

export { User, PlayList, Song, PlaylistSong };