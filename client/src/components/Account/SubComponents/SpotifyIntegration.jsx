import React, { useState, useEffect } from "react";
import styles from "./styles/SpotifyIntegration.module.css";
import { encodeToBase64 } from "../utils/encodetoBase64";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import { useAddExternalSongToDB } from "../../../hooks/useAddExternalSongToDB";
import AddSongToPlaylistModal from "../../MyMusic/SubComponents/AddSongToPlaylistModal";
import {
  useAddExternalSongToPlaylist,
  useCreatePlaylist,
} from "../../../hooks/CRUD-hooks/usePlaylists";
export default function SpotifyIntegration({ user, triggerRefreshHandler }) {
  const { userUUID, role } = user;
  const createPlaylist = useCreatePlaylist();
  const addExternalSongToPlaylist = useAddExternalSongToPlaylist();
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
    handleKeyPressWhenTabbed,
    triggerRefreshSongsHandler,
    triggerRefreshPlaylistsHandler,
    playlists: TuneFusionPlaylists,
  } = useMusicPlayer();

  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

  const REDIRECT_URI = "http://localhost:5173/callback";
  const SCOPES = ["playlist-read-private", "playlist-read-collaborative"];

  const getAuthUrl = (userUUID) => {
    const state = encodeURIComponent(
      `userUUID=${userUUID}&tab=Spotify-Playlists`
    );
    return `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(SCOPES.join(" "))}&state=${state}`;
  };

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackPage, setTrackPage] = useState({});
  const [playlistPage, setPlaylistPage] = useState(0);
  const [playlistsPerPage, setPlaylistsPerPage] = useState(5);
  const [addExternalSongToDB, songLoading] = useAddExternalSongToDB(
    triggerRefreshSongsHandler
  );
  const handleItemsPerPageChange = (e) => {
    setPlaylistsPerPage(Number(e.target.value));
    setPlaylistPage(0);
  };

  const movePlaylistToTuneFusionHandler = (values, playlistTracks) => {
    const reqObj = {
      ...values,
      created_by: userUUID,
    };
    const playlistTracksObj = {
      ...playlistTracks,
      playlistName: values.name,
      created_by: userUUID,
      userRole: role,
    };
    createPlaylist(reqObj, triggerRefreshHandler);
    addExternalSongToPlaylist(
      playlistTracksObj,
      triggerRefreshHandler,
      triggerRefreshSongsHandler
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = localStorage.getItem("SP_AT");
        let refreshToken = localStorage.getItem("SP_RT");

        if (!token && !refreshToken) {
          window.location.href = getAuthUrl(userUUID);
          return;
        }

        const userProfile = await fetchUserProfile(token);
        const playlistsWithTracks = await fetchPlaylists(token, userProfile.id);
        setPlaylists(playlistsWithTracks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userUUID]);

  const refreshAccessToken = async (refreshToken) => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${encodeToBase64(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        )}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }
    return response.json();
  };

  const fetchUserProfile = async (token) => {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        const refreshToken = localStorage.getItem("SP_RT");
        const newToken = await refreshAccessToken(refreshToken);
        localStorage.setItem("SP_AT", newToken.access_token);
        return fetchUserProfile(newToken.access_token);
      } else {
        throw new Error("Failed to fetch user profile");
      }
    }
    return response.json();
  };

  const fetchPlaylists = async (token, userId) => {
    const playlistsResponse = await fetch(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!playlistsResponse.ok) {
      if (playlistsResponse.status === 401) {
        const refreshToken = localStorage.getItem("SP_RT");
        const newToken = await refreshAccessToken(refreshToken);
        localStorage.setItem("SP_AT", newToken.access_token);

        return fetchPlaylists(newToken.access_token, userId);
      } else {
        throw new Error("Failed to fetch playlists");
      }
    }
    const data = await playlistsResponse.json();
    const allPlaylists = data.items;

    const playlistsWithTracks = await Promise.all(
      allPlaylists.map(async (playlist) => {
        const playlistTracksResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!playlistTracksResponse.ok) {
          if (playlistTracksResponse.status === 401) {
            const refreshToken = localStorage.getItem("SP_RT");
            const newToken = await refreshAccessToken(refreshToken);
            localStorage.setItem("SP_AT", newToken.access_token);

            return fetchPlaylists(newToken.access_token, userId);
          } else {
            throw new Error("Failed to fetch playlist tracks");
          }
        }
        const playlistTracksData = await playlistTracksResponse.json();
        return {
          ...playlist,
          tracks: playlistTracksData.items.map((item) => item.track),
        };
      })
    );

    return playlistsWithTracks;
  };

  const handlePageChange = (playlistId, direction) => {
    setTrackPage((prev) => ({
      ...prev,
      [playlistId]: (prev[playlistId] || 0) + direction,
    }));
  };

  const handlePlaylistPageChange = (direction) => {
    setPlaylistPage((prev) => prev + direction);
  };

  if (loading)
    return <Skeleton height={550} width="clamp(300px, 80vw, 100%)" />;

  if (error)
    return (
      <div style={{ backgroundColor: "white" }} className="error">
        Error: {error}
      </div>
    );

  const playlistsToShow = playlists.slice(
    playlistPage * playlistsPerPage,
    (playlistPage + 1) * playlistsPerPage
  );

  return (
    <div className={styles.spotifyIntegration}>
      <h1>Your Spotify Playlists</h1>
      <p style={{ marginBottom: "1rem" }}>
        Here you can see the first 100 songs from playlists, that are either
        created or liked by you.
      </p>
      <div className="select-container" style={{ marginBottom: "1rem" }}>
        <label htmlFor="number-of-songs">Playlists per page: &nbsp;</label>
        <select
          id="number-of-songs"
          value={playlistsPerPage}
          onChange={handleItemsPerPageChange}>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={15}>15 per page</option>
          <option value={20}>20 per page</option>
        </select>
      </div>
      {playlists.length === 0 ? (
        <p>No playlists created by you.</p>
      ) : (
        <>
          {playlistsToShow.map((playlist) => {
            const currentPage = trackPage[playlist.id] || 0;
            const tracksToShow = playlist.tracks.slice(
              currentPage * 10,
              (currentPage + 1) * 10
            );
            const playlistValues = {
              name: playlist.name,
              description: playlist.description,
              img_src: playlist.images[0]?.url,
            };
            const extractedTracks = playlist.tracks.map((track) => {
              const { name, artists, album } = track;

              const artistNames = artists
                .map((artist) => artist.name)
                .join(", ");

              const albumImage =
                album.images && album.images[0] ? album.images[0].url : "";

              return {
                name,
                artistNames,
                albumImage,
              };
            });

            return (
              <div key={playlist.id} className={styles.playlistContainer}>
                <div className={styles.playlistHeader}>
                  <img
                    width={70}
                    src={playlist.images[0]?.url}
                    alt={playlist.name}
                    className={styles.playlistImage}
                  />
                  <h2 className={styles.playlistName}>{playlist.name}</h2>
                  <button
                    onClick={() =>
                      movePlaylistToTuneFusionHandler(
                        playlistValues,
                        extractedTracks
                      )
                    }
                    className={styles.movePlaylistBtn}>
                    <span> Transfer playlist</span>
                  </button>
                </div>
                <table className={styles.playlistTable}>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Track Name</th>
                      <th>Artists</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tracksToShow.map((track) => {
                      const songDetails = `${track.name}-${track.artists[0].name}`;
                      return (
                        <tr key={track.id}>
                          <td>
                            <img
                              src={track.album.images[2]?.url}
                              alt={track.name}
                              className={styles.trackImage}
                            />
                          </td>
                          <td>{track.name}</td>
                          <td>
                            {track.artists.map((artist, index) => (
                              <React.Fragment key={artist.id}>
                                <Link
                                  to={`/artist/${artist.name}/description`}
                                  className={styles.songArtist}>
                                  {artist.name}
                                </Link>
                                {index < track.artists.length - 1 && ", "}
                              </React.Fragment>
                            ))}
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-evenly",
                              }}>
                              {role === "admin" && (
                                <button
                                  disabled={songLoading}
                                  className={styles.addBtn}
                                  style={{
                                    backgroundColor: "white",
                                    border: "transparent",
                                  }}>
                                  <i
                                    style={{ color: "var(--primary-clr)" }}
                                    tabIndex={0}
                                    disabled={songLoading}
                                    className={
                                      songLoading
                                        ? "fas fa-spinner fa-spin"
                                        : "fa-solid fa-square-plus"
                                    }
                                    onClick={() =>
                                      addExternalSongToDB(songDetails)
                                    }
                                    onKeyDown={(e) =>
                                      handleKeyPressWhenTabbed(e, () => {
                                        addExternalSongToDB(songDetails);
                                      })
                                    }
                                    title={
                                      songLoading
                                        ? "Loading"
                                        : "Add to Database"
                                    }></i>
                                </button>
                              )}
                              <div
                                className={styles.addBtn}
                                style={{ backgroundColor: "white" }}>
                                <i
                                  tabIndex={0}
                                  className="fa-solid fa-plus"
                                  onClick={() => handleAddSongToPlayList(track)}
                                  onKeyDown={(e) =>
                                    handleKeyPressWhenTabbed(e, () => {
                                      handleAddSongToPlayList(track);
                                    })
                                  }
                                  title="Add to playlist"></i>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className={styles.pagination}>
                  <button
                    onClick={() => handlePageChange(playlist.id, -1)}
                    disabled={currentPage <= 0}>
                    Previous Songs
                  </button>
                  <button
                    onClick={() => handlePageChange(playlist.id, 1)}
                    disabled={(currentPage + 1) * 10 >= playlist.tracks.length}>
                    Next Songs
                  </button>
                </div>
              </div>
            );
          })}
          <div className={styles.pagination}>
            <button
              onClick={() => handlePlaylistPageChange(-1)}
              disabled={playlistPage <= 0}>
              Previous Playlists
            </button>
            <button
              onClick={() => handlePlaylistPageChange(1)}
              disabled={
                (playlistPage + 1) * playlistsPerPage >= playlists.length
              }>
              Next Playlists
            </button>
          </div>
          <AddSongToPlaylistModal
            playlists={TuneFusionPlaylists}
            triggerRefreshHandler={triggerRefreshPlaylistsHandler}
            showModal={showModal}
            handleModalClose={handleModalClose}
            selectedSong={selectedSong}
            checkIfSongIsInDBFlag={true}
          />
        </>
      )}
    </div>
  );
}
