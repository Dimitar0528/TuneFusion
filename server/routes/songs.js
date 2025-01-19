import express from 'express';
import Genius from 'genius-lyrics';
import { Song, PlaylistSong, PlayList } from '../db/models/index.js'
import gis from 'async-g-i-s';
import { searchMusics, getSuggestions, getArtist, searchArtists } from 'node-youtube-music';
import { Sequelize,Op } from 'sequelize';
import extractUUIDPrefix from '../../client/src/utils/extractUUIDPrefix.js';
import { User } from '../db/models/index.js';
const router = express.Router();
const Client = new Genius.Client();

import YTMusic from "ytmusic-api"

const ytmusic = new YTMusic()
await ytmusic.initialize()

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
    const { AP: activePlaylistName, CS: currentSongUUID, UI: userUUID, SP: isOnSearchPage } = req.query;
    let songs = [];

    try {
        // Fetch the current song
        const currentSong = await Song.findOne({
            where: Sequelize.where(
                Sequelize.fn('LEFT', Sequelize.col('uuid'), 6),
                currentSongUUID
            ),
            attributes: { exclude: ['updatedAt'] }
        });

        if (isOnSearchPage) {
            // Fetch all songs for the search page
            songs = await Song.findAll({
                order: [["createdAt", "DESC"]],
                attributes: { exclude: ['updatedAt'] }
            });

        } else if (activePlaylistName) {
            // Build where clause based on whether userUUID is provided
            const user = await User.findOne({
                where: Sequelize.where(
                    Sequelize.fn('LEFT', Sequelize.col('uuid'), 6),
                    userUUID
                ),
            });
            const whereClause = userUUID
                ? { name: activePlaylistName, created_by: user.name }
                : { name: activePlaylistName };

            // Fetch playlist based on the where clause
            const playlist = await PlayList.findOne({
                where: whereClause,
                attributes: { exclude: ['updatedAt'] }
            });

            if (playlist) {
                // Fetch songs related to the playlist
                const playlistSongs = await PlaylistSong.findAll({
                    where: { playlist_uuid: playlist.uuid },
                });

                // Fetch actual song details for each song in the playlist
                const playlistSongsDetails = await Promise.all(
                    playlistSongs.map(async (playlistSong) => {
                        const song = await Song.findOne({
                            where: { uuid: playlistSong.song_uuid },
                            attributes: { exclude: ['updatedAt'] }
                        });
                        return song ? song.dataValues : null;
                    })
                );

                // Include the current song if not already in the playlist
                if (currentSong && !playlistSongsDetails.some(song => song && extractUUIDPrefix(song.uuid) === currentSongUUID)) {
                    playlistSongsDetails.push(currentSong.dataValues);
                }

                songs = playlistSongsDetails.filter(Boolean);
            }
        } else {
            // Fetch the first 50 songs if no active playlist is provided and not on search page
            songs = await Song.findAll({
                order: [["createdAt", "DESC"]],
                limit: 50,
                attributes: { exclude: ['updatedAt'] }
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
    const modifiedArtist = artist.replace(/&/g, ',').replace(/ ,/g, ",");
    const uuid = crypto.randomUUID();
    try {
        const song = await Song.findOne({
            where: {
                name: name,
                artist: {
                    [Op.like]: `%${modifiedArtist}%`,
                },
            },
        })
        if (song) {
            return res.status(400).json({ error: 'The song has already been added to the database!' });
        }
        await Song.create({
            uuid,
            name,
            artist: modifiedArtist,
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
                duration: body.duration || song.duration,
            },
            { where: { uuid: song.uuid } }
        );

        return res.status(200).json({ message: "Song updated successfully!" });
    } catch (error) {
        console.error('Error updating song:', error);
        return res.status(500).json({ error: "There was an error while trying to update the song data!" });
    }
});
router.get('/addIndividualSong/:songDetails', async (req, res) => {
    try {
        const songDetails = req.params.songDetails
        const [firstSong] = await ytmusic.searchVideos(songDetails);
        if (!firstSong) {
            return res.status(404).json({ error: 'Song not found' });
        }

        const { artist, name, videoId, duration } = firstSong;
        const audio_src = `https://www.youtube.com/watch?v=${videoId}`;
        const searchTerm = artist.name + name;
        const [{ url: img_src } = {}] = await gis(searchTerm);

        const song = await Song.findOne({
            where: { name: name, artist: artist.name }
        });
        if (song) {
            return res.status(400).json({ error: 'The song has already been added to the database!' });
        }
        res.status(200).json({
            name: name,
            artist: artist.name,
            img_src: img_src,
            audio_src,
            duration,
        });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'There was an error while trying to fetch the selected song!' });
    }
});


router.get('/search/:query', async (req, res) => {
    try {
        const query = req.params.query.toLowerCase();
        const songs = await ytmusic.searchVideos(query);
        const songList = await Promise.all(songs.map(async (song) => {
            const { artist, name, videoId, duration } = song;
            const audio_src = `https://www.youtube.com/watch?v=${videoId}`;
            const searchTerm = artist.name + name;
            const [{ url: img_src } = {}] = await gis(searchTerm);
            return {
                name,
                artist: artist.name,
                img_src,
                audio_src,
                duration,
            }
        }))

        res.status(200).json(songList);


    } catch (error) {
        console.error(error);
        res.status(500).send('There was an error while trying to fetch the suggested songs!');
    }
});

router.get('/artist/:artistName', async (req, res) => {
    try {
        const artistName = req.params.artistName
        const [firstArtist] = await ytmusic.searchArtists(artistName)
        const artist = await ytmusic.getArtist(firstArtist.artistId);
        // const featuredOnPlaylistsPromises = artist.featuredOn.map(feature => ytmusic.getPlaylist(feature.playlistId))
        // const featuredOnPlaylists = await Promise.all(featuredOnPlaylistsPromises)
        // console.log(featuredOnPlaylists)
        const albumSongsPromises = artist.topAlbums.map(album => ytmusic.getAlbum(album.albumId));
        const albumSongs = await Promise.all(albumSongsPromises);
        const reqObj = {
            ...artist,
            albumSongs,
        }
        res.status(200).json(reqObj);
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
