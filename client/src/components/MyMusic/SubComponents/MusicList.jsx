import { useEffect, useState, Fragment, useMemo, useCallback } from "react";
import "./styles/MusicList.css";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import { formatDate } from "../../../utils/formatDate";
import extractUUIDPrefix from "../../../utils/extractUUIDPrefix";
import ReactPaginate from "react-paginate";
import TransitionLink from "../../Common/TransitionLink";
import { formatTime } from "../../../utils/formatTime";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate, useLocation } from "react-router";
import {
  useAddSongToPlaylist,
  useRemoveSongFromPlaylist,
} from "../../../hooks/CRUD-hooks/usePlaylists";
import AddSongToPlaylistModal from "./AddSongToPlaylistModal";
import { useGetUserDetails } from "../../../hooks/CRUD-hooks/useUsers";
import PropTypes from "prop-types";
import { useUpdateSongPositions } from "../../../hooks/CRUD-hooks/usePlaylists";

export default function MusicList({
  songs,
  title,
  playlists,
  triggerRefreshHandler,
  activePlaylist,
  styles,
  hideRemoveSongButton = false,
}) {
  const {
    user,
    currentSongUUID,
    setCurrentSongUUID,
    isSongLoading,
    clearLyrics,
    setIsPlaying,
    isPlaying,
    currentPage: page,
    setCurrentPage,
    handleKeyPressWhenTabbed,
    triggerRefreshSongsHandler,
    setCurrentFilteredSongs,
  } = useMusicPlayer();
  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const currentUserUUID = searchParams.get("userUUID") || user.userUUID;
  const [currentUser] = useGetUserDetails(currentUserUUID);

  const savedPage = localStorage.getItem("CP");
  const currentPage = savedPage ? Number(savedPage) - 1 : page;
  useEffect(() => {
    setCurrentPage(0);
  }, [setCurrentPage, searchParams]);
  const query = searchParams.get("q");
  const navigate = useNavigate();
  const addSongToPlaylist = useAddSongToPlaylist();
  const removeSongFromPlaylist = useRemoveSongFromPlaylist();
  const updateSongPositions = useUpdateSongPositions();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("custom");

  const [itemsPerPage, setItemsPerPage] = useState(
    () => JSON.parse(localStorage.getItem("IPP")) || 20
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState();
  const [likedSongs, setLikedSongs] = useState(() => {
    const storedLikedSongs = localStorage.getItem("likedSongs");
    return storedLikedSongs ? JSON.parse(storedLikedSongs) : [];
  });
  const [hoveredSongUUID, setHoveredSongUUID] = useState();
  const [draggedSong, setDraggedSong] = useState(null);
  const [dragOverSong, setDragOverSong] = useState(null);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
  const [sortHistory, setSortHistory] = useState([]);

  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  if (!activePlaylist && songs.length > 20) {
    songs = songs.filter((song, index) => index !== songs.length - 1);
  }
  const sortedSongs = songs.sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "date-added-asc":
        if (a.PlaylistSong && b.PlaylistSong) {
          return (
            new Date(a.PlaylistSong.createdAt) -
            new Date(b.PlaylistSong.createdAt)
          );
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "date-added-desc":
        if (a.PlaylistSong && b.PlaylistSong) {
          return (
            new Date(b.PlaylistSong.createdAt) -
            new Date(a.PlaylistSong.createdAt)
          );
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "duration-asc":
        return a.duration - b.duration;
      case "duration-desc":
        return b.duration - a.duration;
      case "custom":
        if (a.PlaylistSong && b.PlaylistSong) {
          return (
            (a.PlaylistSong.position || 0) - (b.PlaylistSong.position || 0)
          );
        }
        return 0;
      default:
        return 0;
    }
  });

  const filteredSongs = sortedSongs.filter(
    (song) =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const constructNavigatePlayListUrl = (page) => {
    const newPage = page + 1;
    if (query) {
      navigate(`?q=${query}&page=${newPage}`);
    } else if (activePlaylist) {
      navigate(
        `?playlist=${activePlaylist.name.replace(/\s+/g, "")}&page=${newPage}`
      );
    } else {
      navigate(`?page=${newPage}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
    localStorage.setItem("CP", `${1}`);
    constructNavigatePlayListUrl(0);

    const newFilteredSongs = songs.filter(
      (song) =>
        song.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        song.artist.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setCurrentFilteredSongs(newFilteredSongs);
  };

  const handleSortChange = (e) => setSortOption(e.target.value);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
    localStorage.setItem("CP", `${1}`);
    localStorage.setItem("IPP", Number(e.target.value));
    constructNavigatePlayListUrl(0);
  };

  const getPaginationDirection = (newPage, currentPage) => {
    return newPage > currentPage ? "forward" : "backward";
  };

  const handlePageClick = ({ selected }) => {
    const direction = getPaginationDirection(selected, currentPage);

    if (!document.startViewTransition) {
      setCurrentPage(selected);
      constructNavigatePlayListUrl(selected);
      localStorage.setItem("CP", selected + 1);
      return;
    }

    document.startViewTransition({
      update: () => {
        setCurrentPage(selected);
        constructNavigatePlayListUrl(selected);
        localStorage.setItem("CP", selected + 1);
      },
      types: ["slide", direction],
    });

  };

  const offset = currentPage * itemsPerPage;
  const currentSongs = filteredSongs.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredSongs.length / itemsPerPage);

  const startIndex =
    filteredSongs.length === 0 ? 0 : currentPage * itemsPerPage + 1;
  const endIndex = Math.min(
    (currentPage + 1) * itemsPerPage,
    filteredSongs.length
  );

  const totalDuration = activePlaylist?.Songs?.reduce((total, song) => {
    return total + song.duration;
  }, 0);

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
        songName: song.name,
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

  const currentPlayerPlaylists = playlists.filter(
    (playlist) =>
      playlist?.created_by === currentUser?.name &&
      playlist.name != "Liked Songs"
  );

  const handleSongSelect = useCallback(
    (song, index, ctrlKey, shiftKey) => {
      if (ctrlKey) {
        setSelectedSongs((prev) =>
          prev.includes(song.uuid)
            ? prev.filter((uuid) => uuid !== song.uuid)
            : [...prev, song.uuid]
        );
        setLastSelectedIndex(index);
      } else if (shiftKey && lastSelectedIndex !== null) {
        const start = Math.min(lastSelectedIndex, index);
        const end = Math.max(lastSelectedIndex, index);
        const rangeSelection = currentSongs
          .slice(start, end + 1)
          .map((s) => s.uuid);
        setSelectedSongs(rangeSelection);
      } else {
        setSelectedSongs(song.uuid === selectedSongs[0] ? [] : [song.uuid]);
        setLastSelectedIndex(index);
      }
    },
    [lastSelectedIndex, currentSongs, selectedSongs]
  );

  const handleDragAndDrop = async () => {
    if (!dragOverSong || !activePlaylist) return;

    const newSongs = [...currentSongs];
    const draggedSongs =
      selectedSongs.length > 0 ? selectedSongs : [draggedSong];

    if (!draggedSongs.includes(draggedSong)) return;

    const dragIndices = draggedSongs
      .map((uuid) => newSongs.findIndex((song) => song.uuid === uuid))
      .sort((a, b) => a - b);
    const dropIndex = newSongs.findIndex((song) => song.uuid === dragOverSong);

    const removedSongs = dragIndices
      .reverse()
      .map((index) => newSongs.splice(index, 1)[0]);

    const insertIndex =
      dropIndex > dragIndices[0]
        ? dropIndex - dragIndices.length + 1
        : dropIndex;
    newSongs.splice(insertIndex, 0, ...removedSongs.reverse());

    const newHistory = sortHistory.slice(0, currentHistoryIndex + 1);
    newHistory.push(newSongs);
    setSortHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);

    const updates = newSongs.map((song, index) => ({
      songUUID: song.uuid,
      position: index,
    }));

    await updateSongPositions(
      activePlaylist.name,
      updates,
      user.userUUID,
      triggerRefreshHandler
    );
    triggerRefreshSongsHandler();

    setDraggedSong(null);
    setDragOverSong(null);
    setSelectedSongs([]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "z" && sortOption === "custom") {
        e.preventDefault();
        if (currentHistoryIndex > 0) {
          const previousState = sortHistory[currentHistoryIndex - 1];
          updateSongPositions(
            activePlaylist.name,
            previousState.map((song, index) => ({
              songUUID: song.uuid,
              position: index,
            })),
            user.userUUID,
            triggerRefreshHandler
          );
          setCurrentHistoryIndex((prev) => prev - 1);
        }
      } else if (e.ctrlKey && e.key === "y") {
        // Redo functionality (Ctrl+Y)
        e.preventDefault();
        if (currentHistoryIndex < sortHistory.length - 1) {
          const nextState = sortHistory[currentHistoryIndex + 1];
          updateSongPositions(
            activePlaylist.name,
            nextState.map((song, index) => ({
              songUUID: song.uuid,
              position: index,
            })),
            user.userUUID,
            triggerRefreshHandler
          );
          setCurrentHistoryIndex((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    sortHistory,
    currentHistoryIndex,
    activePlaylist,
    sortOption,
    user.userUUID,
  ]);

  useEffect(() => {
    return () => {
      setCurrentFilteredSongs([]);
    };
  }, [setCurrentFilteredSongs]);

  return (
    <div className="music-list" style={styles}>
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
      </div>
      <div className="sort-controls">
        <div className="search-container">
          <input
            name="input"
            id="song-search"
            type="search"
            placeholder="Search by artist or name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="select-container">
          <label htmlFor="sort-by">Sort By:</label>
          <select id="sort-by" value={sortOption} onChange={handleSortChange}>
            <option value="custom">Custom (Default)</option>
            <option value="date-added-asc">Date (ASC)</option>
            <option value="date-added-desc">Date (DESC)</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
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
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={30}>30 per page</option>
            <option value={40}>40 per page</option>
            <option value={50}>50 per page</option>
            <option value={69}>69 per page</option>
            <option value={999}>999 per page</option>
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
            {currentSongs.map((song, index) => {
              const artistArray = song.artist
                .split(/, | & |,|&/)
                .map((artist) => artist.trim());
              return (
                <tr
                  key={song.uuid}
                  className={`
                    ${
                      extractUUIDPrefix(song.uuid) === currentSongUUID
                        ? "playing"
                        : "tr"
                    }
                    ${
                      sortOption === "custom" && dragOverSong === song.uuid
                        ? "drag-over"
                        : ""
                    }
                    ${selectedSongs.includes(song.uuid) ? "selected" : ""}
                  `}
                  draggable={
                    sortOption === "custom" &&
                    activePlaylist?.created_by === currentUser.name &&
                    activePlaylist?.name !== "Liked Songs" &&
                    (selectedSongs.length === 0 ||
                      selectedSongs.includes(song.uuid))
                  }
                  onClick={(e) => {
                    if (
                      (e.ctrlKey || e.shiftKey) &&
                      activePlaylist &&
                      activePlaylist.created_by === currentUser.name &&
                      activePlaylist.name !== "Liked Songs"
                    ) {
                      handleSongSelect(song, index, e.ctrlKey, e.shiftKey);
                    }
                  }}
                  onDragStartCapture={(e) => {
                    if (
                      sortOption === "custom" &&
                      activePlaylist.created_by === currentUser.name
                    ) {
                      setDraggedSong(song.uuid);
                      e.target.style.opacity = "0.5";
                    }
                  }}
                  onDragOver={(e) => {
                    if (
                      sortOption === "custom" &&
                      activePlaylist.created_by === currentUser.name
                    ) {
                      e.preventDefault();
                      setDragOverSong(song.uuid);
                    }
                  }}
                  onDragEnd={(e) => {
                    sortOption === "custom" &&
                      activePlaylist.created_by === currentUser.name &&
                      handleDragAndDrop();
                    e.target.style.opacity = "1";
                  }}
                  onMouseEnter={() => setHoveredSongUUID(song.uuid)}
                  onMouseLeave={() => setHoveredSongUUID(null)}
                  onDoubleClick={() => handleMusicListSong(song)}
                  onTouchStart={() => handleMusicListSong(song)}>
                  <td
                    onFocus={() => setHoveredSongUUID(song.uuid)}
                    tabIndex={0}
                    style={{ outline: "none" }}>
                    {hoveredSongUUID === song.uuid ? (
                      <i
                        tabIndex={0}
                        className={`fa-solid fa-${
                          extractUUIDPrefix(song.uuid) === currentSongUUID &&
                          isPlaying
                            ? "pause"
                            : "play"
                        }`}
                        onClick={() => handleMusicListSong(song)}
                        onKeyDown={(e) =>
                          handleKeyPressWhenTabbed(e, () => {
                            handleMusicListSong(song);
                          })
                        }
                        style={{ cursor: "pointer" }}
                        title={
                          extractUUIDPrefix(song.uuid) === currentSongUUID &&
                          isPlaying
                            ? "Pause"
                            : `Play ${song.name} by ${song.artist}`
                        }></i>
                    ) : extractUUIDPrefix(song.uuid) === currentSongUUID &&
                      isPlaying ? (
                      <img
                        src="/assets/equaliser-animated-green.gif"
                        alt="Playing"
                        width={14}
                        style={{ borderRadius: "0" }}
                      />
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
                        {artistArray.map((artist, index) => (
                          <Fragment key={artist}>
                            <TransitionLink
                              className="song-artist"
                              to={`/artist/${artist}/description`}>
                              {artist}
                            </TransitionLink>
                            {index < artistArray.length - 1 && ", "}
                          </Fragment>
                        ))}
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
                          ? "Remove from Liked Songs"
                          : "Add to Liked Songs"
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
                        activePlaylist.name !== "Liked Songs" &&
                        hideRemoveSongButton === false &&
                        activePlaylist?.created_by === currentUser.name && (
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
                                handleRemoveSongFromPlaylist(
                                  song,
                                  activePlaylist.name
                                );
                              })
                            }
                            title="Remove from playlist"></i>
                        )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {pageCount > 1 && (
        <ReactPaginate
          forcePage={currentPage}
          previousLabel={<i className="fas fa-arrow-left"></i>}
          nextLabel={<i className="fas fa-arrow-right"></i>}
          breakLabel={"..."}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          disabledLinkClassName={"disabled"}
        />
      )}
      <p className="item-count">
        Showing <strong>{startIndex}</strong> to <strong>{endIndex}</strong> of{" "}
        <strong>{filteredSongs.length}</strong> songs
      </p>

      <AddSongToPlaylistModal
        playlists={currentPlayerPlaylists}
        triggerRefreshHandler={triggerRefreshHandler}
        showModal={showModal}
        handleModalClose={handleModalClose}
        selectedSong={selectedSong}
      />
    </div>
  );
}

MusicList.propTypes = {
  songs: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  activePlaylist: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    Songs: PropTypes.arrayOf(PropTypes.object),
    created_by: PropTypes.string,
    sortable: PropTypes.bool,
  }),
  playlists: PropTypes.arrayOf(PropTypes.object).isRequired,
  triggerRefreshHandler: PropTypes.func.isRequired,
  styles: PropTypes.object,
  hideRemoveSongButton: PropTypes.bool,
};
