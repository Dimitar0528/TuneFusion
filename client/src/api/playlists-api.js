import request from "./requester";

const BASE_URL = 'http://localhost:3000/api/playlists'

const getUserPlaylists = async (userUUID) => request.get(`${BASE_URL}/${userUUID}`);

const getPublicPlaylists = async (userUUID) => request.get(`${BASE_URL}/public-playlists?UI=${userUUID}`);

const createPlaylist = (playlistData) => request.post(`${BASE_URL}/`, playlistData)

const editPlaylist = (playlistName, playlistData) => request.put(`${BASE_URL}/${playlistName}`, playlistData)

const editSongPositions = (playlistName, data) =>
    request.patch(`${BASE_URL}/${playlistName}/song-positions`, data);

const deletePlaylist = (playlistUUID) => request.del(`${BASE_URL}/${playlistUUID}`)

const addSongToPlaylist = (playlistData) => request.post(`${BASE_URL}/add-song`, playlistData)

const transferSongsToPlaylist = (playlistData) => request.post(`${BASE_URL}/playlist/transfer-songs`, playlistData)

const removeSongFromPlaylist = (playlistData) => request.del(`${BASE_URL}/remove-song`, playlistData)

const likePlaylist = (data) => request.post(`${BASE_URL}/like-playlist`, data);

const unlikePlaylist = (data) => request.del(`${BASE_URL}/unlike-playlist`, data);

const playlistsAPI = {
    getUserPlaylists,
    getPublicPlaylists,
    createPlaylist,
    editPlaylist,
    editSongPositions,
    deletePlaylist,
    addSongToPlaylist,
    transferSongsToPlaylist,
    removeSongFromPlaylist,
    likePlaylist,
    unlikePlaylist,
}

export default playlistsAPI;