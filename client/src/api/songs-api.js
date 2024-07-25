import request from "./requester";

const BASE_URL = 'http://localhost:3000/api/songs'

const getAllSongs = async () => request.get(BASE_URL);


const getSong = (songName) => request.get(`${BASE_URL}/${songName}`)

const createSong = (songData) =>
    request.post(`${BASE_URL}/addsong`, songData)

const deleteSong = (songId) => request.del(`${BASE_URL}/deleteSong/${songId}`)

const updateSong = (songName, data) => request.put(`${BASE_URL}/updateSong/${songName}`, data)

const songsAPI = {
    getSong,
    getAllSongs,
    createSong,
    deleteSong,
    updateSong
}

export default songsAPI;