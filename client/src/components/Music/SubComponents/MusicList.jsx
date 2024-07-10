import React, { useRef } from "react";
import "./styles/MusicList.css";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import { formatDate } from "../../../utils/formatDate";

export default function MusicList({ handleCurrent }) {
  const {
    songs,
    musicIndex,
    lyrics,
    setLyrics,
    setIsPlaying,
    musicListRef,
    getSongTimeStamps,
  } = useMusicPlayer();

  const hideList = () => {
    musicListRef.current.style.opacity = "0";
    musicListRef.current.style.pointerEvents = "none";
  };

  return (
    <div ref={musicListRef} className="music-list">
      <div className="header">
        <div className="row list">
          <i className="fa-solid fa-sliders"></i>
          <span> Music List</span>
        </div>
        <i id="close" className="fa-solid fa-close" onClick={hideList}></i>
      </div>
      <table className="music-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Cover</th>
            <th>Title / Artist</th>
            <th>Date Added</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr
              key={song.uuid}
              className={index === musicIndex ? "playing" : ""}
              onClick={() => {
                handleCurrent(index);
                setIsPlaying(true);
                lyrics && setLyrics("");
              }}>
              <td>{index + 1}</td>
              <td>
                <img
                  width={40}
                  height={40}
                  src={song.img_src}
                  alt={song.name}
                />
              </td>
              <td>
                <div>
                  <strong>{song.name}</strong>
                  <p>{song.artist}</p>
                </div>
              </td>
              <td>{formatDate(song.createdAt)}</td>
              <td>{getSongTimeStamps(song.duration)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
