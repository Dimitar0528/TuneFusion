import React, { useState, useRef } from "react";
import "./styles/UserPlayLists.css";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import showToast from "../../../showToast";

export default function UserPlayLists({ playlists, refreshPlaylist }) {
  const { setActivePlaylist, user, handleKeyPressWhenTabbed } =
    useMusicPlayer();
  const { userUUID } = user;
  const [activeIndex, setActiveIndex] = useState(() => {
    const storedActivePlaylist = JSON.parse(
      localStorage.getItem("activePlaylist")
    );
    return storedActivePlaylist?.activeIndex;
  });

  const [showDialog, setShowDialog] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    name: "",
    description: "",
    img_src: "", // Add this line
  });

  const dialogRef = useRef(null);

  const toggleActivePlayList = (index, playlist) => {
    const newActiveIndex = activeIndex === index ? null : index;
    setActiveIndex(newActiveIndex);

    if (newActiveIndex !== null) {
      const playlistWithIndex = { ...playlist, activeIndex: newActiveIndex };
      setActivePlaylist(playlistWithIndex);
    } else {
      localStorage.removeItem("activePlaylist");
      setActivePlaylist(null);
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
      alert("Please enter a playlist name.");
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
      img_src: "", // Add this line
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
  };

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
      {playlists.map((playlist, index) => (
        <div key={index} className="playlist">
          <div
            tabIndex={0}
            className={`playlist-title ${activeIndex === index && "active"}`}
            onClick={() => toggleActivePlayList(index, playlist)}
            onKeyDown={(e) =>
              handleKeyPressWhenTabbed(e, () =>
                toggleActivePlayList(index, playlist)
              )
            }
            title={
              activeIndex === index
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
          </div>
        </div>
      ))}

      {showDialog && (
        <dialog open ref={dialogRef} className="modal">
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
                {" "}
                {/* Add this block */}
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
