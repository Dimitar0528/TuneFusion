import { useState, useEffect } from "react";
import songsAPI from "../api/songs-api";
import showToast from "../utils/showToast";

export function useCreateSong() {
    const gameCreateHandler = async (songData) => {
        const response = await songsAPI.createSong(songData);
        response.error ? showToast(`Error: ${response.error}`, "error") : showToast(response.message, 'success', 1500, true)
    }
    return gameCreateHandler;
}

export function useGetAllSongs() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const result = await songsAPI.getAllSongs();;
            setSongs(result);
            setLoading(false)
        })();
    }, []);
    return [songs, loading];
}


export function useGetSong(name) {
    const [song, setSong] = useState();

    useEffect(() => {
        const fetchSong = async () => {
            const result = await songsAPI.getSong(name);
            setSong(result);
        };

        if (name) {
            fetchSong();
        }
    }, [name]);

    return [song];
}
export function useUpdateSong() {
    const songUpdateHandler = async (songName, data) => {
        const response = await songsAPI.updateSong(songName, data)
        response.error ? showToast(`Error: ${response.error}`, "error") : showToast(response.message, 'success', 1500, true)
    }
    return songUpdateHandler;
}

export function useDeleteSong() {
    const songDeleteHandler = async (songId) => {
        const response = await songsAPI.deleteSong(songId)
        response.error ? showToast(`Error: ${response.error}`, "error") : showToast(response.message, 'success', 1500, true)
    }
    return songDeleteHandler;
}