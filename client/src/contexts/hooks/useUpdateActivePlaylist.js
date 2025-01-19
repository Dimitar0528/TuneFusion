import { useEffect } from "react";
import { useGetSpecificSongs } from "../../hooks/CRUD-hooks/useSongs";
import { useGetUserDetails } from "../../hooks/CRUD-hooks/useUsers";
const useActivePlaylistEffect = (activePlaylist, setFilteredSongs, currentSongUUID, userUUID, refreshFlag) => {
    const [specificSongs, loading] = useGetSpecificSongs(activePlaylist, currentSongUUID, userUUID, refreshFlag);
    const [user] = useGetUserDetails(userUUID);
    useEffect(() => {
        if (activePlaylist) {
            localStorage.setItem(
                "activePlaylist",
                JSON.stringify({
                    name: activePlaylist?.name,
                    visibility: activePlaylist?.visibility,
                    created_by: user.name
                })
            );
            setFilteredSongs(activePlaylist.Songs);

        } else {
            setFilteredSongs(specificSongs);
        }
    }, [activePlaylist, specificSongs, setFilteredSongs]);
    return [specificSongs, loading]
};

export default useActivePlaylistEffect;
