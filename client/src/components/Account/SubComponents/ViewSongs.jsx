// ViewSongs.js
import React from "react";
import { useNavigate } from "react-router-dom";
import showToast from "../../../showToast";
import Table from "../Table";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import extractUUIDPrefix from "../../../utils/extractUUIDPrefix";
export default function ViewSongs({ songs }) {
  const {
    currentSongUUID,
    setCurrentSongUUID,
    setCurrentTime,
    getSongTimeStamps,
  } = useMusicPlayer();
  const navigate = useNavigate();
  const songsPerPage = 10;

  const handleDeleteSong = async (uuid) => {
    if (!window.confirm("Are you sure you want to delete this song?")) return;
    try {
      if (extractUUIDPrefix(uuid) === currentSongUUID) {
        const currentIndex = songs.findIndex(
          (song) => extractUUIDPrefix(song.uuid) === currentSongUUID
        );
        const nextIndex = (currentIndex + 1) % songs.length;
        setCurrentSongUUID(extractUUIDPrefix(songs[nextIndex].uuid));
        setCurrentTime(0);
      }

      const response = await fetch(
        `http://localhost:3000/api/songs/deleteSong/${uuid}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        showToast(`Error: ${errorData.error}`, "error");
      } else {
        const responseData = await response.json();
        showToast(responseData.message, "success", 1500, true);
      }
    } catch (error) {
      console.error("Error:", error);
      showToast(`Error: ${error}`, "error");
    }
  };

  return (
    <Table
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
      itemsPerPage={songsPerPage}
      onAddClick={() => navigate("/addsong/newsong")}
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
          <td data-th="Duration">{getSongTimeStamps(song.duration)}</td>
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
