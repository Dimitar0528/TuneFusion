import { useEffect } from "react";
import { useGetSpecificSongs } from "../../hooks/CRUD-hooks/useSongs";
const useActivePlaylistEffect = (activePlaylist, setFilteredSongs, currentSongUUID, userUUID, refreshFlag) => {
    const [specificSongs, loading] = useGetSpecificSongs(activePlaylist, currentSongUUID, userUUID, refreshFlag);

    useEffect(() => {
        if (activePlaylist) {
            localStorage.setItem(
                "activePlaylist",
                JSON.stringify({
                    name: activePlaylist?.name,
                    visibility: activePlaylist?.visibility,
                })
            );
            setFilteredSongs(activePlaylist.Songs);

        } else {
            setFilteredSongs(specificSongs);
        }
    }, [activePlaylist, , specificSongs, setFilteredSongs]);
    return [specificSongs, loading]
};

export default useActivePlaylistEffect;
