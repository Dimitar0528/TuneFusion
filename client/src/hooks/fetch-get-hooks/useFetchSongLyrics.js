import { useState, useCallback } from "react";

const useFetchSongLyrics = (currentSong, isCollapsed, showToast) => {
    const [lyrics, setLyrics] = useState("");
    const [loading, setIsLoading] = useState(false);

    const fetchLyrics = useCallback(async () => {
        if (isCollapsed) {
            showToast("Can't show lyrics when the player is collapsed", "warning");
            return;
        }

        if (lyrics) {
            setLyrics("");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                `http://localhost:3000/api/songs/${currentSong.artist}/${currentSong.name}`
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
    }, [currentSong, isCollapsed, lyrics, showToast]);

    return { lyrics, loading, fetchLyrics };
};

export default useFetchSongLyrics;
