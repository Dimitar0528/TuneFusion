import { useState } from "react";
import "./styles/UserPlayLists.css";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useForm } from "../../../hooks/useForm";
import {
  validatePlaylist,
  useCreatePlaylist,
  useEditPlaylist,
  useDeletePlaylist,
} from "../../../hooks/CRUD-hooks/usePlaylists";
import ConfirmDialog from "../../ConfirmDialog";

const initialPlaylistValues = {
  name: "",
  description: "",
  img_src: "",
};

export default function UserPlayLists({ playlists, triggerRefreshHandler }) {
  const {
    activePlaylist,
    setActivePlaylist,
    user,
    handleKeyPressWhenTabbed,
    isPlaylistLoading,
    setCurrentPage,
  } = useMusicPlayer();
  const { userUUID } = user;

  const [showDialog, setShowDialog] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);

  const createPlaylist = useCreatePlaylist();
  const editPlaylist = useEditPlaylist();
  const deletePlaylist = useDeletePlaylist();

  const onSubmit = async (values) => {
    const reqObj = {
      ...values,
      created_by: userUUID,
    };
    if (editingPlaylist) {
      editPlaylist(editingPlaylist.name, reqObj, triggerRefreshHandler);
    } else {
      createPlaylist(reqObj, triggerRefreshHandler);
    }
    handleCloseDialog();
  };

  const {
    values: newPlaylist,
    errors,
    changeHandler,
    submitHandler,
    setValuesWrapper,
  } = useForm(initialPlaylistValues, onSubmit, validatePlaylist);

  const toggleActivePlayList = (playlist) => {
    const newActivePlaylist =
      activePlaylist?.name === playlist.name ? null : playlist;
    setActivePlaylist(newActivePlaylist);
    setCurrentPage(0);
    if (newActivePlaylist) {
      const playlistWithUuid = { ...playlist };
      localStorage.setItem("activePlaylist", JSON.stringify(playlistWithUuid));
    } else {
      localStorage.removeItem("activePlaylist");
    }
  };

  const handleCreatePlaylist = () => {
    setValuesWrapper(initialPlaylistValues);

    setEditingPlaylist(null);
    setShowDialog(true);
  };

  const handleEditPlaylist = (e, playlist) => {
    e.stopPropagation();
    setEditingPlaylist(playlist);
    setValuesWrapper({
      name: playlist.name,
      description: playlist.description || "",
      img_src: playlist.img_src || "",
    });
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const getPlaylistImage = (playlist) => {
    if (!playlist.img_src && playlist.Songs && playlist.Songs.length > 0) {
      playlist.img_src = playlist.Songs.at(-1).img_src;
    }
    return (
      playlist.img_src ||
      "https://cdn-icons-png.freepik.com/512/5644/5644664.png"
    );
  };

  const handleDeletePlaylist = async (playlist) => {
    const callback = () => {
      if (playlist.name === activePlaylist?.name) {
        localStorage.removeItem("activePlaylist");
        setActivePlaylist(null);
      }
    };
    deletePlaylist(playlist.uuid, callback, triggerRefreshHandler);
  };

  const handleDeleteClick = (e, playlist) => {
    e.stopPropagation();

    setPlaylistToDelete(playlist);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (playlistToDelete) {
      handleDeletePlaylist(playlistToDelete);
      setIsModalOpen(false);
      setPlaylistToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setPlaylistToDelete(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
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

        <div className="sort-controls | playlist-controls">
          <input
            id="playlist-search"
            type="search"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {isPlaylistLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="playlist">
                <div className="playlist-title">
                  <Skeleton height={40} width={40} />
                  <Skeleton width={100} />
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <Skeleton width={30} height={20} />
                    <Skeleton width={30} height={20} />
                  </div>
                </div>
              </div>
            ))
          : filteredPlaylists.map((playlist) => (
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
                    style={{ objectFit: "cover" }}
                  />{" "}
                  <h3>{playlist.name}</h3>
                  {playlist.name !== "Liked Songs" && (
                    <div className="action-btns">
                      <i
                        tabIndex={0}
                        title="Edit Playlist"
                        className="fa-solid fa-pen-to-square"
                        onClick={(е) => {
                          handleEditPlaylist(е, playlist);
                        }}
                        onKeyDown={(e) =>
                          handleKeyPressWhenTabbed(e, () =>
                            handleEditPlaylist(e, playlist)
                          )
                        }
                      />

                      <i
                        tabIndex={0}
                        title="Delete PlayList"
                        className="fa-solid fa-delete-left"
                        onClick={(e) => {
                          handleDeleteClick(e, playlist);
                        }}
                        onKeyDown={(e) =>
                          handleKeyPressWhenTabbed(e, () =>
                            handleDeleteClick(e, playlist)
                          )
                        }></i>
                    </div>
                  )}
                </div>
              </div>
            ))}

        {showDialog && (
          <dialog open className="modal">
            <div className="playlist-dialog">
              <h2>
                {editingPlaylist ? "Edit Playlist" : "Create New Playlist"}
              </h2>
              <form method="dialog" onSubmit={submitHandler}>
                <label style={{ marginTop: "1rem" }} htmlFor="name">
                  Playlist Name:
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={newPlaylist.name}
                  onChange={changeHandler}
                  placeholder="My Playlist"
                />
                {errors.name && <p className="error">{errors.name}</p>}
                <label htmlFor="description">Description: (optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={newPlaylist.description}
                  onChange={changeHandler}
                  placeholder="Playlists containing some songs"></textarea>
                <label htmlFor="img_src">Image URL: (optional)</label>
                <input
                  id="img_src"
                  type="text"
                  name="img_src"
                  value={newPlaylist.img_src}
                  onChange={changeHandler}
                  placeholder="https://i.ytimg.com/vi/kCJsVS46CpQ/maxresdefault.jpg"
                />
                <div className="dialog-actions">
                  <button type="submit">Save</button>
                  <button type="button" onClick={handleCloseDialog}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}
      </div>
      {isModalOpen && (
        <ConfirmDialog
          itemType="playlist"
          itemName={playlistToDelete.name}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
}
