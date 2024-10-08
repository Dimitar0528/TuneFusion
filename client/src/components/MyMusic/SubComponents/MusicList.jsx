import { useEffect, useState, Fragment } from "react";
import "./styles/MusicList.css";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import { formatDate } from "../../../utils/formatDate";
import extractUUIDPrefix from "../../../utils/extractUUIDPrefix";
import ReactPaginate from "react-paginate";
import { formatTime } from "../../../utils/formatTime";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  useAddSongToPlaylist,
  useRemoveSongFromPlaylist,
} from "../../../hooks/CRUD-hooks/usePlaylists";
import AddSongToPlaylistModal from "./AddSongToPlaylistModal";
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
    isPlaying,
    currentPage: page,
    setCurrentPage,
    handleKeyPressWhenTabbed,
  } = useMusicPlayer();
  const location = useLocation();
  const savedPage = localStorage.getItem("CP");
  const currentPage = savedPage ? Number(savedPage) - 1 : page;
  const searchParams = new URLSearchParams(location.search);
  useEffect(() => {
    const page = Number(searchParams.get("page")) || 0;
    setCurrentPage(page - 1);
  }, []);
  const query = searchParams.get("q");
  const navigate = useNavigate();
  const addSongToPlaylist = useAddSongToPlaylist();
  const removeSongFromPlaylist = useRemoveSongFromPlaylist();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date-added-desc");
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
  };

  const handleSortChange = (e) => setSortOption(e.target.value);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
    localStorage.setItem("CP", `${1}`);
    localStorage.setItem("IPP", Number(e.target.value));
    constructNavigatePlayListUrl(0);
  };
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    constructNavigatePlayListUrl(selected);
    localStorage.setItem("CP", selected + 1);
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
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="date-added-asc">Date (ASC)</option>
            <option value="date-added-desc">Date (DESC) (Default)</option>
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
                  className={
                    extractUUIDPrefix(song.uuid) === currentSongUUID
                      ? "playing"
                      : "tr"
                  }
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
                            <Link
                              className="song-artist"
                              to={`/artist/${artist}/description`}>
                              {artist}
                            </Link>
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
        playlists={playlists}
        triggerRefreshHandler={triggerRefreshHandler}
        showModal={showModal}
        handleModalClose={handleModalClose}
        selectedSong={selectedSong}
      />
    </div>
  );
}
