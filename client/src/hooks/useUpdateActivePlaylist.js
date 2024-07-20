import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const useActivePlaylistEffect = (activePlaylist, songs, setFilteredSongs) => {
    useLocalStorage("activePlaylist", {
        name: activePlaylist?.name,
        activeIndex: activePlaylist?.activeIndex,
    });

    useEffect(() => {
        if (activePlaylist) {
            setFilteredSongs(activePlaylist.Songs);
        } else {
            setFilteredSongs(songs.slice(0, 20));
        }
    }, [activePlaylist, songs, setFilteredSongs]);
};

export default useActivePlaylistEffect;
