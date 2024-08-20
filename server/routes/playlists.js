import express from 'express';
const router = express.Router();
import { PlayList, PlaylistSong, Song, User } from '../db/models/index.js'
import { Sequelize } from 'sequelize';
import { searchMusics } from 'node-youtube-music';

router.post('/create-playlist', async (req, res) => {
    const { name, description, created_by, img_src } = req.body;
    const uuid = crypto.randomUUID();
    const user = await User.findOne({
        where: Sequelize.where(
            Sequelize.fn('LEFT', Sequelize.col('uuid'), 6),
            created_by
        ),
    });
    try {
        const existingPlaylist = await PlayList.findOne({
            where: {
                name,
                created_by: user.uuid
            }
        });

        if (existingPlaylist) {
            return res.status(400).json({ error: 'You have already created a playlist with the same name!' });
        }

        await PlayList.create({
            uuid,
            name,
            description,
            created_by: user.uuid,
            img_src: img_src || null
        })
        res.status(200).json({ message: 'Playlist created successfully!' })

    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).json({ error: 'There was an error while trying to create the playlist!' });

    }
})

router.delete('/delete-playlist/:playlistUUID', async (req, res) => {
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

router.get('/:userUUID', async (req, res) => {
    const userUUID = req.params.userUUID;
    try {
        const playlists = await PlayList.findAll({
            where: Sequelize.where(
                Sequelize.fn('LEFT', Sequelize.col('created_by'), 6),
                userUUID
            ),

            include: [
                {
                    model: Song,

                    through: {
                        model: PlaylistSong,
                        attributes: ['createdAt'],
                    },

                }
            ],
            order: [
                ['createdAt', 'DESC'],
                [Song, PlaylistSong, 'createdAt', 'DESC']],
        });
        const user = await User.findOne({
            where: Sequelize.where(
                Sequelize.fn('LEFT', Sequelize.col('uuid'), 6),
                userUUID
            ),
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }
        if (!playlists) {
            return res.status(404).json({ error: "User does not have associated playlists!" });
        }

        res.status(200).json(playlists);
    } catch (error) {
        console.error("Error fetching playlists:", error);
        res.status(500).json({ error: "There was an error while trying to fetch playlists!" });
    }
});

router.put('/update-playlist/:playlistName', async (req, res) => {
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
                description: body.description || playlist.description,
                img_src: body.img_src || playlist.img_src,
            },
            { where: { uuid: playlist.uuid } }
        );

        return res.status(200).json({ message: "Playlist updated successfully!" });
    } catch (error) {
        console.error('Error updating playlist:', error);
        return res.status(500).json({ error: "There was an error while trying to update the playlist data!" });
    }
})

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

router.post('/addExternalSong', async (req, res) => {
    try {
        const { playlistName, created_by, userRole, ...songs } = req.body;

        const songsToAdd = await Promise.all(
            Object.values(songs).map(async (externalSong) => {
                const { name, artistNames, albumImage: img_src } = externalSong;

                // Check if the song already exists in the database
                const existingSong = await Song.findOne({
                    where: {
                        name: name,
                        artist: artistNames
                    }
                });

                if (!existingSong) {
                    const [firstSong] = await searchMusics(`${name} ${artistNames.split(', ')[0]}`);

                    if (!firstSong) {
                        return res.status(404).json({ error: 'Specific song not found' });
                    }

                    const { youtubeId, duration } = firstSong;
                    return {
                        name,
                        artist: artistNames,
                        img_src,
                        audio_src: `https://www.youtube.com/watch?v=${youtubeId}`,
                        duration: duration.totalSeconds
                    };
                }

                return existingSong;
            })
        );

        // Filter out null values (songs not found) and segregate new and existing songs
        const newSongs = songsToAdd.filter(song => song && !song.uuid);
        const existingSongs = songsToAdd.filter(song => song && song.uuid);

        if (userRole === 'admin' && newSongs.length > 0) {
            const addedSongs = await Song.bulkCreate(newSongs);
            existingSongs.push(...addedSongs);
        }

        console.log('Songs added to the database:', newSongs);

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
                    const playlistSongsData = songsToAddToPlaylist.map(song => ({
                        song_uuid: song.uuid,
                        playlist_uuid: playlist.uuid
                    }));

                    // Add only the new songs to the playlist
                    await PlaylistSong.bulkCreate(playlistSongsData);

                    if (userRole !== 'admin') {
                        return res.status(422).json({ warn: 'Some of the songs were not added because they are not inside our database yet!' });
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



router.delete('/remove-song', async (req, res) => {
    const { songUUID, playlistName, userUUID } = req.body;
    try {
        const playlist = await PlayList.findOne({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('LEFT', Sequelize.col('created_by'), 6), userUUID),
                    { name: playlistName }
                ]
            }
        });
        const result = await PlaylistSong.destroy({
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
