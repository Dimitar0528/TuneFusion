import { Link, useParams } from "react-router";
import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./styles/ArtistDescription.module.css";
import {
  useGetArtistDescription,
  useAddFetchedSongToDB,
  useAddAlbumToDB,
} from "../../hooks/CRUD-hooks/useSongs";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import AddSongToPlaylistModal from "../MyMusic/SubComponents/AddSongToPlaylistModal";
import { formatTime } from "../../utils/formatTime";
import { useGetUserDetails } from "../../hooks/CRUD-hooks/useUsers";
import { useTransferSongsToPlaylist } from "../../hooks/CRUD-hooks/usePlaylists";

export default function ArtistDescription() {
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState();
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [expandedAlbums, setExpandedAlbums] = useState([]);
  const [closingAlbums, setClosingAlbums] = useState([]);

  const handleAddSongToPlayList = (song) => {
    setSelectedSongs([]);
    setSelectedSong(song);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedSong(null);
    setSelectedSongs([]);
  };
  const toggleAlbum = (albumId) => {
    if (expandedAlbums.includes(albumId)) {
      setClosingAlbums((prev) => [...prev, albumId]);

      setTimeout(() => {
        setExpandedAlbums((prev) => prev.filter((id) => id !== albumId));
        setClosingAlbums((prev) => prev.filter((id) => id !== albumId));
      }, 200);
    } else {
      setExpandedAlbums((prev) => [...prev, albumId]);
    }
  };

  const {
    triggerRefreshSongsHandler,
    user,
    playlists,
    handleKeyPressWhenTabbed,
    triggerRefreshPlaylistsHandler,
  } = useMusicPlayer();

  const { role, userUUID } = user;
  const { artistName } = useParams();
  const [artist, isArtistLoading] = useGetArtistDescription(artistName);
  const [addFetchedSongToDB, loading] = useAddFetchedSongToDB(
    triggerRefreshSongsHandler
  );
  const [currentUser] = useGetUserDetails(userUUID);
  const currentPlayerPlaylists = playlists.filter(
    (playlist) =>
      playlist?.created_by === currentUser?.name &&
      playlist.name != "Liked Songs"
  );
  const [addArtistAlbumToDB, isAddingToDB] = useAddAlbumToDB(
    triggerRefreshSongsHandler
  );
  const transferSongsToPlaylist = useTransferSongsToPlaylist();

  async function handleAddAlbumToDB(e, albumId, albumSongs) {
    e.stopPropagation();
    const selectedAlbum = albumSongs.find(
      (albumSong) => albumSong.albumId === albumId
    );
    await addArtistAlbumToDB(selectedAlbum.songs, artistName);
  }

  async function handleAddAlbumToPlaylist(e, albumId, albumSongs) {
    e.stopPropagation();
    const selectedAlbum = albumSongs.find(
      (albumSong) => albumSong.albumId === albumId
    );

    if (selectedAlbum?.songs) {
      setSelectedSong(null);
      setSelectedSongs(
        selectedAlbum.songs.map((song) => ({
          name: song.name,
          artist: artistName,
          img_src: song.thumbnails?.[0]?.url,
          duration: song.duration,
        }))
      );
      setShowModal(true);
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>About &nbsp; {artistName}</h1>
      {artist?.error && (
        <p
          className="error"
          style={{ textAlign: "center", padding: "1.65rem" }}>
          {artist?.error}
        </p>
      )}
      <div className={styles["img-area"]}>
        {isArtistLoading ? (
          <Skeleton height={385} width="clamp(300px, 80vw, 100vw)" />
        ) : (
          artist?.thumbnails?.length > 0 && (
            <img
              className={styles.image}
              src={artist?.thumbnails[0]?.url}
              alt="Artist"
            />
          )
        )}
      </div>

      {artist?.topAlbums?.length > 0 && <h2 className={styles.h2}>Albums</h2>}
      <div className={styles.albumList}>
        {isArtistLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={styles.album}>
                <Skeleton circle={true} height={40} width={40} />
                <div>
                  <Skeleton width={150} />
                  <Skeleton width={100} />
                </div>
              </div>
            ))
          : artist.topAlbums?.map((album) => (
              <React.Fragment key={album.albumId}>
                <div
                  className={styles.album}
                  onClick={() => toggleAlbum(album.albumId)}
                  style={{ cursor: "pointer" }}>
                  <>
                    <img
                      width={40}
                      height={40}
                      src={album.thumbnails[0].url}
                      alt="Album"
                    />
                    <div>
                      <p>{album.name}</p>
                      <p>{album.year}</p>
                    </div>
                    <div className={styles.addBtns}>
                      {role === "admin" && (
                        <button
                          onClick={(e) =>
                            handleAddAlbumToDB(
                              e,
                              album.albumId,
                              artist?.albumSongs
                            )
                          }
                          tabIndex={-1}
                          disabled={isAddingToDB}
                          className={styles.addBtn}
                          style={{
                            backgroundColor: "white",
                          }}>
                          <i
                            style={{ color: "var(--primary-clr)" }}
                            tabIndex={0}
                            disabled={isAddingToDB}
                            className={
                              isAddingToDB
                                ? "fas fa-spinner fa-spin"
                                : "fa-solid fa-square-plus"
                            }
                            title={
                              isAddingToDB
                                ? "Loading"
                                : "Add the album to the Database"
                            }></i>
                        </button>
                      )}
                      <div
                        className={styles.addBtn}
                        style={{
                          backgroundColor: "white",
                          marginRight: "1rem",
                        }}>
                        <i
                          tabIndex={0}
                          className="fa-solid fa-plus"
                          title="Add the album to a playlist"
                          onClick={(e) =>
                            handleAddAlbumToPlaylist(
                              e,
                              album.albumId,
                              artist?.albumSongs
                            )
                          }></i>
                      </div>
                      <button
                        title="Toggle Album"
                        className={`${styles.toggleButton} ${
                          expandedAlbums.includes(album.albumId)
                            ? styles.expanded
                            : ""
                        }`}
                        onClick={() => toggleAlbum(album.albumId)}>
                        ▼
                      </button>
                    </div>
                  </>
                </div>
                {(expandedAlbums.includes(album.albumId) ||
                  closingAlbums.includes(album.albumId)) && (
                  <div
                    className={`${styles.albumSongs} ${
                      closingAlbums.includes(album.albumId)
                        ? styles.albumCollapse
                        : ""
                    }`}>
                    <table className={styles.table}>
                      <thead>
                        <tr className={styles.headerRow}>
                          <th className={styles.headerCell}>Song Name</th>
                          <th className={styles.headerCell}>Song Duration</th>
                          <th className={styles.headerCell}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {artist?.albumSongs?.map((albumSong) => {
                          if (albumSong.albumId !== album.albumId) return null;
                          return albumSong.songs.map((song) => (
                            <tr key={song.videoId} className={styles.songRow}>
                              <td className={styles.songCell}>{song.name}</td>
                              <td className={styles.songCell}>
                                {formatTime(song.duration)}
                              </td>
                              <td
                                className={`${styles.songCell} ${styles.addBtnsTd}`}>
                                <div className={styles.addBtns}>
                                  {role === "admin" && (
                                    <button
                                      tabIndex={-1}
                                      disabled={loading}
                                      className={styles.addBtn}
                                      style={{
                                        backgroundColor: "white",
                                      }}>
                                      <i
                                        style={{ color: "var(--primary-clr)" }}
                                        tabIndex={0}
                                        disabled={loading}
                                        className={
                                          loading
                                            ? "fas fa-spinner fa-spin"
                                            : "fa-solid fa-square-plus"
                                        }
                                        onClick={() =>
                                          addFetchedSongToDB(
                                            song.name,
                                            artistName
                                          )
                                        }
                                        onKeyDown={(e) =>
                                          handleKeyPressWhenTabbed(e, () => {
                                            addFetchedSongToDB(
                                              song.name,
                                              artistName
                                            );
                                          })
                                        }
                                        title={
                                          loading
                                            ? "Loading"
                                            : "Add the song to the Database"
                                        }></i>
                                    </button>
                                  )}
                                  <div
                                    className={styles.addBtn}
                                    style={{
                                      backgroundColor: "white",
                                    }}>
                                    <i
                                      tabIndex={0}
                                      className="fa-solid fa-plus"
                                      onClick={() =>
                                        handleAddSongToPlayList(song)
                                      }
                                      onKeyDown={(e) =>
                                        handleKeyPressWhenTabbed(e, () => {
                                          handleAddSongToPlayList(song);
                                        })
                                      }
                                      title="Add to playlist"></i>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ));
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </React.Fragment>
            ))}
      </div>
      {artist?.topSingles?.length > 0 && <h2 className={styles.h2}>Singles</h2>}
      <div className={styles.singleList}>
        {isArtistLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={styles.single}>
                <Skeleton circle={true} height={40} width={40} />
                <div>
                  <Skeleton width={150} />
                  <Skeleton width={100} />
                </div>
              </div>
            ))
          : artist.topSingles?.map((single) => (
              <div key={single.name} className={styles.single}>
                <img
                  style={{ objectFit: "cover" }}
                  width={40}
                  height={40}
                  src={single.thumbnails[0].url}
                  alt="Single"
                />
                <div>
                  <p>{single.name}</p>
                  <p>{single.year}</p>
                </div>
                <div className={styles.addBtns}>
                  {role === "admin" && (
                    <button
                      disabled={loading}
                      className={styles.addBtn}
                      style={{ backgroundColor: "white" }}>
                      <i
                        style={{ color: "var(--primary-clr)" }}
                        tabIndex={0}
                        disabled={loading}
                        className={
                          loading
                            ? "fas fa-spinner fa-spin"
                            : "fa-solid fa-square-plus"
                        }
                        onClick={() =>
                          addFetchedSongToDB(single.name, artistName)
                        }
                        onKeyDown={(e) =>
                          handleKeyPressWhenTabbed(e, () => {
                            addFetchedSongToDB(single.name, artistName);
                          })
                        }
                        title={loading ? "Loading" : "Add to Database"}></i>
                    </button>
                  )}
                  <div
                    className={styles.addBtn}
                    style={{ backgroundColor: "white" }}>
                    <i
                      tabIndex={0}
                      className="fa-solid fa-plus"
                      onClick={() => handleAddSongToPlayList(single)}
                      onKeyDown={(e) =>
                        handleKeyPressWhenTabbed(e, () => {
                          handleAddSongToPlayList(single);
                        })
                      }
                      title="Add to playlist"></i>
                  </div>
                </div>
              </div>
            ))}
      </div>
      {artist?.similarArtists?.length > 0 && (
        <h2 className={styles.h2}>Suggested Artists</h2>
      )}
      <div className={styles.suggestedArtists}>
        {isArtistLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={styles["suggested-artist"]}>
                <Skeleton circle={true} height={40} width={40} />
                <div>
                  <Skeleton width={150} />
                </div>
              </div>
            ))
          : artist.similarArtists?.map((suggestedArtist) => (
              <div
                key={suggestedArtist.artistId}
                className={styles["suggested-artist"]}>
                <img
                  width={40}
                  height={40}
                  src={suggestedArtist.thumbnails[0].url}
                  alt="Suggested Artist"
                />
                <div>
                  <p>
                    <Link to={`/artist/${suggestedArtist.name}/description`}>
                      {suggestedArtist.name}
                    </Link>
                  </p>
                </div>
              </div>
            ))}
      </div>
      <AddSongToPlaylistModal
        playlists={currentPlayerPlaylists}
        triggerRefreshHandler={triggerRefreshPlaylistsHandler}
        showModal={showModal}
        handleModalClose={handleModalClose}
        selectedSong={selectedSong}
        selectedSongs={selectedSongs}
        checkIfSongIsInDBFlag={true}
      />
    </div>
  );
}
