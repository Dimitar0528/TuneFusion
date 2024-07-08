import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

const MusicPlayerContext = createContext();
import showToast from "../showToast";

export function MusicPlayerProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [musicIndex, setMusicIndex] = useState(
    () => JSON.parse(localStorage.getItem("songIndex")) || 0
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

  const progressAreaRef = useRef();
  const progressBarRef = useRef();
  const songRef = useRef();
  const nameRef = useRef();
  const imageRef = useRef();
  const playerRef = useRef();

  useEffect(() => {
    localStorage.setItem("songIndex", JSON.stringify(musicIndex));
    if (songs.length > 0) {
      loadMusic(musicIndex);
    }
  }, [songs, musicIndex]);

  const loadMusic = async (index) => {
    const music = songs[index];
    if (songRef.current) songRef.current.textContent = music.name;
    if (nameRef.current) nameRef.current.textContent = music.artist;
    if (imageRef.current) imageRef.current.src = music.img_src;
  };

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
        `http://localhost:3000/api/songs/${songs[musicIndex].artist}/${songs[musicIndex].name}`
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

  const handleNext = () => {
    if (shuffle) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * songs.length);
      } while (randomIndex === musicIndex);
      setMusicIndex(randomIndex);
      setIsPlaying(true);
      lyrics && setLyrics("");
    } else {
      setMusicIndex((prevIndex) => (prevIndex + 1) % songs.length);
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

  const handlePrev = () => {
    setMusicIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
    setIsPlaying(true);
    lyrics && setLyrics("");
    setCurrentTime(0);
  };

  const handleProgressClick = (e) => {
    const progressBarWidth = progressAreaRef.current.clientWidth;
    const clickedOffsetX = e.nativeEvent.offsetX;
    const newTime =
      (clickedOffsetX / progressBarWidth) * playerRef.current.getDuration();
    playerRef.current.seekTo(newTime);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    localStorage.setItem("audioVolume", JSON.stringify(newVolume));
  };

  const getSongTimeStamps = (time) => {
    const min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    if (sec < 10) sec = `0${sec}`;
    return `${min}:${sec}`;
  };

  const contextValue = {
    songs,
    setSongs,
    musicIndex,
    setMusicIndex,
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
    songRef,
    nameRef,
    imageRef,
    playerRef,
    loadMusic,
    fetchLyrics,
    handlePlayPause,
    handleNext,
    toggleShufflePlayList,
    handleCollapseToggle,
    handlePrev,
    handleProgressClick,
    handleVolumeChange,
    getSongTimeStamps,
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
