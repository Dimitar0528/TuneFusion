import { useState, useCallback } from "react";

const useFetchSongLyrics = (currentSong) => {
    const [lyrics, setLyrics] = useState("");
    const [loading, setIsLoading] = useState(false);

    const fetchLyrics = useCallback(async () => {
        if (lyrics) {
            setLyrics("");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                `http://localhost:3000/api/songs/${currentSong.artist.split(',')[0]}/${currentSong.name}`
            );
            const data = await response.json();

            if (data.error) {
                setLyrics(data.error);
            } else {
                setLyrics(data);
            }
        } catch (error) {
            console.error("Error fetching lyrics:", error);
            setLyrics("An error occurred while fetching lyrics.");
        } finally {
            setIsLoading(false);
        }
    }, [currentSong, lyrics]);

    return { lyrics, loading, fetchLyrics, setLyrics };
};

export default useFetchSongLyrics;
