import React from "react";

export default function PlayerControls({
  isPlaying,
  handlePlayPause,
  handleNext,
  handlePrev,
  shuffle,
  toggleShufflePlayList,
  lyrics,
  fetchLyrics,
  volume,
  handleVolumeChange,
  showList,
}) {
  return (
    <div className="controls">
      <i
        id="more-music"
        className="fa-solid fa-sliders"
        title="Show Music List"
        onClick={showList}></i>
      <i
        id="shuffle"
        className={`fa-solid ${shuffle ? "fa-repeat" : "fa-shuffle"}`}
        title={`${shuffle ? "Disable" : "Enable"} Shuffle`}
        onClick={toggleShufflePlayList}></i>
      <i
        id="prev"
        className="fa-solid fa-backward"
        title="Previous"
        onClick={handlePrev}></i>
      <div
        className="play-pause text-center"
        title={isPlaying ? "Pause" : "Play"}
        onClick={handlePlayPause}>
        <i className={`fa-solid fa-${isPlaying ? "pause" : "play"}`}></i>
      </div>
      <i
        id="next"
        className="fa-solid fa-forward"
        title="Next"
        onClick={handleNext}></i>
      <div className="lyrics-wrapper">
        <i
          id="lyrics"
          className={`fa-solid ${lyrics ? "fa-link-slash" : "fa-music"} `}
          title={`${lyrics ? "Hide Lyrics" : "Show Lyrics"}`}
          onClick={fetchLyrics}></i>
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
          title="Volume">
          <div className="range">
            &nbsp;
            <input
              type="range"
              id="volume"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              style={{ transform: "rotate(-90deg)" }}
            />
          </div>
        </i>
      </div>
    </div>
  );
}
