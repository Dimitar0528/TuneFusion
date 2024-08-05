import { useState } from "react";
import showToast from "../../../utils/showToast";
import { useAddSongToPlaylist } from "../../../hooks/CRUD-hooks/usePlaylists";
import { useGetSong } from "../../../hooks/CRUD-hooks/useSongs";
export default function AddSongToPlaylistModal({
  playlists,
  triggerRefreshHandler,
  showModal,
  handleModalClose,
  selectedSong,
  checkIfSongIsInDBFlag = false,
}) {
  const [_, fetchSong] = useGetSong(selectedSong?.title);

  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const addSongToPlaylist = useAddSongToPlaylist();

  const handlePlaylistSelect = (e) => {
    setSelectedPlaylist(e.target.value);
  };

  const handleAddSongConfirm = async () => {
    if (selectedPlaylist === "")
      return showToast("Please select a playlist first", "warning");
    if (checkIfSongIsInDBFlag) {
      const song = await fetchSong();
      if (song.name !== selectedSong.title) {
        handleModalClose();
        return showToast(song.error, "error", 1500);
      }
    }
    const reqObj = {
      songName: selectedSong.name || selectedSong.title,
      playlistUUID: selectedPlaylist,
    };
    addSongToPlaylist(reqObj, () => handleModalClose(), triggerRefreshHandler);
  };

  return (
    showModal && (
      <dialog open className="modal">
        <div className="modal-content">
          <h2>Add a song to the playlist</h2>
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
            <button onClick={handleAddSongConfirm}>Add</button>
            <button onClick={handleModalClose}>Cancel</button>
          </div>
        </div>
      </dialog>
    )
  );
}
