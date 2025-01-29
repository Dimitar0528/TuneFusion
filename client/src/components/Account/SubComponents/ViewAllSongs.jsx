import { useState } from "react";
import { useNavigate } from "react-router";
import { Fragment } from "react";
import TableLayout from "../TableLayout";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import extractUUIDPrefix from "../../../utils/extractUUIDPrefix";
import { formatTime } from "../../../utils/formatTime";
import {
  useDeleteSong,
  useGetAllSongs,
} from "../../../hooks/CRUD-hooks/useSongs";
import ConfirmDeleteModal from "../../Common/ConfirmDialog";
import TransitionLink from "../../Common/TransitionLink";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);

  const handleDeleteSong = async (uuid) => {
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

  const handleDeleteClick = (song) => {
    setSongToDelete(song);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (songToDelete) {
      handleDeleteSong(songToDelete.uuid);
      setIsModalOpen(false);
      setSongToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setSongToDelete(null);
  };
  
   function handleOnAddClick(){
   if (!document.startViewTransition) {
     navigate("/addsong");
     return;
   }

   document.startViewTransition(() => {
       navigate("/addsong");
   });
  }
  return (
    <div>
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
        onAddClick={handleOnAddClick}
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
                    <TransitionLink
                      className="song-artist"
                      to={`/artist/${artist}/description`}>
                      {artist}
                    </TransitionLink>
                    {index < artistArray.length - 1 && ", "}
                  </Fragment>
                ))}
              </td>
              <td data-th="Audio Source">
                <a
                  target="_blank"
                  className="song-artist"
                  href={song.audio_src}>
                  {" "}
                  {song.audio_src}
                </a>
              </td>
              <td data-th="Duration">{formatTime(song.duration)}</td>
              <td data-th="Actions">
                <div className="cta-admin-buttons">
                  <button>
                    <TransitionLink to={`/updatesong/${song.name}`}>
                      <span style={{color: 'black'}}>Edit</span>
                    </TransitionLink>
                  </button>
                  <button onClick={() => handleDeleteClick(song)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          );
        }}
      />
      {isModalOpen && (
        <ConfirmDeleteModal
          actionType="Deletion"
          action="delete"
          itemType="song"
          itemName={songToDelete.name}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
