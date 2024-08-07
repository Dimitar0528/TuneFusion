import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./styles/ArtistDescription.module.css";
import {
  useGetArtistDescription,
  useCreateSong,
} from "../../hooks/CRUD-hooks/useSongs";
import { useGetSongSuggestions } from "../../hooks/CRUD-hooks/useSongs";
import showToast from "../../utils/showToast";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import AddSongToPlaylistModal from "../MyMusic/SubComponents/AddSongToPlaylistModal";
export default function ArtistDescription() {
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState();

  const handleAddSongToPlayList = (song) => {
    setSelectedSong(song);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedSong(null);
  };

  const {
    triggerRefreshSongsHandler,
    user,
    playlists,
    handleKeyPressWhenTabbed,
    triggerRefreshPlaylistsHandler,
  } = useMusicPlayer();
  const { role } = user;
  const { artistName } = useParams();
  const [artist, isArtistLoading] = useGetArtistDescription(artistName);
  const [_, loading, fetchSuggestedSongs] = useGetSongSuggestions();
  const createSong = useCreateSong();
  const handleAddToDB = (single) => {
    const query = `${single.title} ${artistName}`;
    showToast("Loading... Please wait!", "info", 3500);
    addToDB(query);
  };
  const addToDB = async (query) => {
    const songs = await fetchSuggestedSongs(query);
    const callback = (result) => {
      showToast(result.message, "success");
      triggerRefreshSongsHandler();
    };
    await createSong(songs[0], callback);
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>About &nbsp; {artistName}</h1>
      <div className={styles["img-area"]}>
        {isArtistLoading ? (
          <Skeleton height={385} width={930} />
        ) : (
          artist?.thumbnails?.length > 0 && (
            <img
              className={styles.image}
              src={artist.thumbnails[1]?.url}
              alt="Artist"
            />
          )
        )}
      </div>
      <div className={styles.description}>
        {isArtistLoading ? (
          <Skeleton count={4} />
        ) : (
          <p className={styles.description}>{artist.description}</p>
        )}
      </div>

      {artist?.albums?.length > 0 && <h2 className={styles.h2}>Albums</h2>}
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
          : artist.albums?.map((album) => (
              <div key={album.albumId} className={styles.album}>
                <img
                  width={40}
                  height={40}
                  src={album.thumbnailUrl}
                  alt="Album"
                />
                <div>
                  <p>{album.title}</p>
                  <p>{album.year}</p>
                </div>
              </div>
            ))}
      </div>
      {artist?.singles.length > 0 && <h2 className={styles.h2}>Singles</h2>}
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
          : artist.singles?.map((single) => (
              <div key={single.albumId} className={styles.single}>
                <img
                  width={40}
                  height={40}
                  src={single.thumbnailUrl}
                  alt="Single"
                />
                <div>
                  <p>{single.title}</p>
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
                        onClick={() => handleAddToDB(single)}
                        onKeyDown={(e) =>
                          handleKeyPressWhenTabbed(e, () => {
                            handleAddToDB(single);
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
      {artist?.suggestedArtists.length > 0 && (
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
          : artist.suggestedArtists?.map((suggestedArtist) => (
              <div
                key={suggestedArtist.artistId}
                className={styles["suggested-artist"]}>
                <img
                  width={40}
                  height={40}
                  src={suggestedArtist.thumbnailUrl}
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
        playlists={playlists}
        triggerRefreshHandler={triggerRefreshPlaylistsHandler}
        showModal={showModal}
        handleModalClose={handleModalClose}
        selectedSong={selectedSong}
        checkIfSongIsInDBFlag={true}
      />
    </div>
  );
}
