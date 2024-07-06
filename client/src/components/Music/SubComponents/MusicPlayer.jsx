import React, { useState, useRef, useEffect } from "react";
import "./styles/MusicPlayer.css";
import "react-toastify/dist/ReactToastify.css";
import PlayerControls from "./PlayerControls";
import SongDetails from "./SongDetails";
import ProgressArea from "./ProgressArea";
import { useNavigate } from "react-router-dom";
import showToast from "../../../showToast.js";
export default function MusicPlayer({
  songs,
  musicIndex,
  setMusicIndex,
  lyrics,
  setLyrics,
  isPlaying,
  setIsPlaying,
  showList,
  userRole,
}) {
  const navigate = useNavigate();
  const [shuffle, setShuffle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(
    () => JSON.parse(localStorage.getItem("isCollapsed")) || false
  );
  const [volume, setVolume] = useState(
    () => Number(JSON.parse(localStorage.getItem("audioVolume"))) || 0.3
  );
  const progressAreaRef = useRef();
  const progressBarRef = useRef();
  const songRef = useRef();
  const nameRef = useRef();
  const imageRef = useRef();
  const playerRef = useRef();
  const currentRef = useRef();
  const durationRef = useRef();

  useEffect(() => {
    localStorage.setItem("songIndex", JSON.stringify(musicIndex));
    if (songs.length > 0) {
      loadMusic(musicIndex);
    }
  }, [songs, musicIndex]);

  const loadMusic = async (index) => {
    const music = songs[index];
    songRef.current.textContent = music.name;
    nameRef.current.textContent = music.artist;
    imageRef.current.src = music.img_src;
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
  };

  const toggleShufflePlayList = () => {
    setShuffle(!shuffle);
    showToast(`Shuffle ${!shuffle ? "enabled!" : "disabled!"}`, "success");
  };

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
    localStorage.setItem("isCollapsed", JSON.stringify(!isCollapsed));
  };

  const handlePrev = () => {
    setMusicIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
    setIsPlaying(true);
    lyrics && setLyrics("");
  };

  const handleProgressClick = (e) => {
    const progressBarWidth = progressAreaRef.current.clientWidth;
    const clickedOffsetX = e.nativeEvent.offsetX;
    const newTime =
      (clickedOffsetX / progressBarWidth) * playerRef.current.getDuration();
    playerRef.current.seekTo(newTime);
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

  const handleDuration = (duration) => {
    durationRef.current.textContent = getSongTimeStamps(duration);
  };

  const handleKeyPress = (event, action) => {
    if (event.key === "Enter") {
      action();
    }
  };
  
  return (
    <div className={`wrapper ${isCollapsed && "collapsed"}`}>
      <div className="top-section">
        {userRole === "admin" && (
          <i
            className="fa-solid fa-pen-to-square"
            title="Update Song"
            onClick={() => {
              navigate(`/updatesong/${songs[musicIndex].name}`);
            }}
            tabIndex={0}
            onKeyDown={(event) =>
              handleKeyPress(event, () =>
                navigate(`/updatesong/${songs[musicIndex].name}`)
              )
            }></i>
        )}
        <h2>{isPlaying ? "Now Playing" : "TuneFusion"}</h2>
        <i
          className={`fa-solid ${
            !isCollapsed ? " fa-arrow-down" : " fa-arrow-up"
          }`}
          onClick={handleCollapseToggle}
          title={`${!isCollapsed ? "Collapse" : "Full View"}`}
          tabIndex={0}
          onKeyDown={(event) =>
            handleKeyPress(event, handleCollapseToggle)
          }></i>
      </div>

      <SongDetails
        isLoading={isLoading}
        lyrics={lyrics}
        fetchLyrics={fetchLyrics}
        songRef={songRef}
        nameRef={nameRef}
        imageRef={imageRef}
        songs={songs}
        musicIndex={musicIndex}
      />

      {songs.length > 0 && musicIndex >= 0 && (
        <ProgressArea
          progressAreaRef={progressAreaRef}
          progressBarRef={progressBarRef}
          playerRef={playerRef}
          handleProgressClick={handleProgressClick}
          handleDuration={handleDuration}
          url={songs[musicIndex].audio_src}
          isPlaying={isPlaying}
          volume={volume}
          handleNext={handleNext}
          currentRef={currentRef}
          durationRef={durationRef}
        />
      )}

      <PlayerControls
        songs={songs}
        musicIndex={musicIndex}
        isPlaying={isPlaying}
        handlePlayPause={handlePlayPause}
        handleNext={handleNext}
        handlePrev={handlePrev}
        shuffle={shuffle}
        toggleShufflePlayList={toggleShufflePlayList}
        lyrics={lyrics}
        fetchLyrics={fetchLyrics}
        volume={volume}
        handleVolumeChange={handleVolumeChange}
        showList={showList}
      />
    </div>
  );
}
