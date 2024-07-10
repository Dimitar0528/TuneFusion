import React from "react";
import MusicList from "./SubComponents/MusicList";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
export default function Music() {
  const { setMusicIndex } = useMusicPlayer();

  const handleCurrent = (index) => {
    setMusicIndex(index);
  };

  return (
    <div className="body">

      <MusicList handleCurrent={handleCurrent} />
    </div>
  );
}
