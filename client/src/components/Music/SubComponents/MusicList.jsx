import React from "react";
import "./styles/MusicList.css";

export default function MusicList({
  musicData,
  musicIndex,
  handleCurrent,
  hideList,
  lyrics,
  setLyrics,
  setIsPlaying,
  musicListRef,
}) {
  return (
    <div ref={musicListRef} className={`music-list`}>
      <div className="header">
        <div className="row | list">
          <i className="fa-solid fa-sliders"></i>
          <span> Music List</span>
        </div>
        <i id="close" className="fa-solid fa-close" onClick={hideList}></i>
      </div>
      <ul>
        {musicData.map((music, index) => (
          <li
            key={index}
            id={index + 1}
            onClick={() => {
              handleCurrent(index);
              setIsPlaying(true);
              lyrics && setLyrics("");
            }}
            className={index === musicIndex ? "playing" : ""}>
            <div className="row">
              <span>{music.name}</span>
              <p>{music.artist}</p>
            </div>
            {/* <button>Add to playlist</button> */}
          </li>
        ))}
      </ul>
    </div>
  );
}
