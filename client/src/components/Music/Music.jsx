import React, { useEffect, useRef } from "react";
import MusicList from "./SubComponents/MusicList";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
export default function Music() {
  const { setMusicIndex, handlePlayPause, musicListRef } = useMusicPlayer();

  const handleCurrent = (index) => {
    setMusicIndex(index);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        handlePlayPause();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handlePlayPause]);

  return (
    <div className="body">

      <MusicList handleCurrent={handleCurrent} />
    </div>
  );
}
