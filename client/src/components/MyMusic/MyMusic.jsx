import React, { useEffect, useState } from "react";
import MusicList from "./subComponents/MusicList";
import UserPlayLists from "./subComponents/UserPlayLists";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import { useNavigate, useParams } from "react-router-dom";

export default function MyMusic() {
  const navigate = useNavigate();
  const { userUUID } = useParams();
  const { filteredSongs, activePlaylist, setActivePlaylist } = useMusicPlayer();
  const [playlists, setPlaylists] = useState([]);
  const [refreshPlaylist, setRefreshPlaylist] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async (userUUID) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/playlists/${userUUID}`
        );
        if (response.status === 404) {
          navigate("/");
        }
        const data = await response.json();
        setPlaylists(data);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };
    fetchPlaylists(userUUID);
  }, [refreshPlaylist]);

  useEffect(() => {
    if (playlists.length === 0) return;
    const storedActivePlaylist = JSON.parse(
      localStorage.getItem("activePlaylist")
    );
    if (storedActivePlaylist) {
      const playlist = playlists.find(
        (pl) => pl.name === storedActivePlaylist.name
      );
      setActivePlaylist({
        ...storedActivePlaylist,
        Songs: playlist.Songs,
        description: playlist.description,
      });
    }
  }, [playlists]);

  const refreshPlaylistHandler = () => {
    setRefreshPlaylist((prev) => !prev);
  };

  return (
    <div className="body">
      <UserPlayLists
        refreshPlaylist={refreshPlaylistHandler}
        playlists={playlists}
      />

      <MusicList
        title={
          activePlaylist !== null
            ? `${activePlaylist?.name} Songs`
            : "Freshly Added Songs"
        }
        songs={filteredSongs}
        activePlaylist={activePlaylist}
        playlists={playlists}
        refreshPlaylist={refreshPlaylistHandler}
      />
    </div>
  );
}
