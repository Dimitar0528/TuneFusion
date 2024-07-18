import React, { useEffect, useState } from "react";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";

export default function PlayerControls({ showList }) {
  const {
    isPlaying,
    handlePlayPause,
    handleNextSong,
    handlePreviousSong,
    shuffle,
    toggleShufflePlayList,
    lyrics,
    fetchLyrics,
    volume,
    setVolume,
    handleVolumeChange,
    handleKeyPressWhenTabbed,
  } = useMusicPlayer();
  const [previousVolume, setPreviousVolume] = useState(volume);

  const handleVolumeChangeKeyPress = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleVolumeChange({
        target: { value: Math.min(volume + 0.01, 1) },
      });
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleVolumeChange({
        target: { value: Math.max(volume - 0.01, 0) },
      });
    }
  };

  useEffect(() => {
    const handleSpecificKeyPress = (e) => {
      const targetTagName = e.target.tagName.toLowerCase();
      const isInputFocused = ["input", "select", "textarea"].includes(
        targetTagName
      );

      if (isInputFocused) return;

      if (e.key === "m" || e.key === "п") {
        e.preventDefault();
        if (volume > 0) {
          setPreviousVolume(volume);
          setVolume(0);
        } else {
          setVolume(previousVolume);
        }
      }

      if (e.code === "Space") {
        e.preventDefault();
        handlePlayPause();
      }
    };

    document.addEventListener("keydown", handleSpecificKeyPress);
    return () => {
      document.removeEventListener("keydown", handleSpecificKeyPress);
    };
  }, [volume, handlePlayPause]);

  return (
    <div className="controls">
      <i
        id="more-music"
        className="fa-solid fa-sliders"
        title="Show Music List"
        onClick={showList}
        tabIndex={0}
        onKeyDown={(e) => handleKeyPressWhenTabbed(e, showList)}></i>
      <i
        id="shuffle"
        className={`fa-solid ${shuffle ? "fa-repeat" : "fa-shuffle"}`}
        title={`${shuffle ? "Disable" : "Enable"} Shuffle`}
        onClick={toggleShufflePlayList}
        tabIndex={0}
        onKeyDown={(e) =>
          handleKeyPressWhenTabbed(e, toggleShufflePlayList)
        }></i>
      <i
        id="prev"
        className="fa-solid fa-backward"
        title="Previous"
        onClick={handlePreviousSong}
        tabIndex={0}
        onKeyDown={(e) => handleKeyPressWhenTabbed(e, handlePreviousSong)}></i>
      <div
        className="play-pause text-center"
        title={isPlaying ? "Pause (space)" : "Play (space)"}
        onClick={handlePlayPause}
        tabIndex={0}
        onKeyDown={(e) => handleKeyPressWhenTabbed(e, handlePlayPause)}>
        <i className={`fa-solid fa-${isPlaying ? "pause" : "play"}`}></i>
      </div>
      <i
        id="next"
        className="fa-solid fa-forward"
        title="Next"
        onClick={handleNextSong}
        tabIndex={0}
        onKeyDown={(e) => handleKeyPressWhenTabbed(e, handleNextSong)}></i>
      <div className="lyrics-wrapper">
        <i
          id="lyrics"
          className={`fa-solid ${lyrics ? "fa-link-slash" : "fa-music"} `}
          title={`${lyrics ? "Hide Lyrics" : "Show Lyrics"}`}
          onClick={fetchLyrics}
          tabIndex={0}
          onKeyDown={(e) => handleKeyPressWhenTabbed(e, fetchLyrics)}></i>
      </div>
      <div className="volume-control">
        <i
          id="volume-button"
          className={`fa-solid ${
            volume <= 0.01
              ? "fa-volume-xmark"
              : volume < 0.25
              ? "fa-volume-off"
              : volume < 0.6
              ? "fa-volume-low"
              : "fa-volume-high"
          }`}
          title={`${volume <= 0 ? "Unmute (m)" : "Mute (m)"}`}
          tabIndex={0}
          onKeyDown={(e) => handleVolumeChangeKeyPress(e)}>
          <div className="range">
            &nbsp;
            <input
              tabIndex={0}
              type="range"
              id="volume"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </i>
      </div>
    </div>
  );
}
