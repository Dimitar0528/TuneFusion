import { useEffect, useState } from "react";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import { PiPHandler } from "./PiPHandler";
export default function PlayerControls({
  excludeElementsWhenInPiPModeFlag,
  pipWindow,
  setPiPWindow,
}) {
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
    handleCollapseToggle,
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
  const handleVolumeMuteChange = (e) => {
    if (e.target.name === "input") return;
    if (volume > 0) {
      setPreviousVolume(volume);
      setVolume(0);
    } else {
      setVolume(previousVolume);
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
        case key === "m" || key === "M":
          handleVolumeMuteChange(e);
          break;
        case code === "Space":
          e.preventDefault();
          handlePlayPause();
          break;
        case (shiftKey && key === "n") || key === "N":
          handleNextSong();
          break;
        case (shiftKey && key === "p") || key === "P":
          handlePreviousSong();
          break;
        case (shiftKey && key === "r") || key === "R":
          handleLoopSong();
          break;
        case (shiftKey && key === "s") || key === "S":
          handleShufflePlayList();
          break;
        case (shiftKey && key === "t") || key === "T":
          handleCollapseToggle();
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
      {excludeElementsWhenInPiPModeFlag !== true && (
        <PiPHandler pipWindow={pipWindow} setPiPWindow={setPiPWindow} />
      )}
      <div className="playback-speed" id="playback-speed">
        <span>{playBackSpeed}x</span>
        <div className="playback-speed-btns">
          <i
            title="Decrease playback speed by 0.15"
            className="fa-solid fa-minus"
            onClick={() => handlePlayBackSpeed("decrease")}
            tabIndex={0}
            onKeyDown={(e) =>
              handleKeyPressWhenTabbed(e, () => handlePlayBackSpeed("decrease"))
            }></i>
          <i
            title="Increase playback speed by 0.15"
            className="fa-solid fa-plus"
            onClick={() => handlePlayBackSpeed("increase")}
            tabIndex={0}
            onKeyDown={(e) =>
              handleKeyPressWhenTabbed(e, () => handlePlayBackSpeed("increase"))
            }></i>
        </div>
      </div>
      <i
        id="shuffle"
        className={`fa-solid ${shuffle ? "fa-ban" : "fa-shuffle"}`}
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
      <div
        className="lyrics-wrapper | fa-solid"
        title={`${lyrics ? "Hide Lyrics" : "Show Lyrics"}`}
        onClick={fetchLyrics}
        tabIndex={0}
        onKeyDown={(e) => handleKeyPressWhenTabbed(e, fetchLyrics)}>
        {lyrics ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={22}
            height={22}
            viewBox="0 0 20 20">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M2.22 2.22a.75.75 0 0 1 1.06 0l4.46 4.46q.192-.268.432-.508l3-3a4 4 0 0 1 5.657 5.656l-1.225 1.225a.75.75 0 1 1-1.06-1.06l1.224-1.225a2.5 2.5 0 0 0-3.536-3.536l-3 3a2.5 2.5 0 0 0-.406.533l2.59 2.59a2.5 2.5 0 0 0-.79-1.254a.75.75 0 1 1 .977-1.138q.117.1.226.209a4 4 0 0 1 1.08 3.677l4.871 4.87a.75.75 0 1 1-1.06 1.061l-5.177-5.177l-.006-.005l-4.134-4.134l-.005-.006L2.22 3.28a.75.75 0 0 1 0-1.06m3.237 7.727a.75.75 0 0 1 0 1.06l-1.225 1.225a2.5 2.5 0 0 0 3.536 3.536l1.879-1.879a.75.75 0 1 1 1.06 1.06L8.83 16.83a4 4 0 0 1-5.657-5.657l1.224-1.225a.75.75 0 0 1 1.06 0"
              clipRule="evenodd"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={22}
            height={22}
            viewBox="0 0 23 23">
            <path
              fill="currentColor"
              d="M6 14h4v-2H6zm13-2q-1.25 0-2.125-.875T16 9t.875-2.125T19 6q.275 0 .513.05t.487.125V1h4v2h-2v6q0 1.25-.875 2.125T19 12M6 11h7V9H6zm0-3h7V6H6zm0 10l-4 4V4q0-.825.588-1.412T4 2h11q.825 0 1.413.588T17 4v.425q-1.375.6-2.187 1.838T14 9t.813 2.738T17 13.575V16q0 .825-.587 1.413T15 18z"></path>
          </svg>
        )}
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
          onClick={(e) => handleVolumeMuteChange(e)}
          onKeyDown={(e) => handleVolumeChangeKeyPress(e)}>
          <div className="range">
            <label htmlFor="volume">
              <input
                title="volume"
                placeholder="volume"
                tabIndex={0}
                type="range"
                name="input"
                id="volume"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
              />
            </label>
          </div>
        </i>
      </div>
    </div>
  );
}
