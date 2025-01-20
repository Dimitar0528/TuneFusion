import express from 'express';
const router = express.Router();
import { PlayList, PlaylistSong, Song, User } from '../db/models/index.js'
import { sequelizeInstance } from '../db/connection.js';
import { Sequelize } from 'sequelize';
import YTMusic from "ytmusic-api"

const ytmusic = new YTMusic()
await ytmusic.initialize();

router.get('/:userUUID', async (req, res) => {
    const userUUID = req.params.userUUID;
    try {
        const user = await User.findOne({
            where: Sequelize.where(
                Sequelize.fn('LEFT', Sequelize.col('uuid'), 6),
                userUUID
            ),
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        // Fetch playlists created by the user
        const createdPlaylists = await PlayList.findAll({
            where: { created_by: user.name },
            ...getPlaylistIncludeOptions(),
        });

        // Fetch playlists liked by the user
        const likedPlaylists = await PlayList.findAll({
            where: Sequelize.literal(`JSON_CONTAINS(liked_by, '"${user.name}"')`),
            ...getPlaylistIncludeOptions(),
        });

        const combinedPlaylists = [...createdPlaylists, ...likedPlaylists];

        if (combinedPlaylists.length === 0) {
            return res.status(404).json({ error: 'No playlists found for this user!' });
        }

        res.status(200).json(combinedPlaylists);
    } catch (error) {
        console.error('Error fetching playlists:', error);
        res.status(500).json({ error: 'There was an error while trying to fetch playlists!' });
    }
});

const getPlaylistIncludeOptions = () => {
    return {
        include: [
            {
                model: Song,
                attributes: ['uuid', 'name', 'artist', 'duration', 'img_src'],
                through: {
                    model: PlaylistSong,
                    attributes: ['createdAt', 'position'],
                },
            },
        ],
        attributes: {
            exclude: ['updatedAt', 'UserUuid', 'createdAt'],
        },
        order: [
            ['createdAt', 'DESC'],
            [Song, PlaylistSong, 'createdAt', 'DESC'],
        ],
    };
};

router.get('/public-playlists', async (req, res) => {
    const { UI: userUUID } = req.query;
    const user = await User.findOne({
        where: Sequelize.where(
            Sequelize.fn('LEFT', Sequelize.col('uuid'), 6),
            userUUID
        ),
    });
    try {
        const publicPlaylists = await PlayList.findAll({
            where: { visibility: 'public' },
            ...getPlaylistIncludeOptions(),
        });

        const likedSongsPlaylists = await PlayList.findAll({
            where: { name: 'Liked Songs', created_by: user.name },
            ...getPlaylistIncludeOptions(),
        });

        const allPlaylists = [...publicPlaylists, ...likedSongsPlaylists];

        if (!allPlaylists || allPlaylists.length === 0) {
            return res.status(404).json({ error: "No playlists found!" });
        }

        res.status(200).json(allPlaylists);
    } catch (error) {
        console.error('Error fetching playlists:', error);
        res.status(500).json({ error: 'There was an error while trying to fetch the playlists!' });
    }
});

router.post('/', async (req, res) => {
    const { name, description, created_by, img_src, visibility } = req.body;
    const uuid = crypto.randomUUID();
    const user = await User.findOne({
        where: { name: created_by }
    });
    try {
        const existingPlaylist = await PlayList.findOne({
            where: {
                name,
                created_by: user.name
            }
        });

        if (existingPlaylist) {
            return res.status(400).json({ error: 'You have already created a playlist with the same name!' });
        }

        await PlayList.create({
            uuid,
            name,
            description,
            img_src: img_src || null,
            visibility: visibility || 'private',
            created_by: user.name,
        })
        res.status(200).json({ message: 'Playlist created successfully!' })

    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).json({ error: 'There was an error while trying to create the playlist!' });

    }
})

router.post('/like-playlist', async (req, res) => {
    const { playlistUUID, userUUID } = req.body;
    try {
        const user = await User.findOne({
            where: Sequelize.where(
                Sequelize.fn('LEFT', Sequelize.col('uuid'), 6),
                userUUID
            ),
        });

        const playlist = await PlayList.findOne({
            where: { uuid: playlistUUID }
        });

        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        // Add liked_by field to playlist if it doesn't exist
        const likedBy = playlist.liked_by || [];

        if (likedBy.includes(user.name)) {
            return res.status(400).json({ error: 'You have already liked this playlist' });
        }

        await PlayList.update(
            { liked_by: [...likedBy, user.name] },
            { where: { uuid: playlistUUID } }
        );

        res.status(200).json({ message: 'Playlist liked successfully!' });
    } catch (error) {
        console.error('Error liking playlist:', error);
        res.status(500).json({ error: 'Failed to like playlist' });
    }
});

router.post('/add-song', async (req, res) => {
    const { songName, playlistUUID } = req.body;
    try {
        const song = await Song.findOne({
            where: { name: songName }
        });
        const playlist = await PlayList.findByPk(playlistUUID);

        if (!song) {
            return res.status(404).json({ error: 'The requested song could not be found in our database.' });
        }

        if (!playlist) {
            return res.status(404).json({ error: 'Please select an playlist first!' });
        }

        const existingEntry = await PlaylistSong.findOne({
            where: {
                song_uuid: song.uuid,
                playlist_uuid: playlistUUID
            }
        });

        if (existingEntry) {
            return res.status(400).json({ error: 'Song is already in the selected playlist!' });
        }

        await PlaylistSong.create({
            song_uuid: song.uuid,
            playlist_uuid: playlistUUID
        });

        res.status(200).json({ message: 'Song added to playlist successfully!' });
    } catch (error) {
        console.error("Error adding song to playlist:", error);
        res.status(500).json({ error: "There was an error while trying to add the song to the playlist!" });
    }
});

router.post('/playlist/transfer-songs', async (req, res) => {
    try {
        const { playlistName, created_by, userRole, ...songs } = req.body;

        const songsToAdd = await Promise.all(
            Object.values(songs).map(async (externalSong) => {
                const { name, artistNames, albumImage: img_src } = externalSong;

                // Check if the song already exists in the database
                const existingSong = await Song.findOne({
                    where: {
                        name: name,
                        artist: Sequelize.where(
                            Sequelize.fn('SUBSTRING_INDEX', Sequelize.col('artist'), ', ', 1),
                            artistNames.split(', ')[0]
                        )
                    }
                });

                if (!existingSong) {
                    const searchQuery = `${name} ${artistNames.split(', ')[0]}`;
                    const [firstSong] = await ytmusic.searchVideos(searchQuery);

                    if (!firstSong) {
                        console.error("Song not found!");
                        return null;
                    }

                    const { videoId, duration } = firstSong;
                    return {
                        name,
                        artist: artistNames,
                        img_src,
                        audio_src: `https://www.youtube.com/watch?v=${videoId}`,
                        duration: duration,
                    };
                }

                return existingSong;
            })
        );

        // Filter out null values (songs not found) and segregate new and existing songs
        const newSongs = songsToAdd.filter(song => song && !song.uuid);
        const existingSongs = songsToAdd.filter(song => song && song.uuid);

        if (userRole === 'admin' && newSongs.length > 0) {
            const addedSongs = [];

            for (let i = 0; i < newSongs.length; i++) {
                const song = newSongs[i];
                const addedSong = await Song.create(song);
                addedSongs.push(addedSong);
            }

            existingSongs.push(...addedSongs);
        }

        try {
            setTimeout(async () => {
                const playlist = await PlayList.findOne({
                    where: {
                        [Sequelize.Op.and]: [
                            Sequelize.where(
                                Sequelize.fn('LEFT', Sequelize.col('created_by'), 6),
                                created_by
                            ),
                            { name: playlistName }
                        ]
                    }
                });

                const existingPlaylistSongs = await PlaylistSong.findAll({
                    where: {
                        playlist_uuid: playlist.uuid,
                        song_uuid: {
                            [Sequelize.Op.in]: existingSongs.map(song => song.uuid)
                        }
                    },
                    attributes: ['song_uuid']
                });

                const existingSongUUIDs = existingPlaylistSongs.map(playlistSong => playlistSong.song_uuid);

                // Filter out songs that are already in the playlist
                const songsToAddToPlaylist = existingSongs.filter(song => !existingSongUUIDs.includes(song.uuid));

                if (songsToAddToPlaylist.length > 0) {
                    for (let i = 0; i < songsToAddToPlaylist.length; i++) {
                        const song = songsToAddToPlaylist[i];
                        const playlistSongData = {
                            song_uuid: song.uuid,
                            playlist_uuid: playlist.uuid,
                            position: i + 1,
                        };
                        await PlaylistSong.create(playlistSongData);
                    }
                    if (userRole !== 'admin') {
                        return res.status(422).json({ warn: `Some songs couldn't be added because they aren't available in our database yet!` });
                    }
                    return res.status(200).json({ message: 'Playlist transferred successfully' });
                }
            }, 50);

        } catch (error) {
            console.error('Error adding songs to the playlist:', error);
            return res.status(500).json({ error: 'Internal Server Error while adding songs to playlist' });
        }

    } catch (error) {
        console.error('Error processing songs:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:playlistName', async (req, res) => {
    const playListName = req.params.playlistName;
    const body = req.body;
    try {
        const playlist = await PlayList.findOne({ where: { name: playListName } });

        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found!" });
        }

        await PlayList.update(
            {
                name: body.name || playlist.name,
                description: body.description !== undefined ? body.description : playlist.description,
                img_src: body.img_src || playlist.img_src,
                visibility: body.visibility || playlist.visibility
            },
            { where: { uuid: playlist.uuid } }
        );
        const updatedPlaylist = await PlayList.findOne({ where: { uuid: playlist.uuid } });
        const resObj = {
            updatedPlaylist,
            message: "Playlist updated successfully!"
        }
        return res.status(200).json(resObj);
    } catch (error) {
        console.error('Error updating playlist:', error);
        return res.status(500).json({ error: "There was an error while trying to update the playlist data!" });
    }
})

router.patch("/:playlistName/song-positions", async (req, res) => {
    try {
        const { playlistName } = req.params;
        const { updates, userUUID } = req.body;
        const user = await User.findOne({
            where: Sequelize.where(
                Sequelize.fn('LEFT', Sequelize.col('uuid'), 6),
                userUUID
            ),
        });
        const playlist = await PlayList.findOne({
            where: {
                name: playlistName, created_by: user.name
            }
        });
        if (!playlist) {
            return res.status(403).json({ error: "Not authorized to modify this playlist" });
        }

        await sequelizeInstance.transaction(async (t) => {
            for (const update of updates) {
                await PlaylistSong.update(
                    { position: update.position },
                    {
                        where: {
                            song_uuid: update.songUUID,
                            playlist_uuid: playlist.uuid
                        },
                        transaction: t
                    }
                );
            }
        });

        res.json({ message: "Positions updated successfully" });
    } catch (error) {
        console.error("Error updating positions:", error);
        res.status(500).json({ error: "Failed to update positions" });
    }
});

router.delete('/unlike-playlist', async (req, res) => {
    const { playlistUUID, userUUID } = req.body;
    try {
        const user = await User.findOne({
            where: Sequelize.where(
                Sequelize.fn('LEFT', Sequelize.col('uuid'), 6),
                userUUID
            ),
        });
        const playlist = await PlayList.findOne({
            where: { uuid: playlistUUID }
        });

        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        const likedBy = playlist.liked_by || [];
        const updatedLikedBy = likedBy.filter(name => name !== user.name);
        await PlayList.update(
            { liked_by: updatedLikedBy },
            { where: { uuid: playlistUUID } }
        );

        res.status(200).json({ message: 'Playlist unliked successfully!' });
    } catch (error) {
        console.error('Error unliking playlist:', error);
        res.status(500).json({ error: 'Failed to unlike playlist' });
    }
});


router.delete('/:playlistUUID', async (req, res) => {
    const playlistUUID = req.params.playlistUUID;
    try {
        const hasPlayListSongs = await PlaylistSong.findAll({
            where: { playlist_uuid: playlistUUID }
        })
        hasPlayListSongs && (await PlaylistSong.destroy({
            where: { playlist_uuid: playlistUUID },
        }));

        await PlayList.destroy({
            where: { uuid: playlistUUID }
        })
        res.status(200).json({ message: 'Playlist deleted successfully!' })

    } catch (error) {
        console.error('Error deleting playlist:', error);
        res.status(500).json({ error: 'There was an error while trying to delete the playlist!' });

    }

})

router.delete('/remove-song', async (req, res) => {
    const { songUUID, playlistName, userUUID } = req.body;
    try {
        const user = await User.findOne({
            where: Sequelize.where(
                Sequelize.fn('LEFT', Sequelize.col('uuid'), 6),
                userUUID
            ),
        });
        const playlist = await PlayList.findOne({
            where: {
                name: playlistName, created_by: user.name
            }
        });
        await PlaylistSong.destroy({
            where: {
                song_uuid: songUUID,
                playlist_uuid: playlist.uuid
            }
        });
        res.status(200).json({ message: 'Song removed from playlist successfully!' });
    } catch (error) {
        console.error('Error removing song from playlist:', error);
        res.status(500).json({ error: 'There was an error while trying to remove the song from the playlist!' });
    }
});


export default router;
