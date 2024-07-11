import React, { useRef, useEffect, useState } from "react";
import ReactPlayer from "react-player/lazy";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import extractUUIDPrefix from "../../../utils/extractUUIDPrefix";
export default function ProgressArea() {
  const {
    progressAreaRef,
    progressBarRef,
    playerRef,
    handleProgressBarClick,
    songs,
    currentSongUUID,
    isPlaying,
    volume,
    currentTime,
    setCurrentTime,
    handleNextSong,
    getSongTimeStamps,
  } = useMusicPlayer();

  const durationRef = useRef();
  const currentRef = useRef();

  const [isDragging, setIsDragging] = useState(false);

  const handleMusicPlayerProgress = (state) => {
    if (!isDragging) {
      const { playedSeconds, played } = state;
      const duration = songs.find(
        (song) => extractUUIDPrefix(song.uuid) === currentSongUUID
      )?.duration;

      const progress = played > 0 ? played : currentTime / duration;
      progressBarRef.current.style.width = `${progress * 100}%`;
      currentRef.current.textContent = getSongTimeStamps(currentTime);
      if (playedSeconds <= 0) return;
      setCurrentTime(Math.round(playedSeconds));
    }
  };

  const handleProgressBarDragStart = () => {
    setIsDragging(true);
  };

  const handleProgressBarDragEnd = () => {
    setIsDragging(false);
  };

  const handleProgressBarDrag = (e) => {
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
    document.addEventListener("mousemove", handleProgressBarDrag);
    document.addEventListener("mouseup", handleProgressBarDragEnd);

    return () => {
      document.removeEventListener("mousemove", handleProgressBarDrag);
      document.removeEventListener("mouseup", handleProgressBarDragEnd);
    };
  }, [handleProgressBarDrag]);

  return (
    <div
      className="progress-area"
      ref={progressAreaRef}
      onClick={handleProgressBarClick}
      onMouseDown={handleProgressBarDragStart}>
      <div className="progress-bar" ref={progressBarRef}></div>
      <div className="timer">
        <span className="current" ref={currentRef}>
          0:00
        </span>
        <span className="duration" ref={durationRef}>
          {getSongTimeStamps(
            songs.find(
              (song) => extractUUIDPrefix(song.uuid) === currentSongUUID
            )?.duration || 0
          )}
        </span>
      </div>
      <ReactPlayer
        ref={playerRef}
        className="main-audio"
        url={
          songs.find((song) => extractUUIDPrefix(song.uuid) === currentSongUUID)
            ?.audio_src
        }
        playing={isPlaying}
        volume={volume}
        onProgress={handleMusicPlayerProgress}
        onEnded={handleNextSong}
        width="0"
        height="0"
        progressInterval={100}
        playsinline={true}
      />
    </div>
  );
}
