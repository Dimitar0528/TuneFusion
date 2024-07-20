import React, { useState } from "react";
import "./styles/MusicList.css";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import { formatDate } from "../../../utils/formatDate";
import extractUUIDPrefix from "../../../utils/extractUUIDPrefix";
import ReactPaginate from "react-paginate";
import { formatTime } from "../../../utils/formatTime";
import showToast from "../../../utils/showToast";
import LoadingSpinner from "../../LoadingSpinner";

export default function MusicList({
  songs,
  title,
  activePlaylist,
  playlists,
  refreshPlaylist,
  styles,
}) {
  const {
    currentSongUUID,
    setCurrentSongUUID,
    isSongLoading,
    setLyrics,
    setIsPlaying,
    musicListRef,
    isPlaying,
    currentPage,
    setCurrentPage,
    handleKeyPressWhenTabbed,
  } = useMusicPlayer();

  const [selectedPlaylist, setSelectedPlaylist] = useState();
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState();
  const [likedSongs, setLikedSongs] = useState(() => {
    const storedLikedSongs = localStorage.getItem("likedSongs");
    return storedLikedSongs ? JSON.parse(storedLikedSongs) : [];
  });

  const [hoveredSongUUID, setHoveredSongUUID] = useState();
  const itemsPerPage = 20;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentSongs = songs.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(songs.length / itemsPerPage);

  const totalDuration = activePlaylist?.Songs.reduce((total, song) => {
    return total + song.duration;
  }, 0);
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
    setLyrics("");
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
        refreshPlaylist();
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

  const handleRemoveSongFromPlaylist = async (song, playlistName) => {
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
            playlistName: playlistName,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        showToast(data.message, "success");
        refreshPlaylist();
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

  const likedSongsPlaylist = playlists.filter((playlist) => {
    return playlist.name === "Liked Songs";
  });
  const handleToggleLikedSong = async (song) => {
    const songUUID = extractUUIDPrefix(song.uuid);
    const isLiked = likedSongs.includes(songUUID);
    let updatedLikedSongs;

    if (isLiked) {
      updatedLikedSongs = likedSongs.filter((uuid) => uuid !== songUUID);
      setLikedSongs(updatedLikedSongs);
      handleRemoveSongFromPlaylist(song, likedSongsPlaylist[0].name);
    } else {
      try {
        const response = await fetch(
          "http://localhost:3000/api/playlists/add-song",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              songUUID: song.uuid,
              playlistUUID: likedSongsPlaylist[0].uuid,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          showToast(data.message, "success");
          updatedLikedSongs = [...likedSongs, songUUID];
          setLikedSongs(updatedLikedSongs);
          refreshPlaylist();
        } else {
          const errorData = await response.json();
          showToast(`Error: ${errorData.error}`, "error");
          return;
        }
      } catch (error) {
        console.error("Error adding song to liked songs playlist:", error);
        showToast(
          "An error occurred while adding the song to the liked songs playlist.",
          "error"
        );
        return;
      }
    }

    // Update localStorage
    localStorage.setItem("likedSongs", JSON.stringify(updatedLikedSongs));
  };

  return (
    <div ref={musicListRef} className="music-list" style={styles}>
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

      <LoadingSpinner isLoading={isSongLoading} />
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
              }
              onMouseEnter={() => setHoveredSongUUID(song.uuid)}
              onMouseLeave={() => setHoveredSongUUID(null)}
              onDoubleClick={() => handleMusicListSong(song)}>
              <td>
                {hoveredSongUUID === song.uuid ? (
                  <i
                    className={`fa-solid fa-${
                      extractUUIDPrefix(song.uuid) === currentSongUUID &&
                      isPlaying
                        ? "pause"
                        : "play"
                    }`}
                    onClick={() => handleMusicListSong(song)}
                    style={{ cursor: "pointer" }}
                    title={
                      extractUUIDPrefix(song.uuid) === currentSongUUID &&
                      isPlaying
                        ? "Pause"
                        : `Play ${song.name} by ${song.artist}`
                    }></i>
                ) : (
                  offset + index + 1
                )}
              </td>
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
              <td>
                {song.PlaylistSong
                  ? formatDate(song.PlaylistSong.createdAt)
                  : formatDate(song.createdAt)}
              </td>
              <td>
                <i
                  className={` fa-heart | add-to-playlist ${
                    likedSongs.includes(extractUUIDPrefix(song.uuid))
                      ? "fa-solid"
                      : "fa-regular"
                  }`}
                  title={
                    likedSongs.includes(extractUUIDPrefix(song.uuid))
                      ? "Remove from Liked Songs Playlist"
                      : "Save to Liked Songs Playlist"
                  }
                  onClick={() => handleToggleLikedSong(song)}
                  style={{ cursor: "pointer" }}></i>
                {formatTime(song.duration)}
              </td>
              {activePlaylist?.name !== "Liked Songs" ? (
                activePlaylist ? (
                  <td>
                    <i
                      tabIndex={0}
                      className="fa-solid fa-circle-minus"
                      onClick={() =>
                        handleRemoveSongFromPlaylist(song, activePlaylist.name)
                      }
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
                )
              ) : null}
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
