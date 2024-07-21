import { useEffect, useState, useCallback } from "react";
import ReactPlayer from "react-player/lazy";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import { formatTime } from "../../../utils/formatTime";
export default function ProgressArea() {
  const {
    progressAreaRef,
    progressBarRef,
    playerRef,
    currentSong,
    isPlaying,
    volume,
    currentTime,
    setCurrentTime,
    handleNextSong,
    isLooped,
    playBackSpeed,
    handleKeyPressWhenTabbed,
  } = useMusicPlayer();

  const [isDragging, setIsDragging] = useState(false);

  const handleMusicPlayerProgress = (state) => {
    if (!isDragging) {
      const { playedSeconds, played } = state;
      const duration = currentSong.duration;
      const progress = played > 0 ? played : currentTime / duration;
      progressBarRef.current.style.width = `${progress * 100}%`;
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
  const handleProgressBarDrag = useCallback(
    (e) => {
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
      }
    },
    [isDragging, playerRef, progressAreaRef, setCurrentTime,progressBarRef]
  );

  const handleProgressBarClick = (e) => {
    const progressBarWidth = progressAreaRef.current.clientWidth;
    const clickedOffsetX = e.nativeEvent.offsetX;
    const newTime =
      (clickedOffsetX / progressBarWidth) * playerRef.current.getDuration();
    playerRef.current.seekTo(newTime);
    setCurrentTime(newTime);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      let newTime = currentTime;
      if (e.key === "ArrowLeft") {
        newTime = Math.max(0, currentTime - 1);
      } else if (e.key === "ArrowRight") {
        newTime = Math.min(playerRef.current.getDuration(), currentTime + 1);
      }
      setCurrentTime(newTime);
      const progress = newTime / currentSong.duration;
      progressBarRef.current.style.width = `${progress * 100}%`;
      playerRef.current.seekTo(newTime, "seconds");
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
      onMouseDown={handleProgressBarDragStart}
      onKeyDown={handleKeyDown}>
      <div
        className="progress-bar"
        ref={progressBarRef}
        tabIndex={0}
        onKeyDown={(e) =>
          handleKeyPressWhenTabbed(e, handleProgressBarClick)
        }></div>
      <div className="timer">
        <span className="current">{formatTime(currentTime) || 0}</span>
        <span className="duration">
          {formatTime(currentSong?.duration || 0)}
        </span>
      </div>
      <ReactPlayer
        ref={playerRef}
        className="main-audio"
        url={currentSong?.audio_src}
        playing={isPlaying}
        volume={volume}
        onProgress={handleMusicPlayerProgress}
        onEnded={handleNextSong}
        width="0"
        height="0"
        progressInterval={100}
        playsinline={true}
        loop={isLooped}
        playbackRate={playBackSpeed}
      />
    </div>
  );
}
