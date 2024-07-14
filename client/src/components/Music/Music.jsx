import React, { useEffect } from "react";
import MusicList from "./SubComponents/MusicList";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import UserPlayLists from "./SubComponents/UserPlayLists";

export default function Music({}) {
  const { filteredSongs, activePlaylist } = useMusicPlayer();
  return (
    <div className="body">
      <UserPlayLists />
      <MusicList
        title={
          activePlaylist !== null
            ? `${activePlaylist?.name} Songs`
            : "Freshly Added Songs"
        }
        songs={filteredSongs}
      />
    </div>
  );
}
