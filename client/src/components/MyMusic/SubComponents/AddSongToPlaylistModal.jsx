import { useState } from "react";
import showToast from "../../../utils/showToast";
import {
  useAddSongToPlaylist,
  useAddAlbumToPlaylist,
} from "../../../hooks/CRUD-hooks/usePlaylists";
import { useGetSong } from "../../../hooks/CRUD-hooks/useSongs";
export default function AddSongToPlaylistModal({
  playlists,
  triggerRefreshHandler,
  showModal,
  handleModalClose,
  selectedSong,
  selectedSongs = [],
  checkIfSongIsInDBFlag = false,
}) {
  const [_, fetchSong] = useGetSong(selectedSong?.title);

  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const addSongToPlaylist = useAddSongToPlaylist();
  const addAlbumToPlaylist = useAddAlbumToPlaylist();

  const handlePlaylistSelect = (e) => {
    setSelectedPlaylist(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedPlaylist === "") {
      return showToast("Please select a playlist first", "warning");
    }

    if (selectedSongs.length > 0) {
      // Handle album songs
      await addAlbumToPlaylist(
        selectedSongs,
        selectedPlaylist,
        triggerRefreshHandler
      );
      handleClose();
    } else if (selectedSong) {
      // Handle single song
      if (checkIfSongIsInDBFlag) {
        const song = await fetchSong();
        if (song.name !== selectedSong.title) {
          handleClose();
          return showToast(song.error, "error", 1500);
        }
      }
      const reqObj = {
        songName: selectedSong.name || selectedSong.title,
        playlistUUID: selectedPlaylist,
      };
      addSongToPlaylist(
        reqObj,
        () => handleClose(),
        triggerRefreshHandler
      );
    }
  };

  const handleClose = () => {
    const dialog = document.querySelector(".modal");
    dialog.classList.add("closing");
    dialog.addEventListener(
      "animationend",
      () => {
        handleModalClose();
        dialog.classList.remove("closing");
      },
      { once: true }
    );
  };
  return (
    showModal && (
      <dialog open className="modal">
        <div className="modal-content">
          <h2>
            {selectedSongs.length > 0
              ? `Add ${selectedSongs.length} songs to playlist`
              : "Add song to playlist"}
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: ".5rem",
            }}>
            <label htmlFor="playlist"> Select a playlist</label>
            <div className="custom-select">
              <select
                className="add-song-to-playlist"
                onChange={handlePlaylistSelect}
                value={selectedPlaylist || ""}>
                <option value="" disabled>
                  Select a playlist
                </option>
                {playlists.map((playlist) => (
                  <option
                    key={playlist.uuid}
                    value={playlist.uuid}
                    id="playlist">
                    {playlist.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <button onClick={handleSubmit}>Add</button>
            <button onClick={handleClose}>Cancel</button>
          </div>
        </div>
      </dialog>
    )
  );
}
