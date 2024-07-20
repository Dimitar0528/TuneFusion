import express from 'express';
const router = express.Router();
import { PlayList, PlaylistSong, Song, User } from '../db/models/index.js'
import { Sequelize } from 'sequelize';

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
        res.status(500).json({ error: 'Error creating playlist!' });

    }
})
router.get('/:user_uuid', async (req, res) => {
    const userUUID = req.params.user_uuid;
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
            return res.status(404).json({ error: 'User not found' });
        }
        if (!playlists) {
            return res.status(404).json({ error: "Playlists not found" });
        }

        res.status(200).json(playlists);
    } catch (error) {
        console.error("Error fetching playlists:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/add-song', async (req, res) => {
    const { songUUID, playlistUUID } = req.body;
    try {
        const song = await Song.findByPk(songUUID);
        const playlist = await PlayList.findByPk(playlistUUID);

        if (!song) {
            return res.status(404).json({ error: 'Song not found' });
        }

        if (!playlist) {
            return res.status(404).json({ error: 'Please select an playlist first' });
        }

        const existingEntry = await PlaylistSong.findOne({
            where: {
                song_uuid: songUUID,
                playlist_uuid: playlistUUID
            }
        });

        if (existingEntry) {
            return res.status(400).json({ error: 'Song is already in the playlist' });
        }

        await PlaylistSong.create({
            song_uuid: songUUID,
            playlist_uuid: playlistUUID
        });

        res.status(200).json({ message: 'Song added to playlist successfully' });
    } catch (error) {
        console.error("Error adding song to playlist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete('/remove-song', async (req, res) => {
    const { songUUID, playlistName } = req.body;

    try {
        const playlist = await PlayList.findOne({
            where: { name: playlistName }

        })
        const result = await PlaylistSong.destroy({
            where: {
                song_uuid: songUUID,
                playlist_uuid: playlist.uuid
            }
        });

        if (result === 0) {
            return res.status(404).json({ error: 'Song or Playlist not found' });
        }

        res.status(200).json({ message: 'Song removed from playlist successfully' });
    } catch (error) {
        console.error('Error removing song from playlist:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
