import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import UserPlayLists from "../SubComponents/UserPlayLists";
import MusicList from "../SubComponents/MusicList";
import { useGetUserDetails } from "../../../hooks/CRUD-hooks/useUsers";
export default function MyLibray() {
  const {
    filteredSongs,
    activePlaylist,
    playlists,
    triggerRefreshPlaylistsHandler,
    user
  } = useMusicPlayer();
     const { userUUID } = user;
     const [currentUser] = useGetUserDetails(userUUID);
 const playlistTitle = `${activePlaylist?.name} - ${
   activePlaylist?.visibility?.charAt(0).toUpperCase() +
   activePlaylist?.visibility?.slice(1)
 } Playlist${
   currentUser.name !== activePlaylist?.created_by
     ? `: [Created by: "${activePlaylist?.created_by}"]`
     : ""
 }`;

  return (
    <>
      <UserPlayLists
        playlists={playlists}
        triggerRefreshHandler={triggerRefreshPlaylistsHandler}
      />
      <MusicList
        title={activePlaylist ? `${playlistTitle}` : "Freshly Added Songs"}
        songs={filteredSongs}
        activePlaylist={activePlaylist}
        playlists={playlists}
        triggerRefreshHandler={triggerRefreshPlaylistsHandler}
      />
    </>
  );
}
