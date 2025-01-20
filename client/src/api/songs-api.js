import request from "./requester";

const BASE_URL = 'http://localhost:3000/api/songs'

const getAllSongs = async () => request.get(BASE_URL);

const getSpecificSongs = async (activePlaylist, currentSongUUID, userUUID) => {
    const isOnSearchPage = location.pathname === '/search';
    const playlistName = activePlaylist?.name;

    const url = `${BASE_URL}/specificSongs?CS=${currentSongUUID}`
        + (playlistName ? `&AP=${playlistName}` : '')
        + (playlistName === 'Liked Songs' ? `&UI=${userUUID}` : '')
        + (isOnSearchPage ? '&SP=true' : '');

    return request.get(url);
};


const getSong = (songName) => request.get(`${BASE_URL}/${songName}`)

const createSong = (songData) => request.post(`${BASE_URL}/`, songData)

const deleteSong = (songId) => request.del(`${BASE_URL}/${songId}`)

const updateSong = (songName, data) => request.put(`${BASE_URL}/${songName}`, data)

const getSongLyrics = (songArtist, songName) => request.get(`${BASE_URL}/lyrics/${songArtist}/${songName}`)

const getSongSuggestions = (query) => request.get(`${BASE_URL}/search/${query}`);

const searchSong = (songDetails) => request.get(`${BASE_URL}/search-song/${songDetails}`);

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
    searchSong,
    getArtistDescription
}

export default songsAPI;