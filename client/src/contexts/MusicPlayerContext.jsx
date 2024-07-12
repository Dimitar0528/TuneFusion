import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

const MusicPlayerContext = createContext();
import showToast from "../showToast";
import extractUUIDPrefix from "../utils/extractUUIDPrefix";

export function MusicPlayerProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [currentSongUUID, setCurrentSongUUID] = useState(
    () => JSON.parse(localStorage.getItem("currentSongUUID")) || ""
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const [shuffle, setShuffle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(
    () => JSON.parse(localStorage.getItem("isCollapsed")) || false
  );
  const [volume, setVolume] = useState(
    () => Number(JSON.parse(localStorage.getItem("audioVolume"))) || 0.3
  );
  const [currentTime, setCurrentTime] = useState(
    () => Number(JSON.parse(localStorage.getItem("currentTime"))) || 0
  );

  const currentSong = songs.find(
    (song) => extractUUIDPrefix(song.uuid) === currentSongUUID
  );

  const currentIndex = songs.findIndex(
    (song) => extractUUIDPrefix(song.uuid) === currentSongUUID
  );

  const progressAreaRef = useRef();
  const progressBarRef = useRef();
  const playerRef = useRef();
  const musicListRef = useRef();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/songs");
        if (!response.ok) {
          throw new Error("Failed to fetch songs");
        }
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    localStorage.setItem("currentSongUUID", JSON.stringify(currentSongUUID));
  }, [currentSongUUID]);

  useEffect(() => {
    localStorage.setItem(
      "currentTime",
      JSON.stringify(Math.round(currentTime))
    );
  }, [Math.round(currentTime)]);

  const fetchLyrics = async () => {
    if (isCollapsed)
      return showToast(
        "Can't show lyrics when the player is collapsed",
        "warning"
      );
    if (lyrics) return setLyrics("");
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/songs/${currentSong.artist}/${currentSong.name}`
      );
      const lyrics = await response.json();
      if (lyrics.error) return setLyrics(lyrics.error);
      setLyrics(lyrics);
    } catch (error) {
      console.error("Error fetching lyrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (currentTime > 0) {
      playerRef.current.seekTo(currentTime);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNextSong = () => {
    if (shuffle) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * songs.length);
      } while (extractUUIDPrefix(songs[randomIndex].uuid) === currentSongUUID);
      setCurrentSongUUID(extractUUIDPrefix(songs[randomIndex].uuid));
      setIsPlaying(true);
      lyrics && setLyrics("");
    } else {
      const nextIndex = (currentIndex + 1) % songs.length;
      setCurrentSongUUID(extractUUIDPrefix(songs[nextIndex].uuid));
      setIsPlaying(true);
      lyrics && setLyrics("");
    }
    setCurrentTime(0);
  };

  const toggleShufflePlayList = () => {
    setShuffle(!shuffle);
    showToast(
      `Shuffle ${!shuffle ? "enabled" : "disabled"} successfully!`,
      "success"
    );
  };

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
    localStorage.setItem("isCollapsed", JSON.stringify(!isCollapsed));
  };

  const handlePreviousSong = () => {
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSongUUID(extractUUIDPrefix(songs[prevIndex].uuid));
    setIsPlaying(true);
    lyrics && setLyrics("");
    setCurrentTime(0);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    localStorage.setItem("audioVolume", JSON.stringify(newVolume));
  };

  const contextValue = {
    songs,
    setSongs,
    currentSongUUID,
    setCurrentSongUUID,
    currentSong,
    isPlaying,
    setIsPlaying,
    lyrics,
    setLyrics,
    shuffle,
    setShuffle,
    isLoading,
    setIsLoading,
    isCollapsed,
    setIsCollapsed,
    volume,
    setVolume,
    progressAreaRef,
    progressBarRef,
    playerRef,
    musicListRef,
    fetchLyrics,
    handlePlayPause,
    handleNextSong,
    toggleShufflePlayList,
    handleCollapseToggle,
    handlePreviousSong,
    handleVolumeChange,
    currentTime,
    setCurrentTime,
  };

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  return context;
}
