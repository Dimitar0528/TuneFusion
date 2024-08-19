import showToast from "../utils/showToast";
import { useCreateSong, useGetIndividualSong } from "./CRUD-hooks/useSongs";

export const useAddExternalSongToDB = (triggerRefreshSongsHandler) => {
    const [_, loading, fetchIndividualSong] = useGetIndividualSong();
    const createSong = useCreateSong();

    const addExternalSongToDB = async (songDetails) => {
        showToast("Loading... Please wait!", "info", 1800);
        const song = await fetchIndividualSong(songDetails);
        const callback = (result) => {
            showToast(result.message, "success");
            triggerRefreshSongsHandler();
        };
        await createSong(song, callback);
    };

    return [addExternalSongToDB, loading];
};
