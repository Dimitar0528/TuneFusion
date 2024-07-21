import { useEffect, useState } from "react";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";

export default function PlayerControls() {
  const {
    isPlaying,
    handlePlayPause,
    handleNextSong,
    isLooped,
    handleLoopSong,
    playBackSpeed,
    handlePlayBackSpeed,
    handlePreviousSong,
    shuffle,
    handleShufflePlayList,
    lyrics,
    fetchLyrics,
    volume,
    setVolume,
    handleVolumeChange,
    handleKeyPressWhenTabbed,
    showMusicList,
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

      const { code, shiftKey, key } = e;

      switch (true) {
        case key === "m":
          if (volume > 0) {
            setPreviousVolume(volume);
            setVolume(0);
          } else {
            setVolume(previousVolume);
          }
          break;
        case code === "Space":
          e.preventDefault();
          handlePlayPause();
          break;
        case shiftKey && key === "N":
          handleNextSong();
          break;
        case shiftKey && key === "P":
          handlePreviousSong();
          break;
        case shiftKey && key === "R":
          handleLoopSong();
          break;
        case shiftKey && key === "S":
          handleShufflePlayList();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleSpecificKeyPress);
    return () => {
      document.removeEventListener("keydown", handleSpecificKeyPress);
    };
  }, [
    volume,
    handlePlayPause,
    handleLoopSong,
    handleNextSong,
    handlePreviousSong,
    handleShufflePlayList,
    previousVolume,
    setVolume,
  ]);
  return (
    <div className="controls">
      <i
        id="more-music"
        className="fa-solid fa-sliders"
        title="Show Music List"
        onClick={showMusicList}
        tabIndex={0}
        onKeyDown={(e) => handleKeyPressWhenTabbed(e, showMusicList)}></i>
      <i
        id="playback-speed"
        className="fa-solid fa-plus-minus"
        title={`Current playback speed: ${playBackSpeed}. Increase by 0.25`}
        onClick={handlePlayBackSpeed}
        tabIndex={0}
        onKeyDown={(e) => handleKeyPressWhenTabbed(e, handlePlayBackSpeed)}></i>
      <i
        id="shuffle"
        className={`fa-solid ${shuffle ? "fa-repeat" : "fa-shuffle"}`}
        title={`${shuffle ? "Disable" : "Enable"} Shuffle (Shift + S)`}
        onClick={handleShufflePlayList}
        tabIndex={0}
        onKeyDown={(e) =>
          handleKeyPressWhenTabbed(e, handleShufflePlayList)
        }></i>
      <i
        id="prev"
        className="fa-solid fa-backward"
        title="Previous (Shift + P)"
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
        title="Next (Shift + N)"
        onClick={handleNextSong}
        tabIndex={0}
        onKeyDown={(e) => handleKeyPressWhenTabbed(e, handleNextSong)}></i>
      <i
        id="loop"
        className={`fa-solid ${isLooped ? "fa-rotate-right" : "fa-repeat"}`}
        title={`${isLooped ? "Disable Repeat" : "Enable Repeat"} (Shift + R) `}
        onClick={handleLoopSong}
        tabIndex={0}
        onKeyDown={(e) => handleKeyPressWhenTabbed(e, handleLoopSong)}></i>
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
