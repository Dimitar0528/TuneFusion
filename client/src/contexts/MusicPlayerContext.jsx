import { createContext, useContext, useState, useRef } from "react";
import showToast from "../utils/showToast";
import extractUUIDPrefix from "../utils/extractUUIDPrefix";

import { useGetAllSongs, useGetSongLyrics } from "../hooks/CRUD-hooks/useSongs";
import { useGetUserAuthToken } from "../hooks/CRUD-hooks/useAuth";

import useFetchUserPlaylists from "../hooks/fetch-get-hooks/useFetchUserPlaylists";
import useLocalStorage from "../hooks/useLocalStorage";
import useStoredActivePlaylist from "../hooks/useStoredActivePlaylist";
import useUpdateActivePlaylist from "../hooks/useUpdateActivePlaylist";
import { useRefresh } from "../hooks/useRefresh";
const MusicPlayerContext = createContext();

export function MusicPlayerProvider({ children }) {
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [refreshFlag, triggerRefreshHandler] = useRefresh();

  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [isLooped, setIsLooped] = useState(false);
  const [playBackSpeed, setPlayBackSpeed] = useState(1);

  const [activePlaylist, setActivePlaylist] = useState();

  const [currentPage, setCurrentPage] = useState(0);

  const [isCollapsed, setIsCollapsed] = useState(
    () => JSON.parse(localStorage.getItem("isCollapsed")) ?? true
  );
  const [currentSongUUID, setCurrentSongUUID] = useState(
    () => JSON.parse(localStorage.getItem("currentSongUUID")) || ""
  );

  const [songs, isSongLoading] = useGetAllSongs();

  if (currentSongUUID === "" && songs.length > 0) {
    setCurrentSongUUID(extractUUIDPrefix(songs[0].uuid));
  }

  const [volume, setVolume] = useState(
    () => Number(JSON.parse(localStorage.getItem("audioVolume"))) || 0.15
  );
  const [currentTime, setCurrentTime] = useState(
    () => Number(JSON.parse(localStorage.getItem("currentTime"))) || 0
  );

  const playerRef = useRef();
  const musicListRef = useRef();

  const [user] = useGetUserAuthToken();
  const [playlists, isPlaylistLoading] = useFetchUserPlaylists(
    user?.userUUID,
    refreshFlag
  );
  const currentSong = songs.find(
    (song) => extractUUIDPrefix(song.uuid) === currentSongUUID
  );
  const currentIndex = filteredSongs?.findIndex(
    (song) => extractUUIDPrefix(song.uuid) === currentSongUUID
  );

  const [lyrics, islyricsLoading, fetchLyrics, clearLyrics] =
    useGetSongLyrics(currentSong);

  useStoredActivePlaylist(playlists, setActivePlaylist);

  useLocalStorage("currentSongUUID", currentSongUUID);

  useLocalStorage("currentTime", Math.round(currentTime));

  useUpdateActivePlaylist(activePlaylist, songs, setFilteredSongs);

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
      clearLyrics();
    } else {
      const nextIndex = (currentIndex + 1) % filteredSongs.length;
      setCurrentSongUUID(extractUUIDPrefix(filteredSongs[nextIndex].uuid));
      setIsPlaying(true);
      clearLyrics();
    }
    setCurrentTime(0);
  };

  const handleShufflePlayList = () => {
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
    clearLyrics();
    setCurrentTime(0);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    localStorage.setItem("audioVolume", JSON.stringify(newVolume));
  };

  const handleKeyPressWhenTabbed = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  const showMusicList = () => {
    musicListRef.current.style.opacity = "1";
    musicListRef.current.style.pointerEvents = "auto";
  };

  const handleLoopSong = () => {
    setIsLooped((isLooped) => !isLooped);
    showToast(
      `${
        isLooped
          ? "Repeat disabled successfully"
          : "Repeat enabled successfully"
      } `,
      "success"
    );
  };

  const handlePlayBackSpeed = () => {
    const unsupportedAudioFile =
      !currentSong?.audio_src.includes("youtube.com");
    if (unsupportedAudioFile)
      return showToast(
        "The current song does not support this feature",
        "warning"
      );
    const playBackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

    const currentIndex = playBackSpeeds.indexOf(playBackSpeed);

    const nextIndex = (currentIndex + 1) % playBackSpeeds.length;

    setPlayBackSpeed(playBackSpeeds[nextIndex]);
    showToast(`Playback speed set to: ${playBackSpeeds[nextIndex]}`, "success");
  };
  const contextValue = {
    songs,
    filteredSongs,
    setFilteredSongs,
    currentSongUUID,
    setCurrentSongUUID,
    currentSong,
    isPlaying,
    setIsPlaying,
    lyrics,
    clearLyrics,
    shuffle,
    islyricsLoading,
    isPlaylistLoading,
    isSongLoading,
    isCollapsed,
    volume,
    setVolume,
    playerRef,
    musicListRef,
    fetchLyrics,
    handlePlayPause,
    handleNextSong,
    isLooped,
    handleLoopSong,
    playBackSpeed,
    handlePlayBackSpeed,
    handleShufflePlayList,
    handleCollapseToggle,
    handlePreviousSong,
    handleVolumeChange,
    currentTime,
    setCurrentTime,
    playlists,
    refreshFlag,
    triggerRefreshHandler,
    activePlaylist,
    setActivePlaylist,
    currentPage,
    setCurrentPage,
    user,
    handleKeyPressWhenTabbed,
    showMusicList,
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
