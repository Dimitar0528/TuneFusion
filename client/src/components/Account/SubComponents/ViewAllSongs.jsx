import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Fragment } from "react";
import TableLayout from "../TableLayout";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import extractUUIDPrefix from "../../../utils/extractUUIDPrefix";
import { formatTime } from "../../../utils/formatTime";
import {
  useDeleteSong,
  useGetAllSongs,
} from "../../../hooks/CRUD-hooks/useSongs";
export default function ViewAllSongs({
  triggerRefreshSongsHandler,
  triggerRefreshPlaylistsHandler,
}) {
  const deleteSong = useDeleteSong();
  const {
    refreshSongsFlag,
    currentSongUUID,
    setCurrentSongUUID,
    setCurrentTime,
  } = useMusicPlayer();
  const [songs] = useGetAllSongs(refreshSongsFlag);
  const navigate = useNavigate();
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
    await deleteSong(
      uuid,
      triggerRefreshSongsHandler,
      triggerRefreshPlaylistsHandler
    );
  };

  return (
    <TableLayout
      data={songs}
      columns={[
        "Image",
        "UUID",
        "Name",
        "Artist",
        "Audio Source",
        "Duration",
        "Actions",
      ]}
      title="Songs"
      hasDbSearch={true}
      onAddClick={() => navigate("/addsong")}
      renderRow={(song) => {
        const artistArray = song.artist
          .split(/, | & |,|&/)
          .map((artist) => artist.trim());
        return (
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
            <td data-th="Artist">
              {artistArray.map((artist, index) => (
                <Fragment key={artist}>
                  <Link
                    className="song-artist"
                    to={`/artist/${artist}/description`}>
                    {artist}
                  </Link>
                  {index < artistArray.length - 1 && ", "}
                </Fragment>
              ))}
            </td>
            <td data-th="Audio Source">
              <a target="_blank" className="song-artist" href={song.audio_src}>
                {" "}
                {song.audio_src}
              </a>
            </td>
            <td data-th="Duration">{formatTime(song.duration)}</td>
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
        );
      }}
    />
  );
}
