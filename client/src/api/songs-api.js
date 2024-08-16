import request from "./requester";

const BASE_URL = 'http://localhost:3000/api/songs'

const getAllSongs = async () => request.get(BASE_URL);

const getSpecificSongs = async (activePlaylist, currentSongUUID, userUUID) => {
    let isOnSearchPage = false;
    // Base URL depending on whether an active playlist is present
    let url = activePlaylist
        ? `${BASE_URL}/specificSongs?AP=${activePlaylist?.name}&CS=${currentSongUUID}`
        : `${BASE_URL}/specificSongs?CS=${currentSongUUID}`;

    // Append userUUID only if the playlist name is 'Liked Songs'
    if (activePlaylist?.name === 'Liked Songs') {
        url += `&UI=${userUUID}`;
    }

    // Check if the current location is '/search' and log a message
    if (location.pathname === '/search') {
        isOnSearchPage = true
        url += `&SP=${isOnSearchPage}`;
    }

    return request.get(url);
};

const getSong = (songName) => request.get(`${BASE_URL}/${songName}`)

const createSong = (songData) => request.post(`${BASE_URL}/addsong`, songData)

const deleteSong = (songId) => request.del(`${BASE_URL}/deleteSong/${songId}`)

const updateSong = (songName, data) => request.put(`${BASE_URL}/updateSong/${songName}`, data)

const getSongLyrics = (songArtist, songName) => request.get(`${BASE_URL}/${songArtist}/${songName}`)

const getSongSuggestions = (query) => request.get(`${BASE_URL}/search/${query}`);

const addIndividualSong = (songName) => request.get(`${BASE_URL}/addIndividualSong/${songName}`);

const getArtistDescription = (artistName) => request.get(`${BASE_URL}/artist/${artistName}`)

const songsAPI = {
    getSong,
    getAllSongs,
    getSpecificSongs,
    createSong,
    deleteSong,
    updateSong,
    getSongLyrics,
    getSongSuggestions,
    addIndividualSong,
    getArtistDescription
}

export default songsAPI;