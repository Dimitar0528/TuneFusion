import React, { useState, useRef } from "react";
import "./styles/MusicList.css";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import { formatDate } from "../../../utils/formatDate";
import extractUUIDPrefix from "../../../utils/extractUUIDPrefix";
import ReactPaginate from "react-paginate";
import { getSongTimeStamp } from "../../../utils/getSongTimeStamp";
export default function MusicList({ songs, title }) {
  const {
    currentSongUUID,
    setCurrentSongUUID,
    lyrics,
    setLyrics,
    setIsPlaying,
    musicListRef,
    isPlaying,
  } = useMusicPlayer();
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 10;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentSongs = songs.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(songs.length / itemsPerPage);

  const hideList = () => {
    musicListRef.current.style.opacity = "0";
    musicListRef.current.style.pointerEvents = "none";
  };

  const handleCurrentPlayingSong = (songUUID) => {
    setCurrentSongUUID(songUUID);
  };
  const handleMusicListSong = (song) => {
    handleCurrentPlayingSong(extractUUIDPrefix(song.uuid));
    setIsPlaying(true);
    lyrics && setLyrics("");
    extractUUIDPrefix(song.uuid) === currentSongUUID &&
      isPlaying &&
      setIsPlaying(false);
  };
  return (
    <div ref={musicListRef} className="music-list">
      <div className="header">
        <div className="row list">
          <i className="fa-solid fa-sliders"></i>
          <span> {title}</span>
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
          {currentSongs.map((song, index) => (
            <tr
              key={song.uuid}
              onClick={() => handleMusicListSong(song)}
              className={
                extractUUIDPrefix(song.uuid) === currentSongUUID
                  ? "playing"
                  : "tr"
              }>
              <td>{offset + index + 1}</td>
              <td>
                <img
                  width={40}
                  height={40}
                  src={song.img_src}
                  alt={song.name}
                  style={{ objectFit: "cover" }}
                />
              </td>
              <td>
                <div>
                  <strong>{song.name}</strong>
                  <p>{song.artist}</p>
                </div>
              </td>
              <td>{formatDate(song.createdAt)}</td>
              <td>{getSongTimeStamp(song.duration)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      )}
    </div>
  );
}
