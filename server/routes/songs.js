import express from 'express';
import Genius from 'genius-lyrics';
import { Song, PlaylistSong, PlayList } from '../db/models/index.js'
import gis from 'async-g-i-s';
import { searchMusics, getSuggestions, getArtist, searchArtists } from 'node-youtube-music';
import { Sequelize } from 'sequelize';
import extractUUIDPrefix from '../../client/src/utils/extractUUIDPrefix.js';
const router = express.Router();
const Client = new Genius.Client();

router.get('/', async (req, res) => {
    try {
        const songs = await Song.findAll({
            order: [["createdAt", "DESC"]],
        });

        if (!songs) {
            return res.status(404).json({ error: "Songs not found!" });
        }

        res.status(200).json(songs);
    } catch (error) {
        console.error("Error fetching songs:", error);
        res.status(500).json({ error: "There was an error while trying to fetch all songs!" });
    }
});

router.get('/specificSongs', async (req, res) => {
    const activePlaylistName = req.query.AP;
    const currentSongUUID = req.query.CS;
    const userUUID = req.query.UI;
    let songs = [];

    try {
        // Fetch the current song
        const currentSong = await Song.findOne({
            where: Sequelize.where(
                Sequelize.fn('LEFT', Sequelize.col('uuid'), 6),
                currentSongUUID
            ),
        })

        if (activePlaylistName) {
            const whereClause = userUUID
                ? {
                    [Sequelize.Op.and]: [
                        Sequelize.where(
                            Sequelize.fn('LEFT', Sequelize.col('created_by'), 6),
                            userUUID
                        ),
                        { name: activePlaylistName }
                    ]
                }
                : { name: activePlaylistName };

            const playlist = await PlayList.findOne({
                where: whereClause
            });

            // Fetch songs related to the playlist using the UUID
            const playlistSongs = await PlaylistSong.findAll({
                where: {
                    playlist_uuid: playlist.uuid
                },
            });

            // Fetch the actual song details for each song in the playlist
            const playlistSongsDetails = await Promise.all(
                playlistSongs.map(async (playlistSong) => {
                    const song = await Song.findOne({
                        where: { uuid: playlistSong.song_uuid }
                    });
                    return song ? song.dataValues : null;
                })
            );

            // Include the current song if not already in the playlist
            if (currentSong && !playlistSongsDetails.some(song => song && extractUUIDPrefix(song.uuid) === currentSongUUID)) {
                playlistSongsDetails.push(currentSong.dataValues);
            }

            songs = playlistSongsDetails;
        } else {
            // Fetch the first 20 songs if no active playlist is provided
            songs = await Song.findAll({
                order: [["createdAt", "DESC"]],
                limit: 20,
            });

            // Include the current song if not already in the fetched songs
            if (currentSong && !songs.some(song => extractUUIDPrefix(song.uuid) === currentSongUUID)) {
                songs.push(currentSong.dataValues);
            }
        }
        res.status(200).json(songs);
    } catch (error) {
        console.error("Error fetching songs:", error);
        res.status(500).json({ error: 'There was an error while trying to fetch the songs!' });
    }
});


router.get('/:name', async (req, res) => {
    const name = req.params.name;

    try {
        const song = await Song.findOne({
            where: { name: name }
        });
        if (!song) {
            return res.status(404).json({ error: 'The requested song could not be found in our database!' });
        }
        return res.status(200).json(song);
    } catch (error) {
        console.error('Error fetching song:', error);
        return res.status(500).json({ error: "There was an error while trying to fetch the specific song!" });
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

        res.status(200).json({ message: "Song added to database successfully!" });
    } catch (error) {
        console.error('Error creating song:', error);
        res.status(500).json({ error: 'There was an error while trying to create the song!' });
    }
});

router.delete('/deleteSong/:uuid', async (req, res) => {
    const songUUID = req.params.uuid;

    try {
        await Song.destroy({ where: { uuid: songUUID } });

        const hasPlayListSongs = await PlaylistSong.findAll({
            where: { song_uuid: songUUID }
        })
        hasPlayListSongs && (await PlaylistSong.destroy({
            where: { song_uuid: songUUID },
        }));
        return res.status(200).json({ message: 'Song deleted successfully!' });
    } catch (error) {
        return res.status(500).json({ error: 'There was an error while trying to delete the song!' });
    }
});



router.put('/updatesong/:name', async (req, res) => {
    const name = req.params.name;
    const body = req.body;

    try {
        const song = await Song.findOne({ where: { name: name } });

        if (!song) {
            return res.status(404).json({ error: "Song not found!" });
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
        return res.status(500).json({ error: "There was an error while trying to update the song data!" });
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
            const artistName = artists[0].name.split(',')[0];
            const searchTerm = artistName + name;
            const imgs = await gis(searchTerm);
            const img_src = imgs[0]?.url;
            const audio_src = `https://www.youtube.com/watch?v=${id}`;
            return {
                name, artist: artistName, img_src, audio_src, duration: song_duration
            };
        }));

        res.status(200).json(songList);
    } catch (error) {
        console.error(error);
        res.status(500).send('There was an error while trying to fetch the suggested songs!');
    }
});
function trimDescription(description) {
    const attributionText = 'From Wikipedia';
    const index = description?.indexOf(attributionText);

    if (index !== -1) {
        return description?.substring(0, index).trim();
    }

    return description;
}
router.get('/artist/:artistName', async (req, res) => {
    try {
        const artistName = req.params.artistName
        const artists = await searchArtists(artistName);
        const artist = await getArtist(artists[0].artistId);
        const trimmedDescription = trimDescription(artist.description);
        const newArtist = {
            ...artist,
            description: trimmedDescription,
        }
        res.status(200).json(newArtist);
    } catch (error) {
        console.error('Error fetching artist data:', error);
        res.status(500).json({ error: 'There is no available information for this artist!' });
    }
})

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
            return res.status(404).json({ error: 'Lyrics for the specified song not found!' });
        }
        const lyrics = await songByArtist.lyrics();
        return res.status(200).json(lyrics);
    } catch (error) {
        console.error("Error fetching lyrics:", error);
        return res.status(500).json({ error: 'There was an error while trying to fetch the lyrics!' });
    }
});

export default router;
