import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import showToast from "../showToast";
import extractUUIDPrefix from "../utils/extractUUIDPrefix";

const MusicPlayerContext = createContext();

export function MusicPlayerProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  const [songs, setSongs] = useState([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const [shuffle, setShuffle] = useState(false);

  const [filteredSongs, setFilteredSongs] = useState([]);
  const [activePlaylist, setActivePlaylist] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(
    () => JSON.parse(localStorage.getItem("isCollapsed")) || false
  );
  const [currentSongUUID, setCurrentSongUUID] = useState(
    () => JSON.parse(localStorage.getItem("currentSongUUID")) || ""
  );
  const [volume, setVolume] = useState(
    () => Number(JSON.parse(localStorage.getItem("audioVolume"))) || 0.3
  );
  const [currentTime, setCurrentTime] = useState(
    () => Number(JSON.parse(localStorage.getItem("currentTime"))) || 0
  );

  const [user, setUser] = useState({
    userUUID: "",
    role: "",
  });

  const progressAreaRef = useRef();
  const progressBarRef = useRef();
  const playerRef = useRef();
  const musicListRef = useRef();

  const currentSong = songs.find(
    (song) => extractUUIDPrefix(song.uuid) === currentSongUUID
  );
  const currentIndex = filteredSongs?.findIndex(
    (song) => extractUUIDPrefix(song.uuid) === currentSongUUID
  );

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/songs");
        if (!response.ok) {
          throw new Error("Failed to fetch songs");
        }
        const data = await response.json();
        setSongs(data);
        if (!activePlaylist) {
          setFilteredSongs(data.slice(0, 20));
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };
    fetchSongs();

    const getUserToken = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/getToken",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user token");
        }

        const token = await response.json();
        setUser({
          userUUID: token.id.slice(0, 6),
          role: token.role,
        });
      } catch (error) {
        console.error("Error fetching user token:", error);
      }
    };
    getUserToken();
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

  useEffect(() => {
    if (activePlaylist) {
      localStorage.setItem(
        "activePlaylist",
        JSON.stringify({
          name: activePlaylist?.name,
          activeIndex: activePlaylist?.activeIndex,
        })
      );
      setFilteredSongs(activePlaylist.Songs);
    } else {
      setFilteredSongs(songs.slice(0, 20));
    }
    setCurrentPage(0);
  }, [activePlaylist]);

  const fetchLyrics = async () => {
    if (isCollapsed) {
      return showToast(
        "Can't show lyrics when the player is collapsed",
        "warning"
      );
    }
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
        randomIndex = Math.floor(Math.random() * filteredSongs.length);
      } while (
        extractUUIDPrefix(filteredSongs[randomIndex].uuid) === currentSongUUID
      );
      setCurrentSongUUID(extractUUIDPrefix(filteredSongs[randomIndex].uuid));
      setIsPlaying(true);
      lyrics && setLyrics("");
    } else {
      const nextIndex = (currentIndex + 1) % filteredSongs.length;
      setCurrentSongUUID(extractUUIDPrefix(filteredSongs[nextIndex].uuid));
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
    const prevIndex =
      (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
    setCurrentSongUUID(extractUUIDPrefix(filteredSongs[prevIndex].uuid));
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
    filteredSongs,
    setFilteredSongs,
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
    activePlaylist,
    setActivePlaylist,
    currentPage,
    setCurrentPage,
    user,
    setUser,
  };

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
}
