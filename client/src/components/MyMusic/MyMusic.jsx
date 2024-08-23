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
    <Sidebar
      user={user}
      playlists={playlists}
      triggerRefreshHandler={triggerRefreshPlaylistsHandler}
      songs={filteredSongs}
      activePlaylist={activePlaylist}
    />
  );
}
