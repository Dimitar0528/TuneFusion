import { useEffect } from "react";

const useActivePlaylistEffect = (activePlaylist, songs, setFilteredSongs) => {
    useEffect(() => {
        if (activePlaylist) {
            localStorage.setItem(
                "activePlaylist",
                JSON.stringify({
                    name: activePlaylist?.name,
                })
            );
            setFilteredSongs(activePlaylist.Songs);
        } else {
            setFilteredSongs(songs.slice(0, 20));
        }
    }, [activePlaylist, songs, setFilteredSongs,]);
};

export default useActivePlaylistEffect;
