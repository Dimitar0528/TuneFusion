import express from 'express';
import Genius from 'genius-lyrics';
import { Song } from '../db/models/index.js'
import gis from 'async-g-i-s';
import { searchMusics, getSuggestions } from 'node-youtube-music';

const router = express.Router();
const Client = new Genius.Client();

router.get('/', async (req, res) => {
    try {
        const songs = await Song.findAll({
            order: [["createdAt", "DESC"]],
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

router.get('/:name', async (req, res) => {
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


router.post('/addsong', async (req, res) => {
    const { name, artist, img_src, audio_src, duration } = req.body;
    const uuid = crypto.randomUUID();

    try {
        const song = await Song.findOne({
            where: { name: name }
        });
        if (song) {
            return res.status(400).json({ error: 'The song has already been added to the database!' });
        }
        await Song.create({
            uuid,
            name,
            artist,
            img_src,
            audio_src,
            duration: duration
        });

        res.status(200).json({ message: "Song added to database!" });
    } catch (error) {
        console.error('Error creating song:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/deleteSong/:uuid', async (req, res) => {
    const songUUID = req.params.uuid;

    try {
        await Song.destroy({ where: { uuid: songUUID } });

        return res.status(200).json({ message: 'Song deleted successfully!' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});



router.put('/updatesong/:name', async (req, res) => {
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
router.get('/search/:query', async (req, res) => {
    try {
        const query = req.params.query.toLowerCase();

        const songs = await searchMusics(query);
        const suggestions = await getSuggestions(songs[0].youtubeId);
        // check if the provided query corresponds to an artist's name
        const artistSongs = songs.filter(song => song.artists.every(artist => artist.name.toLowerCase().includes(query.toLowerCase())));

        const songList = await Promise.all((artistSongs.length > 0 ? artistSongs : suggestions).map(async song => {
            const { title: name, artists, youtubeId: id, duration } = song;
            const song_duration = duration.totalSeconds;
            const artistName = artists[0].name;
            const searchTerm = artistName + name;
            const imgs = await gis(searchTerm);
            const img_src = imgs[0]?.url;
            const audio_src = `https://www.youtube.com/watch?v=${id}`;
            return {
                name, artist: artistName, img_src, audio_src, duration: song_duration
            };
        }));

        res.json(songList);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/:artist/:song', async (req, res) => {
    const { artist, song } = req.params;
    try {
        const searches = await Client.songs.search(song);
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

export default router;
