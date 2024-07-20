import { useState, useEffect } from "react";

const useFetchUserPlaylists = (userUUID) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshPlaylist, setRefreshPlaylist] = useState(false);

    useEffect(() => {
        if (!userUUID) return;

        const fetchPlaylists = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/api/playlists/${userUUID}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch playlists");
                }

                const data = await response.json();
                setPlaylists(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, [userUUID, refreshPlaylist]);

    const refreshPlaylistHandler = () => {
        setRefreshPlaylist((prev) => !prev);
    };
    return { playlists, loading, error, refreshPlaylistHandler };
};


export default useFetchUserPlaylists;
