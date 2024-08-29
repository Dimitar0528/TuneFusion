import React, { useEffect } from "react";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import { useGetPublicPlaylists } from "../../../hooks/CRUD-hooks/usePlaylists";
import MusicList from "../SubComponents/MusicList";
import "./styles/Discover.css";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Discover({ userUUID }) {
  const navigate = useNavigate();
  const { refreshPlaylistsFlag, activePlaylist, setActivePlaylist } =
    useMusicPlayer();
  const [publicPlaylists, isPublicPlaylistLoading] =
    useGetPublicPlaylists(refreshPlaylistsFlag);

  const handlePlaylistClick = (playlist) => {
    setActivePlaylist(playlist);
    navigate(`?playlist=${playlist?.name.replace(/\s+/g, "")}&page=1`);
  };

  const handleCloseBtnClick = () => {
    setActivePlaylist(null);
    navigate(`/musicplayer/${userUUID}`);
  };

  useEffect(() => {
    setActivePlaylist(null);
    navigate(`/musicplayer/${userUUID}`);
    return () => {
      setActivePlaylist(null);
      localStorage.removeItem("activePlaylist");
      localStorage.setItem("CP", `${1}`);
    };
  }, []);

  if (isPublicPlaylistLoading) {
    return (
      <div>
        <h2>Discover</h2>
        <Skeleton height={40} width={200} style={{ marginBottom: "10px" }} />
        <div className="discover-playlists">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="playlist-card">
              <Skeleton height={120} width={350} />
              <Skeleton height={15} width={150} />
              <Skeleton height={15} width={250} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "1rem" }}>
      <h2>Discover</h2>
      <button
        style={{ cursor: "pointer" }}
        disabled={!activePlaylist}
        onClick={handleCloseBtnClick}>
        Back
      </button>
      {!activePlaylist ? (
        <div className="discover-playlists">
          {publicPlaylists.length ? (
            publicPlaylists.map((playlist) => (
              <div
                key={playlist.uuid}
                className="playlist-card"
                onClick={() => handlePlaylistClick(playlist)}>
                <img
                  src={
                    playlist.img_src ||
                    "https://cdn-icons-png.freepik.com/512/5644/5644664.png"
                  }
                  alt={playlist.name}
                  className="playlist-cover"
                />
                <h3>{playlist.name}</h3>
                <p>{playlist.description}</p>
              </div>
            ))
          ) : (
            <p>No playlists available</p>
          )}
        </div>
      ) : (
        <MusicList
          title={`${activePlaylist.name} - Created by "${activePlaylist.created_by}"`}
          songs={activePlaylist.Songs}
          activePlaylist={activePlaylist}
          playlists={publicPlaylists}
          triggerRefreshHandler={refreshPlaylistsFlag}
          styles={{ width: "95%", marginInline: "auto", maxHeight: "100vh" }}
        />
      )}
    </div>
  );
}
