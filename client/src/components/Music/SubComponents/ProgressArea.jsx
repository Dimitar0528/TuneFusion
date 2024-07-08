import React, { useRef, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";

export default function ProgressArea() {
  const {
    progressAreaRef,
    progressBarRef,
    playerRef,
    handleProgressClick,
    songs,
    musicIndex,
    isPlaying,
    volume,
    currentTime,
    setCurrentTime,
    handleNext,
  } = useMusicPlayer();

  const durationRef = useRef();
  const currentRef = useRef();

  const [isDragging, setIsDragging] = useState(false);

  const handleDuration = (duration) => {
    durationRef.current.textContent = getSongTimeStamps(duration);
  };

  const handleProgress = (state) => {
    if (!isDragging) {
      const { playedSeconds, played } = state;
      const duration = playerRef.current.getDuration();
      const progress = played > 0 ? played : currentTime / duration;
      progressBarRef.current.style.width = `${progress * 100}%`;
      currentRef.current.textContent = getSongTimeStamps(currentTime);

      if (playedSeconds > 0) {
        setCurrentTime(Math.round(playedSeconds));
        localStorage.setItem(
          "currentTime",
          JSON.stringify(Math.round(playedSeconds))
        );
      }
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragProgress = (e) => {
    if (isDragging) {
      const progressBarWidth = progressAreaRef.current.clientWidth;
      const offsetX =
        e.clientX - progressAreaRef.current.getBoundingClientRect().left;
      let newProgress = offsetX / progressBarWidth;

      newProgress = Math.min(1, Math.max(0, newProgress));

      const duration = playerRef.current.getDuration();
      const newTime = newProgress * duration;

      setCurrentTime(newTime);
      progressBarRef.current.style.width = `${newProgress * 100}%`;
      currentRef.current.textContent = getSongTimeStamps(newTime);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleDragProgress);
    document.addEventListener("mouseup", handleDragEnd);

    return () => {
      document.removeEventListener("mousemove", handleDragProgress);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [handleDragProgress]);

  return (
    <div
      className="progress-area"
      ref={progressAreaRef}
      onClick={handleProgressClick}
      onMouseDown={handleDragStart}>
      <div className="progress-bar" ref={progressBarRef}></div>
      <div className="timer">
        <span className="current" ref={currentRef}>
          0:00
        </span>
        <span className="duration" ref={durationRef}>
          {getSongTimeStamps(songs[musicIndex]?.duration || 0)}
        </span>
      </div>
      <ReactPlayer
        ref={playerRef}
        className="main-audio"
        url={songs[musicIndex]?.audio_src}
        playing={isPlaying}
        volume={volume}
        onProgress={handleProgress}
        onEnded={handleNext}
        onDuration={handleDuration}
        width="0"
        height="0"
        progressInterval={100}
        playsinline={true}
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
