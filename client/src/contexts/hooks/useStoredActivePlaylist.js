import { useEffect } from "react";

const useStoredActivePlaylist = (playlists, setActivePlaylist) => {
    useEffect(() => {
        if (playlists.length === 0) return;
        const storedActivePlaylist = JSON.parse(localStorage.getItem("activePlaylist"));
        if (storedActivePlaylist) {
            const playlist = playlists.find(
                (pl) => pl.name === storedActivePlaylist.name
            );
            if (playlist) {
                setActivePlaylist({
                    ...storedActivePlaylist,
                    Songs: playlist.Songs,
                    description: playlist.description,
                });
            }
        }
    }, [playlists, setActivePlaylist]);
};

export default useStoredActivePlaylist;
