import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import UserPlayLists from "../SubComponents/UserPlayLists";
import MusicList from "../SubComponents/MusicList";
export default function MyLibray() {
  const {
    filteredSongs,
    activePlaylist,
    playlists,
    triggerRefreshPlaylistsHandler,
  } = useMusicPlayer();
  const playlistTitle = ` ${activePlaylist?.name} - ${
    activePlaylist?.visibility?.charAt(0).toUpperCase() +
    activePlaylist?.visibility?.slice(1)
  } Playlist`;
  return (
    <>
      <UserPlayLists
        playlists={playlists}
        triggerRefreshHandler={triggerRefreshPlaylistsHandler}
      />
      <MusicList
        title={!!activePlaylist ? `${playlistTitle}` : "Freshly Added Songs"}
        songs={filteredSongs}
        activePlaylist={activePlaylist}
        playlists={playlists}
        triggerRefreshHandler={triggerRefreshPlaylistsHandler}
      />
    </>
  );
}
