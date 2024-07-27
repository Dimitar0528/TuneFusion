import { useState, useEffect } from "react";

const useFetchUserPlaylists = (userUUID, refreshFlag) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
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
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, [userUUID, refreshFlag]);

    return [playlists, loading];
};


export default useFetchUserPlaylists;
