import { useState, useEffect, useCallback } from "react";
import songsAPI from "../../api/songs-api";
import showToast from "../../utils/showToast";
import { toast } from "react-toastify";

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
    const songCreateHandler = async(songData, triggerRefreshHandler = false) => {
        await toast.promise(
            songsAPI.createSong(songData),
            {
                pending: "Creating song... Please wait!",
                success: {
                    render({ data }) {
                        if (data.error) {
                            throw new Error(data.error);
                        }
                        triggerRefreshHandler();
                        return data.message;
                    }
                },
                error: {
                    render({ data }) {
                        return data.message
                    }
                }
            }
        );
    };
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

export function useGetSpecificSongs(activePlaylist, currentSongUUID, userUUID, refreshFlag) {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSongs = async () => {
            const result = await songsAPI.getSpecificSongs(activePlaylist, currentSongUUID, userUUID);
            if (result.error) return showToast(`Error: ${result.error}`, "error")
            setSongs(result);
            setLoading(false)
        }
        fetchSongs()
    }, [activePlaylist, refreshFlag]);

    return [songs, loading];
}


export function useGetSong(name) {
    const [song, setSong] = useState([]);
    const fetchSong = useCallback(async () => {
        const result = await songsAPI.getSong(name);
        setSong(result);
        return result
    }, [name])
    return [song, fetchSong];
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

    const fetchSuggestedSongsHandler = useCallback(async (query) => {

        setLoading(true);
        setSongs([]);
        const result = await songsAPI.getSongSuggestions(query);
        setSongs(result);
        setLoading(false);
        return result
    }, []);

    return [songs, loading, fetchSuggestedSongsHandler];
}

export const useAddFetchedSongToDB = (triggerRefreshSongsHandler) => {
    const [loading, setLoading] = useState(false);
    const [song, setSong] = useState({});

    const addExternalSongToDBHandler = useCallback(async (songName, artistName) => {
        const songDetails = `${songName}, ${artistName}`;
        setLoading(true);
        setSong({});

        const result = await toast.promise(
            songsAPI.addExternalSong(songDetails),
            {
                pending: "Adding song to database... Please wait!",
                success: {
                    render({ data }) {
                        if (data.error) {
                            throw new Error(data.error);
                        }
                        setSong(data.newSong);
                        triggerRefreshSongsHandler();
                        return data.message;
                    }
                },
                error: {
                    render({ data }) {
                        return data.message
                    }
                }
            }
        );

        setLoading(false);
        return result;
    }, [triggerRefreshSongsHandler]);

    return [addExternalSongToDBHandler, loading, song];
};

export function useGetSongLyrics(currentSong, setShowYotubePlayer) {
    const [lyrics, setLyrics] = useState("");
    const [loading, setIsLoading] = useState(false);
    const clearLyrics = () => {
        setLyrics("");
    }
    const fetchLyricsHandler = useCallback(async () => {
        if (lyrics) return clearLyrics();
        setShowYotubePlayer(false);
        setIsLoading(true);
        const songDetails = `${currentSong.artist.split(', ')[0]}; ${currentSong.name}`;
        const result = await songsAPI.getSongLyrics(songDetails);
        result.error ? showToast(result.error, 'error') : setLyrics(result);
        setIsLoading(false);

    }, [currentSong, lyrics]);

    return [lyrics, loading, fetchLyricsHandler, clearLyrics];
}

export function useUpdateSong() {
    const songUpdateHandler = async (songName, data) => {
        const result = await songsAPI.updateSong(songName, data)
        result.error ? showToast(`Error: ${result.error}`, "error") : showToast(result.message, 'success', 1500, true)
    }
    return songUpdateHandler;
}

export function useDeleteSong() {
    const songDeleteHandler = async (songId, triggerRefreshSongsHandler, triggerRefreshPlaylistsHandler) => {
        const result = await songsAPI.deleteSong(songId)
        result.error ? showToast(`Error: ${result.error}`, "error") : showToast(result.message, 'success');
        triggerRefreshSongsHandler();
        triggerRefreshPlaylistsHandler();
    }
    return songDeleteHandler;
}

export function useAddAlbumToDB(triggerRefreshHandler) {
    const [loading, setLoading] = useState(false);

    const addAlbumToDBHandler = async (albumSongs, artistName) => {
        setLoading(true);

        const result = await toast.promise(
            songsAPI.addAlbumToDB({ albumSongs, artistName }),
            {
                pending: "Adding songs to database... Please wait!",
                success: {
                    render({ data }) {
                        if (data.addedSongs?.length > 0) {
                            triggerRefreshHandler();
                            return data.message;
                        }
                        if (data.error) {
                            throw new Error(data.error);
                        }
                    },
                },
                error: {
                    render({ data }) {
                        return data.message
                    },
                },
            }
        );

        setLoading(false);
        return result.addedSongs;
    };

    return [addAlbumToDBHandler, loading];
}
