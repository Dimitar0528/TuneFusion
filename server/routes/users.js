import express from 'express';
import bcrypt from 'bcryptjs';
import { PlayList, User, PlaylistSong } from '../db/models/index.js'
import { Sequelize } from 'sequelize';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({ where: { role: 'user' } });

        if (!users) {
            return res.status(404).json({ error: 'Users not found' });
        }
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:userid', async (req, res) => {
    const userId = req.params.userid;

    try {
        const user = await User.findOne({
            where: Sequelize.where(
                Sequelize.fn('LEFT', Sequelize.col('uuid'), 6),
                userId
            ),
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/editAccount/:userid', async (req, res) => {
    const userUUID = req.params.userid;
    try {
        const { name, first_name, last_name, email_address, phone_number, gender } = req.body;

        const user = await User.findOne({ where: { uuid: userUUID } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingUserWithname = await User.findOne({ where: { name } });
        if (existingUserWithname && existingUserWithname.uuid !== user.uuid) {
            return res.status(401).json({ error: 'name is already taken! Please enter a new one!' });
        }

        const adminUser = await User.findOne({ where: { role: 'admin' } });
        if (name.toLowerCase().includes('admin') && adminUser && adminUser.uuid !== user.uuid) {
            return res.status(403).json({ error: 'Request denied! Your name should not include the word admin!' });
        }

        await User.update({
            name,
            first_name,
            last_name,
            email_address,
            phone_number,
            gender,
        }, {
            where: { uuid: user.uuid },
        });

        return res.status(200).json({ message: 'Account details updated successfully!' });

    } catch (error) {
        console.error('Error updating account details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.put('/resetPassword/:user_email_address', async (req, res) => {
    const userEmail = req.params.user_email_address;
    const { password } = req.body;
    try {
        const user = await User.findOne({ where: { email_address: userEmail } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            return res.status(401).json({ error: 'The new password cannot be the same as the old one!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.update(
            { password: hashedPassword },
            { where: { uuid: user.uuid } }
        );

        return res.status(200).json({ message: 'Password reset successfully!' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/deleteUser/:userUUID', async (req, res) => {
    const userUUID = req.params.userUUID;

    try {
        const hasPlaylists = await PlayList.findAll({
            where: { created_by: userUUID },
        });

        if (hasPlaylists.length >= 0) {
            const playlistUUIDs = hasPlaylists.map(playlist => playlist.dataValues.uuid);

            await PlayList.destroy({
                where: {
                    uuid: playlistUUIDs,
                },
            });
            const hasPlayListSongs = await PlaylistSong.findAll({
                where: { playlist_uuid: playlistUUIDs }
            })
            hasPlayListSongs && (await PlaylistSong.destroy({
                where: { playlist_uuid: playlistUUIDs },
            }));
            await User.destroy({
                where: { uuid: userUUID },
            });
            res.status(200).json({ message: 'Account deleted successfully.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the user' });
    }
});
export default router;
