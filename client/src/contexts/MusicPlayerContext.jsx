import React, { createContext, useContext, useState, useRef } from "react";
import showToast from "../utils/showToast";
import extractUUIDPrefix from "../utils/extractUUIDPrefix";

import useFetchSongs from "../hooks/fetch-get-hooks/useFetchSongs";
import useFetchUserToken from "../hooks/fetch-get-hooks/useFetchUser";
import useFetchUserPlaylists from "../hooks/fetch-get-hooks/useFetchUserPlaylists";
import useLocalStorage from "../hooks/useLocalStorage";
import useStoredActivePlaylist from "../hooks/useStoredActivePlaylist";
import useUpdateActivePlaylist from "../hooks/useUpdateActivePlaylist";
import useFetchSongLyrics from "../hooks/fetch-get-hooks/useFetchSongLyrics";
const MusicPlayerContext = createContext();

export function MusicPlayerProvider({ children }) {
  const [filteredSongs, setFilteredSongs] = useState([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);

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

  const progressAreaRef = useRef();
  const progressBarRef = useRef();
  const playerRef = useRef();
  const musicListRef = useRef();

  const { songs, loading: isSongLoading } = useFetchSongs();
  const { user, loading: userLoading } = useFetchUserToken();
  const {
    playlists,
    loading: isPlaylistLoading,
    refreshPlaylistHandler,
  } = useFetchUserPlaylists(user?.userUUID);

  const currentSong = songs.find(
    (song) => extractUUIDPrefix(song.uuid) === currentSongUUID
  );
  const currentIndex = filteredSongs?.findIndex(
    (song) => extractUUIDPrefix(song.uuid) === currentSongUUID
  );

  const {
    lyrics,
    loading: islyricsLoading,
    fetchLyrics,
  } = useFetchSongLyrics(currentSong, isCollapsed, showToast);

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
      fetchLyrics();
    } else {
      const nextIndex = (currentIndex + 1) % filteredSongs.length;
      setCurrentSongUUID(extractUUIDPrefix(filteredSongs[nextIndex].uuid));
      setIsPlaying(true);
      fetchLyrics();
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
    fetchLyrics();
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
    shuffle,
    islyricsLoading,
    isPlaylistLoading,
    isSongLoading,
    isCollapsed,
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
    playlists,
    refreshPlaylistHandler,
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
