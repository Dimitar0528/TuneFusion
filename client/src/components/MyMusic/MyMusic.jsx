import MusicList from "./SubComponents/MusicList";
import UserPlayLists from "./SubComponents/UserPlayLists";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";

export default function MyMusic() {
  const { filteredSongs, activePlaylist, playlists, triggerRefreshHandler } =
    useMusicPlayer();

  return (
    <div className="body">
      <UserPlayLists
        playlists={playlists}
        triggerRefreshHandler={triggerRefreshHandler}
      />

      <MusicList
        title={
          activePlaylist !== null && activePlaylist !== undefined
            ? `${activePlaylist?.name}`
            : "Freshly Added Songs"
        }
        songs={filteredSongs}
        activePlaylist={activePlaylist}
        playlists={playlists}
        triggerRefreshHandler={triggerRefreshHandler}
      />
    </div>
  );
}
