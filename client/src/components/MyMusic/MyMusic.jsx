import MusicList from "./subComponents/MusicList";
import UserPlayLists from "./subComponents/UserPlayLists";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";

export default function MyMusic() {
  const { filteredSongs, activePlaylist, playlists, refreshPlaylistHandler } =
    useMusicPlayer();

  return (
    <div className="body">
      <UserPlayLists
        playlists={playlists}
        refreshPlaylist={refreshPlaylistHandler}
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
