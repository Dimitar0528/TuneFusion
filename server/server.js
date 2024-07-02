import express from 'express'
import cors from 'cors';
import Genius from 'genius-lyrics';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import Song from './db/models/Song.js';
import User from './db/models/User.js';
import crypto from 'crypto';
import { Sequelize, Op } from 'sequelize';
import {
    searchMusics,
    searchAlbums,
    searchPlaylists,
    getSuggestions,
    listMusicsFromAlbum,
    listMusicsFromPlaylist,
    searchArtists,
    getArtist,
} from 'node-youtube-music';
const Client = new Genius.Client();
const app = express();

app.use(express.json())
const corsOptions = {
    origin: true,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser())
const port = 3000
const secretKey = process.env.JWT_SECRET_KEY;

app.get('/api/songs/:artist/:song', async (req, res) => {
    const { artist, song } = req.params;
    try {
        const searches = await Client.songs.search(song);
        // Pick first one
        const songByArtist = searches.find((song) => {
            return song.artist.name
                .trim()
                .toLowerCase()
                .includes(artist.trim().toLowerCase());
        });
        if (!songByArtist) {
            return res.status(404).json({ error: 'Lyrics for the specified song not found' });
        }
        const lyrics = await songByArtist.lyrics();
        return res.status(200).json(lyrics);
    } catch (error) {
        console.error("Error fetching lyrics:", error);
        return res.status(500).json({ error: 'An error occurred while fetching lyrics' });
    }
});

app.get('/api/songs', async (req, res) => {
    try {
        const songs = await Song.findAll({
            order: [["name", "ASC"]],
        });

        if (!songs) {
            return res.status(404).json({ error: "Songs not found" });
        }

        res.status(200).json(songs);
    } catch (error) {
        console.error("Error fetching songs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get('/api/songs/:name', async (req, res) => {
    const name = req.params.name;

    try {
        const song = await Song.findOne({
            where: { name: name }
        });
        return res.status(200).json(song);
    } catch (error) {
        console.error('Error fetching song:', error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/api/songs/addsong', async (req, res) => {
    const { name, artist, img_src, audio_src } = req.body;
    const uuid = crypto.randomUUID();

    try {
        const newSong = await Song.create({
            uuid,
            name,
            artist,
            img_src,
            audio_src,
        });

        res.status(201).json(newSong);
    } catch (error) {
        console.error('Error creating song:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.put('/api/songs/updatesong/:name', async (req, res) => {
    const name = req.params.name;
    const body = req.body;

    try {
        const song = await Song.findOne({ where: { name: name } });

        if (!song) {
            return res.status(404).json({ error: "Song not found" });
        }

        await Song.update(
            {
                name: body.name || song.name,
                artist: body.artist || song.artist,
                img_src: body.img_src || song.img_src,
                audio_src: body.audio_src || song.audio_src,
            },
            { where: { uuid: song.uuid } }
        );

        return res.status(200).json({ message: "Song updated successfully!" });
    } catch (error) {
        console.error('Error updating song:', error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/api/users/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if a user with the same username already exists
        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken!' });
        }

        // Check if an admin user already exists
        const adminUser = await User.findOne({ where: { role: 'admin' } });

        if (username.toLowerCase().includes('admin') && adminUser) {
            return res.status(403).json({ error: 'Request denied! You cannot create administrator accounts!' });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = username.toLowerCase().includes('admin') ? 'admin' : 'user';

        // Create a new user in the database
        const newUser = await User.create({
            uuid: crypto.randomUUID(),
            username,
            email_address: email,
            password: hashedPassword,
            role,
        });

        return res.status(200).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: error.message });
    }
});
app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials! Please check them again.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password! Please check your password again.' });
        }

        const token = jwt.sign({ userUUID: user.uuid, userRole: user.role }, secretKey, {
            expiresIn: '24h',
        });

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 86400000,
            sameSite: 'Strict',
            path: '/',
        };

        res.cookie('_token', token, cookieOptions);

        const responseData = {
            user_uuid: user.uuid,
        };

        return res.status(200).json(responseData);
    } catch (error) {
        console.error('Error authenticating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/users/getToken', (req, res) => {
    const tokenCookie = req.headers.cookie;
    if (!tokenCookie) return null;

    const token = tokenCookie.split('=')[1].trim(); // Extract the token

    try {
        const decodedUserToken = jwt.verify(token, secretKey);
        const { userUUID, userRole } = decodedUserToken;

        return res.status(200).json({ id: userUUID, role: userRole });
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: error.message });
    }
});


app.get('/', async (req, res) => {
    // const artists = await searchArtists('Симона');

    // const artist = await getArtist(artists[0].artistId); console.log(artist);
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
})