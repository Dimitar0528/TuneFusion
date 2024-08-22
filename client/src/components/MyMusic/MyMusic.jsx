import MusicList from "./SubComponents/MusicList";
import UserPlayLists from "./SubComponents/UserPlayLists";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
export default function MyMusic() {
  const { currentUserUUID } = useParams();
  const {
    filteredSongs,
    activePlaylist,
    playlists,
    triggerRefreshPlaylistsHandler,
    user,
  } = useMusicPlayer();
  const { userUUID } = user;
  if (userUUID !== "") {
    if (currentUserUUID !== userUUID) return <Navigate to="/" replace />;
  }
  return (
    <div className="body">
      {/* <Sidebar user={user} /> */}
      <UserPlayLists
        playlists={playlists}
        triggerRefreshHandler={triggerRefreshPlaylistsHandler}
      />
      <MusicList
        title={
          !!activePlaylist ? `${activePlaylist?.name}` : "Freshly Added Songs"
        }
        songs={filteredSongs}
        activePlaylist={activePlaylist}
        playlists={playlists}
        triggerRefreshHandler={triggerRefreshPlaylistsHandler}
      />
    </div>
  );
}
