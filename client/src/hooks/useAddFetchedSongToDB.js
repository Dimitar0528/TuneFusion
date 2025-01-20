import showToast from "../utils/showToast";
import { useCreateSong, useSearchSong } from "./CRUD-hooks/useSongs";

export const useAddFetchedSongToDB = (triggerRefreshSongsHandler) => {
    const [_, loading, fetchSongDetails] = useSearchSong();
    const createSong = useCreateSong();

    const addFetchedSongToDB = async (songName, artistName) => {
        const songDetails = `${songName} , ${artistName}`
        showToast("Loading... Please wait!", "info", 2800);
        const song = await fetchSongDetails(songDetails);
        if (song.error) return showToast(song.error, "error");

        const callback = (result) => {
            showToast(result.message, "success");
            triggerRefreshSongsHandler();
        };
        await createSong(song, callback);
    };

    return [addFetchedSongToDB, loading];
};
