import React from "react";
import ReactPlayer from "react-player";

export default function ProgressArea({
  progressAreaRef,
  progressBarRef,
  playerRef,
  handleProgressClick,
  handleDuration,
  url,
  isPlaying,
  volume,
  handleNext,
}) {
  return (
    <div
      className="progress-area"
      ref={progressAreaRef}
      onClick={handleProgressClick}>
      <div className="progress-bar" ref={progressBarRef}></div>
      <div className="timer">
        <span className="current">0:00</span>
        <span className="duration"> 0:00</span>
      </div>
      <ReactPlayer
        ref={playerRef}
        className="main-audio"
        url={url}
        playing={isPlaying}
        volume={volume}
        controls={true}
        onProgress={(state) => {
          const { playedSeconds, played } = state;
          progressBarRef.current.style.width = `${played * 100}%`;
          const currentTimeElement = document.querySelector(".current");
          if (currentTimeElement) {
            currentTimeElement.textContent = getSongTimeStamps(playedSeconds);
          }
        }}
        onEnded={handleNext}
        onDuration={handleDuration}
        width="0"
        height="0"
      />
    </div>
  );
}

const getSongTimeStamps = (time) => {
  const min = Math.floor(time / 60);
  let sec = Math.floor(time % 60);
  if (sec < 10) sec = `0${sec}`;
  return `${min}:${sec}`;
};
