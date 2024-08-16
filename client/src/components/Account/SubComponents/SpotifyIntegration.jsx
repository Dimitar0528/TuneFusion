import React, { useState, useEffect } from "react";
import styles from "./styles/SpotifyIntegration.module.css"; // Import CSS Module
import { encodeToBase64 } from "../utils/encodetoBase64";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import { useAddExternalSongToDB } from "../../../hooks/useAddExternalSongToDB";
export default function SpotifyIntegration({ user }) {
  const { userUUID, role } = user;
  const { handleKeyPressWhenTabbed, triggerRefreshSongsHandler } =
    useMusicPlayer();

  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

  const REDIRECT_URI = "http://localhost:5173/callback";
  const SCOPES = ["playlist-read-private", "playlist-read-collaborative"];

  const getAuthUrl = (userUUID) => {
    const state = encodeURIComponent(`userUUID=${userUUID}&tab=Spotify`);
    return `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(SCOPES.join(" "))}&state=${state}`;
  };

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackPage, setTrackPage] = useState({});
  const [playlistPage, setPlaylistPage] = useState(0);
  const playlistsPerPage = 3;
  const [addExternalSongToDB, songLoading] = useAddExternalSongToDB(
    triggerRefreshSongsHandler
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = localStorage.getItem("spotifyAccessToken");
        let refreshToken = localStorage.getItem("spotifyRefreshToken");

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
        const refreshToken = localStorage.getItem("spotifyRefreshToken");
        const newToken = await refreshAccessToken(refreshToken);
        localStorage.setItem("spotifyAccessToken", newToken.access_token);
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
        const refreshToken = localStorage.getItem("spotifyRefreshToken");
        const newToken = await refreshAccessToken(refreshToken);
        localStorage.setItem("spotifyAccessToken", newToken.access_token);

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
            const refreshToken = localStorage.getItem("spotifyRefreshToken");
            const newToken = await refreshAccessToken(refreshToken);
            localStorage.setItem("spotifyAccessToken", newToken.access_token);

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

  if (error) return <div className={styles.error}>Error: {error}</div>;

  // Pagination logic for playlists
  const playlistsToShow = playlists.slice(
    playlistPage * playlistsPerPage,
    (playlistPage + 1) * playlistsPerPage
  );

  return (
    <div className={styles.spotifyIntegration}>
      <h1>Your Spotify Playlists</h1>
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
                    {tracksToShow.map((track) => (
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
                                onClick={() => addExternalSongToDB(track.name)}
                                onKeyDown={(e) =>
                                  handleKeyPressWhenTabbed(e, () => {
                                    addExternalSongToDB(track.name);
                                  })
                                }
                                title={
                                  songLoading ? "Loading" : "Add to Database"
                                }></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.pagination}>
                  <button
                    onClick={() => handlePageChange(playlist.id, -1)}
                    disabled={currentPage <= 0}>
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(playlist.id, 1)}
                    disabled={(currentPage + 1) * 10 >= playlist.tracks.length}>
                    Next
                  </button>
                </div>
              </div>
            );
          })}
          <div className={styles.playlistPagination}>
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
        </>
      )}
    </div>
  );
}
