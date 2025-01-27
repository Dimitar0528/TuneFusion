import { useEffect, useState, useCallback, useRef } from "react";
import ReactPlayer from "react-player/lazy";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import { formatTime } from "../../../utils/formatTime";
import SkipNotification from "./SkipNotification";

export default function ProgressArea() {
  const {
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
    showYoutubePlayer,
  } = useMusicPlayer();

  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [skipValue, setSkipValue] = useState(0);

  const progressAreaRef = useRef();
  const progressBarRef = useRef();

  const handleMusicPlayerProgress = (state) => {
    if (!isDragging) {
      const { playedSeconds, played } = state;
      const duration = currentSong.duration;
      const progress = played > 0 ? played : currentTime / duration;
      progressBarRef.current.style.width = `${progress * 100}%`;
      if (playedSeconds > 0) setCurrentTime(Math.round(playedSeconds));
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

        const duration = currentSong.duration;
        const newTime = newProgress * duration;

        setCurrentTime(newTime);
        progressBarRef.current.style.width = `${newProgress * 100}%`;
      }
    },
    [isDragging, currentSong, setCurrentTime]
  );

  const handleProgressBarClick = (e) => {
    const progressBarWidth = progressAreaRef.current.clientWidth;
    const clickedOffsetX = e.nativeEvent.offsetX;
    const newTime = (clickedOffsetX / progressBarWidth) * currentSong.duration;
    playerRef.current.seekTo(newTime);
    setCurrentTime(newTime);
  };

  const handleProgressBarSkip = useCallback(
    (e) => {
      if (e.target.id == 'volume-button') return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const skipAmount = e.key === "ArrowLeft" ? -5 : 5;
        const newTime = Math.max(0,Math.min(playerRef.current.getDuration(), currentTime + skipAmount));
        setCurrentTime(newTime);
        const progress = newTime / currentSong.duration;
        progressBarRef.current.style.width = `${progress * 100}%`;
        playerRef.current.seekTo(newTime, "seconds");
        setSkipValue(skipAmount);
        setIsVisible(true);
        setTimeout(() => setIsVisible(false), 350);
      }
    },
    [currentTime, playerRef, currentSong]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleProgressBarDrag);
    document.addEventListener("mouseup", handleProgressBarDragEnd);
    document.addEventListener("keydown", handleProgressBarSkip);
    return () => {
      document.removeEventListener("mousemove", handleProgressBarDrag);
      document.removeEventListener("mouseup", handleProgressBarDragEnd);
      document.removeEventListener("keydown", handleProgressBarSkip);
    };
  }, [handleProgressBarDrag, handleProgressBarSkip]);
  return (
    <>
      <div
        className="progress-area"
        ref={progressAreaRef}
        onClick={handleProgressBarClick}
        onMouseDown={handleProgressBarDragStart}>
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
        <div
          className="youtube-player"
          style={{
            borderRadius: "2rem",
            overflow: "clip",
            width: "clamp(300px,60vw,100%)",
            height: 410,
            pointerEvents: showYoutubePlayer ? "auto" : "none",
          }}>
          <ReactPlayer
            style={{
              marginTop: "-33.2rem",
              visibility: showYoutubePlayer ? "visible" : "hidden",
              opacity: showYoutubePlayer ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
            }}
            ref={playerRef}
            className="main-audio"
            url={currentSong?.audio_src}
            playing={isPlaying}
            volume={volume}
            onProgress={handleMusicPlayerProgress}
            onEnded={handleNextSong}
            width="100%"
            height="100%"
            progressInterval={10}
            playsinline={true}
            loop={isLooped}
            playbackRate={playBackSpeed}
            controls={false}
          />
        </div>
      </div>
      <SkipNotification skipValue={skipValue} isVisible={isVisible} />
    </>
  );
}
