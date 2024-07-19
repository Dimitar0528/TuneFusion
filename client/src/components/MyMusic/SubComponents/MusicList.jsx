import React, { useState } from "react";
import "./styles/MusicList.css";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import { formatDate } from "../../../utils/formatDate";
import extractUUIDPrefix from "../../../utils/extractUUIDPrefix";
import ReactPaginate from "react-paginate";
import { formatTime } from "../../../utils/formatTime";
import showToast from "../../../utils/showToast";

export default function MusicList({ songs, title, activePlaylist, playlists }) {
  const {
    currentSongUUID,
    setCurrentSongUUID,
    lyrics,
    setLyrics,
    setIsPlaying,
    musicListRef,
    isPlaying,
    currentPage,
    setCurrentPage,
    handleKeyPressWhenTabbed,
  } = useMusicPlayer();

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

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

  const handleAddSongToPlayList = (song) => {
    setSelectedSong(song);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedSong(null);
  };

  const handlePlaylistSelect = (e) => {
    setSelectedPlaylist(e.target.value);
  };

  const handleAddSongConfirm = async () => {
    if (!selectedPlaylist && !selectedSong)
      return showToast("Please select a playlist first", "warning");

    try {
      const response = await fetch(
        "http://localhost:3000/api/playlists/add-song",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            songUUID: selectedSong.uuid,
            playlistUUID: selectedPlaylist,
          }),
        }
      );

      if (response.ok) {
        showToast("Song added to playlist successfully", "success");
        handleModalClose();
      } else {
        const errorData = await response.json();
        showToast(`Error: ${errorData.error}`, "error");
      }
    } catch (error) {
      console.error("Error adding song to playlist:", error);
      showToast(
        "An error occurred while adding the song to the playlist.",
        "error"
      );
    }
  };

  const handleRemoveSongFromPlaylist = async (song) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this song from the playlist?"
      )
    )
      return;
    try {
      const response = await fetch(
        "http://localhost:3000/api/playlists/remove-song",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            songUUID: song.uuid,
            playlistName: activePlaylist.name,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        showToast(data.message, "success");
      } else {
        const errorData = await response.json();
        showToast(`Error: ${errorData.error}`, "error");
      }
    } catch (error) {
      console.error("Error removing song from playlist:", error);
      showToast(
        "An error occurred while removing the song from the playlist.",
        "error"
      );
    }
  };

  const totalDuration = activePlaylist?.Songs.reduce((total, song) => {
    return total + song.duration;
  }, 0);

  return (
    <div ref={musicListRef} className="music-list">
      <div className="header">
        <div className="row list">
          <i className="fa-solid fa-sliders"></i>
          <span> {title}</span>
        </div>
        <i
          tabIndex={0}
          id="close"
          className="fa-solid fa-close"
          onClick={hideList}
          onKeyDown={(e) => handleKeyPressWhenTabbed(e, hideList)}></i>
      </div>
      {activePlaylist && (
        <div className="playlist-description">
          <p>{activePlaylist?.description}</p>
          <p>
            {activePlaylist?.Songs.length} songs ,
            <span>Total duration: {formatTime(totalDuration)}</span>
          </p>
        </div>
      )}

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
              <td
                className="playlist-song-details"
                onClick={() => handleMusicListSong(song)}>
                <div>
                  <strong>{song.name}</strong>
                  <p>{song.artist}</p>
                </div>
              </td>
              <td>
                {song.PlaylistSong
                  ? formatDate(song.PlaylistSong.createdAt)
                  : formatDate(song.createdAt)}
              </td>
              <td>{formatTime(song.duration)}</td>
              {activePlaylist ? (
                <td>
                  <i
                    tabIndex={0}
                    className="fa-solid fa-circle-minus"
                    onClick={() => handleRemoveSongFromPlaylist(song)}
                    onKeyDown={(e) =>
                      handleKeyPressWhenTabbed(e, () => {
                        handleRemoveSongFromPlaylist(song);
                      })
                    }
                    title="Remove from playlist"></i>
                </td>
              ) : (
                <td>
                  <i
                    tabIndex={0}
                    className="fa-solid fa-plus"
                    onClick={() => handleAddSongToPlayList(song)}
                    onKeyDown={(e) =>
                      handleKeyPressWhenTabbed(e, () => {
                        handleAddSongToPlayList(song);
                      })
                    }
                    title="Add to playlist"></i>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {pageCount > 1 && (
        <ReactPaginate
          forcePage={currentPage}
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      )}

      {showModal && (
        <dialog open className="modal">
          <div className="modal-content">
            <h2>Add a song to the playlist</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".5rem",
              }}>
              <label htmlFor="playlist"> Select a playlist</label>
              <div className="custom-select">
                <select
                  onChange={handlePlaylistSelect}
                  value={selectedPlaylist || ""}>
                  <option value="" disabled>
                    Select a playlist
                  </option>
                  {playlists.map((playlist) => (
                    <option
                      key={playlist.uuid}
                      value={playlist.uuid}
                      id="playlist">
                      {playlist.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handleAddSongConfirm}>Add</button>
              <button onClick={handleModalClose}>Cancel</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
