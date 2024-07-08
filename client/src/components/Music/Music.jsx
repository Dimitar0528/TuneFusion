import React, { useEffect, useRef } from "react";
import MusicPlayer from "./SubComponents/MusicPlayer";
import MusicList from "./SubComponents/MusicList";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
export default function Music({ userRole }) {
  const { setMusicIndex, handlePlayPause } = useMusicPlayer();
  const musicListRef = useRef();

  const handleCurrent = (index) => {
    setMusicIndex(index);
  };
  const showList = () => {
    musicListRef.current.style.opacity = "1";
    musicListRef.current.style.pointerEvents = "auto";
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
      <MusicPlayer showList={showList} userRole={userRole} />

      <MusicList musicListRef={musicListRef} handleCurrent={handleCurrent} />
    </div>
  );
}
