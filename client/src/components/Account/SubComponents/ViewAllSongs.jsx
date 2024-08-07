import { useNavigate } from "react-router-dom";
import TableLayout from "../TableLayout";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import extractUUIDPrefix from "../../../utils/extractUUIDPrefix";
import { formatTime } from "../../../utils/formatTime";
import { useDeleteSong } from "../../../hooks/CRUD-hooks/useSongs";
export default function ViewAllSongs({ triggerRefreshHandler }) {
  const deleteSong = useDeleteSong();

  const { songs, currentSongUUID, setCurrentSongUUID, setCurrentTime } =
    useMusicPlayer();
  const navigate = useNavigate();
  const songsPerPage = 20;
  const handleDeleteSong = async (uuid) => {
    if (!window.confirm("Are you sure you want to delete this song?")) return;

    if (extractUUIDPrefix(uuid) === currentSongUUID) {
      const currentIndex = songs.findIndex(
        (song) => extractUUIDPrefix(song.uuid) === currentSongUUID
      );
      const nextIndex = (currentIndex + 1) % songs.length;
      setCurrentSongUUID(extractUUIDPrefix(songs[nextIndex].uuid));
      setCurrentTime(0);
    }
    await deleteSong(uuid, triggerRefreshHandler);
  };

  return (
    <TableLayout
      data={songs}
      columns={[
        "Image",
        "UUID",
        "Name",
        "Artist",
        "Duration",
        "Audio Source",
        "Actions",
      ]}
      title="Songs"
      hasDbSearch={true}
      onAddClick={() => navigate("/addsong")}
      renderRow={(song) => (
        <tr key={song.uuid}>
          <td data-th="Image">
            <img
              src={song.img_src}
              alt={`${song.artist} cover`}
              className="song-image"
            />
          </td>
          <td data-th="UUID">{song.uuid}</td>
          <td data-th="Title">{song.name}</td>
          <td data-th="Artist">{song.artist}</td>
          <td data-th="Duration">{formatTime(song.duration)}</td>
          <td data-th="Audio Source">{song.audio_src}</td>
          <td data-th="Actions">
            <div className="cta-admin-buttons">
              <button onClick={() => navigate(`/updatesong/${song.name}`)}>
                Edit
              </button>
              <button onClick={() => handleDeleteSong(song.uuid)}>
                Delete
              </button>
            </div>
          </td>
        </tr>
      )}
    />
  );
}
