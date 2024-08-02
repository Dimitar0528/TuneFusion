import { useState, useEffect, useCallback } from "react";
import songsAPI from "../../api/songs-api";
import showToast from "../../utils/showToast";

export const validateSongData = (values) => {
    const { name, artist, img_src, audio_src, duration } = values;
    const errors = {};

    if (!name) errors.name = "Name is required";
    if (!artist) errors.artist = "Artist is required";
    if (!img_src) errors.img_src = "Image URL is required";
    if (!audio_src) errors.audio_src = "Audio URL is required";
    if (!duration || isNaN(duration) || duration <= 0) {
        errors.duration = "Valid duration in seconds is required";
    }

    return errors;
};

export function useCreateSong() {
    const songCreateHandler = async (songData, callback) => {
        const result = await songsAPI.createSong(songData);
        if (result.error) showToast(`Error: ${result.error}`, "error")
        typeof callback === 'function' && callback(result);
    }
    return songCreateHandler;
}

export function useGetAllSongs(refreshFlag) {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSongs = async () => {
            const result = await songsAPI.getAllSongs();
            if (result.error) return showToast(`Error: ${result.error}`, "error")
            setSongs(result);
            setLoading(false)
        }
        fetchSongs()
    }, [refreshFlag]);

    return [songs, loading];
}


export function useGetSong(name) {
    const [song, setSong] = useState();

    useEffect(() => {
        const fetchSong = async () => {
            const result = await songsAPI.getSong(name);
            setSong(result);
        };
        fetchSong();
    }, [name]);

    return [song];
}

export function useGetArtistDescription(artistName) {
    const [artist, setArtist] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSong = async () => {
            window.scrollTo(0, 0);
            setLoading(true)
            const result = await songsAPI.getArtistDescription(artistName);
            setArtist(result);
            setLoading(false);
        };
        fetchSong();
    }, [artistName]);

    return [artist, loading];
}

export function useGetSongSuggestions() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSuggestedSongs = useCallback(async (query) => {

        setLoading(true);
        setSongs([]);
        const result = await songsAPI.getSongSuggestions(query);;
        setSongs(result);
        setLoading(false);

    }, []);

    return [songs, loading, fetchSuggestedSongs];
}

export function useGetSongLyrics(currentSong) {
    const [lyrics, setLyrics] = useState("");
    const [loading, setIsLoading] = useState(false);
    const clearLyrics = () => {
        setLyrics("");
    }
    const fetchLyrics = useCallback(async () => {
        if (lyrics) return clearLyrics();
        setIsLoading(true);
        const result = await songsAPI.getSongLyrics(currentSong.artist, currentSong.name);
        result.error ? setLyrics(result.error) : setLyrics(result);
        setIsLoading(false);

    }, [currentSong, lyrics]);

    return [lyrics, loading, fetchLyrics, clearLyrics];
}

export function useUpdateSong() {
    const songUpdateHandler = async (songName, data) => {
        const result = await songsAPI.updateSong(songName, data)
        result.error ? showToast(`Error: ${result.error}`, "error") : showToast(result.message, 'success', 1500, true)
    }
    return songUpdateHandler;
}

export function useDeleteSong() {
    const songDeleteHandler = async (songId, triggerRefreshHandler) => {
        const result = await songsAPI.deleteSong(songId)
        result.error ? showToast(`Error: ${result.error}`, "error") : showToast(result.message, 'success');
        triggerRefreshHandler();
    }
    return songDeleteHandler;
}