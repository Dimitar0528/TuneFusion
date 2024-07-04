import React, { useState, useRef } from "react";
import MusicPlayer from "./SubComponents/MusicPlayer";
import MusicList from "./SubComponents/MusicList";
import { useNavigate } from "react-router-dom";
export default function Music({ setMusicIndex, musicIndex, songs, userRole }) {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const musicListRef = useRef();

  const handleCurrent = (index) => {
    setMusicIndex(index);
  };

  const showList = () => {
    musicListRef.current.style.opacity = "1";
    musicListRef.current.style.pointerEvents = "auto";
  };

  const hideList = () => {
    musicListRef.current.style.opacity = "0";
    musicListRef.current.style.pointerEvents = "none";
  };

  return (
    <div className="body">
      <MusicPlayer
        songs={songs}
        musicIndex={musicIndex}
        setMusicIndex={setMusicIndex}
        lyrics={lyrics}
        setLyrics={setLyrics}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        showList={showList}
        userRole={userRole}
      />

      <MusicList
        songs={songs}
        musicIndex={musicIndex}
        handleCurrent={handleCurrent}
        hideList={hideList}
        lyrics={lyrics}
        setLyrics={setLyrics}
        setIsPlaying={setIsPlaying}
        musicListRef={musicListRef}
      />
    </div>
  );
}
