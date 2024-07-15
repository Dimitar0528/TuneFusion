import express from 'express';
const router = express.Router();
import { PlayList, PlaylistSong, Song, User } from '../db/models/index.js'
import { Sequelize } from 'sequelize';
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
                        attributes: {
                            exclude: ['playlist_uuid', 'song_uuid']
                        }
                    }
                }
            ]
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
router.get('/songs', async (req, res) => {
    try {
        const playlists = await PlaylistSong.findAll({
            where: {}
        });

        if (!playlists) {
            return res.status(404).json({ error: "Playlists not found" });
        }

        res.status(200).json(playlists);
    } catch (error) {
        console.error("Error fetching playlists:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
export default router;
