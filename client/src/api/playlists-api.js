import request from "./requester";

const BASE_URL = 'http://localhost:3000/api/playlists'

const getUserPlaylists = async (userUUID) => request.get(`${BASE_URL}/${userUUID}`);

const getPublicPlaylists = async () => request.get(`${BASE_URL}/publicPlaylists`);

const createPlaylist = (playlistData) => request.post(`${BASE_URL}/create-playlist`, playlistData)

const editPlaylist = (playlistName, playlistData) => request.put(`${BASE_URL}/update-playlist/${playlistName}`, playlistData)

const deletePlaylist = (playlistUUID) => request.del(`${BASE_URL}/delete-playlist/${playlistUUID}`)

const addSongToPlaylist = (playlistData) => request.post(`${BASE_URL}/add-song`, playlistData)

const addExternalSongToPlaylist = (playlistData) => request.post(`${BASE_URL}/addExternalSong`, playlistData)

const removeSongFromPlaylist = (playlistData) => request.del(`${BASE_URL}/remove-song`, playlistData)

const playlistsAPI = {
    getUserPlaylists,
    getPublicPlaylists,
    createPlaylist,
    editPlaylist,
    deletePlaylist,
    addSongToPlaylist,
    addExternalSongToPlaylist,
    removeSongFromPlaylist
}

export default playlistsAPI;