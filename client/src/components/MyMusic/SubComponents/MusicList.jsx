import { useState, useEffect } from "react";
import "./styles/MusicList.css";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import { formatDate } from "../../../utils/formatDate";
import extractUUIDPrefix from "../../../utils/extractUUIDPrefix";
import ReactPaginate from "react-paginate";
import { formatTime } from "../../../utils/formatTime";
import showToast from "../../../utils/showToast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import {
  useAddSongToPlaylist,
  useRemoveSongFromPlaylist,
} from "../../../hooks/CRUD-hooks/usePlaylists";

export default function MusicList({
  songs,
  title,
  activePlaylist,
  playlists,
  triggerRefreshHandler,
  styles,
}) {
  const {
    user,
    currentSongUUID,
    setCurrentSongUUID,
    isSongLoading,
    clearLyrics,
    setIsPlaying,
    musicListRef,
    isPlaying,
    currentPage,
    setCurrentPage,
    handleKeyPressWhenTabbed,
  } = useMusicPlayer();
  const addSongToPlaylist = useAddSongToPlaylist();
  const removeSongFromPlaylist = useRemoveSongFromPlaylist();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date-added-desc");
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedPlaylist, setSelectedPlaylist] = useState();
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState();
  const [likedSongs, setLikedSongs] = useState(() => {
    const storedLikedSongs = localStorage.getItem("likedSongs");
    return storedLikedSongs ? JSON.parse(storedLikedSongs) : [];
  });
  const [hoveredSongUUID, setHoveredSongUUID] = useState();

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSortChange = (e) => setSortOption(e.target.value);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const sortedSongs = songs.sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "date-added-asc":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "date-added-desc":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "duration-asc":
        return a.duration - b.duration;
      case "duration-desc":
        return b.duration - a.duration;
      default:
        return 0;
    }
  });

  const filteredSongs = sortedSongs.filter(
    (song) =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentSongs = filteredSongs.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredSongs.length / itemsPerPage);

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
    clearLyrics();
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
    const reqObj = {
      songUUID: selectedSong.uuid,
      playlistUUID: selectedPlaylist,
    };
    addSongToPlaylist(reqObj, () => handleModalClose(), triggerRefreshHandler);
  };

  const handleRemoveSongFromPlaylist = async (song, playlistName) => {
    const reqObj = {
      songUUID: song.uuid,
      playlistName: playlistName,
      userUUID: user.userUUID,
    };
    removeSongFromPlaylist(reqObj, triggerRefreshHandler);
  };

  const handleToggleLikedSong = async (song) => {
    const likedSongsPlaylist = playlists.filter((playlist) => {
      return playlist.name === "Liked Songs";
    });
    const songUUID = extractUUIDPrefix(song.uuid);
    const isLiked = likedSongs.includes(songUUID);
    let updatedLikedSongs;
    if (isLiked) {
      updatedLikedSongs = likedSongs.filter((uuid) => uuid !== songUUID);
      setLikedSongs(updatedLikedSongs);
      handleRemoveSongFromPlaylist(song, likedSongsPlaylist[0].name);
      localStorage.setItem("likedSongs", JSON.stringify(updatedLikedSongs));
    } else {
      const reqObj = {
        songUUID: song.uuid,
        playlistUUID: likedSongsPlaylist[0].uuid,
      };
      const callback = () => {
        updatedLikedSongs = [...likedSongs, songUUID];
        setLikedSongs(updatedLikedSongs);
        localStorage.setItem("likedSongs", JSON.stringify(updatedLikedSongs));
      };
      addSongToPlaylist(reqObj, callback, triggerRefreshHandler);
    }
  };

  return (
    <div ref={musicListRef} className="music-list" style={styles}>
      <div className="header">
        <div className="row list">
          {isSongLoading ? (
            <Skeleton width={200} height={30} />
          ) : (
            <>
              <i className="fa-solid fa-sliders"></i>
              <span> {title}</span>
            </>
          )}
        </div>
        {
          <i
            tabIndex={0}
            id="close"
            className="fa-solid fa-close"
            onClick={hideList}
            onKeyDown={(e) => handleKeyPressWhenTabbed(e, hideList)}></i>
        }
      </div>
      <div className="sort-controls">
        <div className="search-container">
          <input
            id="search"
            type="search"
            placeholder="Search by artist or name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="select-container">
          <label htmlFor="sort-by">Sort By:</label>
          <select id="sort-by" value={sortOption} onChange={handleSortChange}>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="date-added-asc">Date Added (ASC)</option>
            <option value="date-added-desc">Date Added (DESC)</option>
            <option value="duration-asc">Duration (Least to Most)</option>
            <option value="duration-desc">Duration (Most to Least)</option>
          </select>
        </div>
        <div className="select-container">
          <label htmlFor="number-of-songs">Songs per page:</label>
          <select
            id="number-of-songs"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}>
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={15}>15 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>
      </div>
      <hr />

      {isSongLoading ? (
        <Skeleton
          containerClassName="playlist-description"
          width={280}
          height={30}
          count={2}
        />
      ) : (
        activePlaylist && (
          <div className="playlist-description">
            <p>{activePlaylist?.description}</p>
            <p>
              {activePlaylist?.Songs.length === 1
                ? `${activePlaylist?.Songs.length} song`
                : `${activePlaylist?.Songs.length} songs`}{" "}
              ,<span>Duration: {formatTime(totalDuration)}</span>
            </p>
          </div>
        )
      )}
      {isSongLoading ? (
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
            {Array(8)
              .fill(null)
              .map((_, index) => (
                <tr key={index}>
                  <td>
                    <Skeleton width={30} />
                  </td>
                  <td>
                    <Skeleton width={40} height={40} />
                  </td>
                  <td>
                    <Skeleton width={100} />
                    <Skeleton width={60} />
                  </td>
                  <td>
                    <Skeleton width={80} />
                  </td>
                  <td>
                    <Skeleton width={50} />
                  </td>
                  <td>
                    <Skeleton width={30} />
                  </td>
                  <td>
                    <Skeleton width={30} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
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
                onDoubleClick={() => handleMusicListSong(song)}
                onTouchStart={() => handleMusicListSong(song)}>
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
                    <p>
                      <Link
                        className="song-artist"
                        to={`/artist/${song.artist}/description`}>
                        {song.artist}{" "}
                      </Link>
                    </p>
                  </div>
                </td>
                <td>
                  {song.PlaylistSong
                    ? formatDate(song.PlaylistSong.createdAt)
                    : formatDate(song.createdAt)}
                </td>
                <td>
                  <i
                    tabIndex={0}
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
                    onKeyDown={(e) =>
                      handleKeyPressWhenTabbed(e, () => {
                        handleToggleLikedSong(song);
                      })
                    }
                    style={{ cursor: "pointer" }}></i>
                  {formatTime(song.duration)}
                </td>
                <td>
                  <div className="action-btns">
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
                    {activePlaylist &&
                      activePlaylist.name !== "Liked Songs" && (
                        <i
                          tabIndex={0}
                          className="fa-solid fa-delete-left"
                          onClick={() =>
                            handleRemoveSongFromPlaylist(
                              song,
                              activePlaylist.name
                            )
                          }
                          onKeyDown={(e) =>
                            handleKeyPressWhenTabbed(e, () => {
                              handleRemoveSongFromPlaylist(song);
                            })
                          }
                          title="Remove from playlist"></i>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
                  className="add-song-to-playlist"
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
