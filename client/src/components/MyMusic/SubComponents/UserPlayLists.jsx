import { useState } from "react";
import "./styles/UserPlayLists.css";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import showToast from "../../../utils/showToast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function UserPlayLists({ playlists, refreshPlaylist }) {
  const {
    activePlaylist,
    setActivePlaylist,
    user,
    handleKeyPressWhenTabbed,
    isPlaylistLoading,
  } = useMusicPlayer();
  const { userUUID } = user;
  const [showDialog, setShowDialog] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    name: "",
    description: "",
    img_src: "",
  });

  const toggleActivePlayList = (playlist) => {
    const newActivePlaylist =
      activePlaylist?.name === playlist.name ? null : playlist;
    setActivePlaylist(newActivePlaylist);

    if (newActivePlaylist) {
      const playlistWithUuid = { ...playlist };
      localStorage.setItem("activePlaylist", JSON.stringify(playlistWithUuid));
    } else {
      localStorage.removeItem("activePlaylist");
    }
  };

  const handleCreatePlaylist = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleSavePlaylist = async () => {
    if (newPlaylist.name.trim() === "") {
      showToast("Please enter a playlist name.", "warning");
      return;
    }
    const reqObj = {
      ...newPlaylist,
      created_by: userUUID,
    };
    const response = await fetch(
      "http://localhost:3000/api/playlists/create-playlist",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqObj),
      }
    );
    if (response.ok) {
      const data = await response.json();
      showToast(data.message, "success");
      refreshPlaylist();
    } else {
      const data = await response.json();
      showToast(data.error, "error");
    }
    setNewPlaylist({
      name: "",
      description: "",
      img_src: "",
    });

    handleCloseDialog();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPlaylist((prevPlaylist) => ({
      ...prevPlaylist,
      [name]: value,
    }));
  };

  const getPlaylistImage = (playlist) => {
    if (playlist.img_src) return playlist.img_src;
    if (playlist.Songs && playlist.Songs.length > 0)
      return playlist.Songs[playlist.Songs.length - 1].img_src;
    return "https://cdn-icons-png.freepik.com/512/5644/5644664.png";
  };

  const handleEditPlaylist = (playlistId) => {
    // history.push(`/updatePlaylist/${playlistId}`);
  };

  const handleDeletePlaylist = async (e, playlist) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this playlist?"))
      return;

    const response = await fetch(
      `http://localhost:3000/api/playlists/delete-playlist/${playlist.uuid}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      const data = await response.json();
      showToast(data.message, "success");
      if (playlist.name === activePlaylist.name) {
        localStorage.removeItem("activePlaylist");
        setActivePlaylist(null);
      }
      refreshPlaylist();
    } else {
      const data = await response.json();
      showToast(data.error, "error");
    }
  };
  const numberOfSkeletons = playlists.length ? playlists.length : 6;

  return (
    <div className="playlists">
      <div className="playlist-header">
        <h3>
          {" "}
          <i className="fa-brands fa-napster"></i> Your Library
        </h3>
        <i
          tabIndex={0}
          className="fa-solid fa-plus | add-playlist"
          onClick={handleCreatePlaylist}
          onKeyDown={(e) => handleKeyPressWhenTabbed(e, handleCreatePlaylist)}
          title="Create playlist"></i>
      </div>
      {isPlaylistLoading
        ? Array.from({ length: numberOfSkeletons }).map((_, index) => (
            <div key={index} className="playlist">
              <div className="playlist-title">
                <Skeleton circle={true} height={45} width={45} />
                <Skeleton width={100} />
                <div className="playlist-actions">
                  <Skeleton width={60} height={20} />
                  <Skeleton width={60} height={20} />
                </div>
              </div>
            </div>
          ))
        : playlists.map((playlist) => (
            <div
              key={playlist.uuid}
              className={`playlist ${
                activePlaylist?.name === playlist.name && "active"
              }`}>
              <div
                tabIndex={0}
                className={`playlist-title`}
                onClick={() => toggleActivePlayList(playlist)}
                onKeyDown={(e) =>
                  handleKeyPressWhenTabbed(e, () =>
                    toggleActivePlayList(playlist)
                  )
                }
                title={
                  activePlaylist?.name === playlist.name
                    ? "Deactivate playlist"
                    : "Set active playlist"
                }>
                <img
                  src={getPlaylistImage(playlist)}
                  alt={playlist.name}
                  width={45}
                  height={45}
                />{" "}
                <h3>{playlist.name}</h3>
                {playlist.name !== "Liked Songs" && (
                  <div className="playlist-actions">
                    <button
                      onClick={(e) => {
                        handleEditPlaylist(playlist.uuid);
                      }}>
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        handleDeletePlaylist(e, playlist);
                      }}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

      {showDialog && (
        <dialog open className="modal">
          <div className="playlist-dialog">
            <h2>Create New Playlist</h2>
            <form method="dialog">
              <label>
                Playlist Name:
                <input
                  type="text"
                  name="name"
                  value={newPlaylist.name}
                  onChange={handleChange}
                />
              </label>
              <label>
                Description: (optional)
                <textarea
                  name="description"
                  value={newPlaylist.description}
                  onChange={handleChange}></textarea>
              </label>
              <label>
                Image URL: (optional)
                <input
                  type="text"
                  name="img_src"
                  value={newPlaylist.img_src}
                  onChange={handleChange}
                />
              </label>
              <div className="dialog-actions">
                <button type="button" onClick={handleSavePlaylist}>
                  Save
                </button>
                <button type="button" onClick={handleCloseDialog}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
}
