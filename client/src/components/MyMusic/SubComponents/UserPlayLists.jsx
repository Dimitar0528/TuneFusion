import React, { useState } from "react";
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
  useUnlikePlaylist,
} from "../../../hooks/CRUD-hooks/usePlaylists";
import ConfirmDialog from "../../Common/ConfirmDialog";
import { useNavigate } from "react-router";
import { useGetUserDetails } from "../../../hooks/CRUD-hooks/useUsers";
import extractUUIDPrefix from "../../../utils/extractUUIDPrefix";
import { getPlaylistImage } from "../../../utils/getPlaylistImage";

const initialPlaylistValues = {
  name: "",
  description: "",
  img_src: "",
  visibility: "",
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
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [deletingPlaylistUUID, setDeletingPlaylistUUID] = useState(null);

  const createPlaylist = useCreatePlaylist();
  const editPlaylist = useEditPlaylist();
  const deletePlaylist = useDeletePlaylist();
  const unlikePlaylist = useUnlikePlaylist();
  const [currentUser] = useGetUserDetails(userUUID);

  const onSubmit = async (values) => {
    if (editingPlaylist) {
      // Directly edit playlist without view transition
      await handleCreateOrEditPlaylist(values);
      return;
    }

    // Only apply view transition for new playlist creation
    if (!document.startViewTransition) {
      await handleCreateOrEditPlaylist(values, true);
      return;
    }

    document.startViewTransition(async () => {
      await handleCreateOrEditPlaylist(values, true);
    });
  };

  const handleCreateOrEditPlaylist = async (values, isNewPlaylist = false) => {
    const reqObj = {
      ...values,
      created_by: currentUser.name,
    };
    if (editingPlaylist) {
      const updatedPlaylist = await editPlaylist(
        editingPlaylist.name,
        reqObj,
        triggerRefreshHandler
      );
      localStorage.setItem(
        "activePlaylist",
        JSON.stringify({
          name: updatedPlaylist?.name,
          visibility: updatedPlaylist?.visibility,
        })
      );
    } else {
      await createPlaylist(reqObj, triggerRefreshHandler);

      if (isNewPlaylist) {
        // Ensure animation after playlist is created
        setTimeout(() => {
          const newPlaylistElement = document.querySelector(
            `.playlist`
          );
          if (newPlaylistElement) {
            newPlaylistElement.classList.add("creating");

            setTimeout(() => {
              newPlaylistElement.classList.remove("creating");
            }, 300);
          }
        }, 130); 
      }
    }

    handleDialogClose();
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

    if (!document.startViewTransition) {
      updateActivePlaylist(newActivePlaylist, playlist);
      return;
    }

    document.startViewTransition(() => {
      updateActivePlaylist(newActivePlaylist, playlist);
    });
  };

  const updateActivePlaylist = (newActivePlaylist, playlist) => {
    setActivePlaylist(newActivePlaylist);
    setCurrentPage(0);
    localStorage.setItem("CP", "1");

    if (newActivePlaylist) {
      navigate(
        `?playlist=${newActivePlaylist.name.replace(/\s+/g, "")}&page=1`
      );
      const playlistWithUuid = { ...playlist };
      localStorage.setItem("activePlaylist", JSON.stringify(playlistWithUuid));
    } else {
      navigate(`?page=1`);
      localStorage.removeItem("activePlaylist");
    }
  };

  
const handleDeletePlaylist = (playlist) => {
  setDeletingPlaylistUUID(playlist.uuid);

  if (!document.startViewTransition) {
    setTimeout(() => {
      performDelete(playlist);
    }, 300); 
    return;
  }

  document.startViewTransition(() => {
    setTimeout(() => {
      performDelete(playlist);
    }, 300);
  });
};

const performDelete = async (playlist) => {
  const callback = () => {
    if (playlist.name === activePlaylist?.name) {
      localStorage.removeItem("activePlaylist");
      setActivePlaylist(null);
    }
  };

  await deletePlaylist(playlist.uuid, callback, triggerRefreshHandler);
  setDeletingPlaylistUUID(null);
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
      visibility: playlist.visibility,
    });
    setShowDialog(true);
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

  const filteredPlaylists = playlists
    .filter((playlist) => {
      const isOwnPlaylist = playlist.created_by === currentUser?.name;
      const isLikedPlaylist = playlist.liked_by?.includes(currentUser?.name);
      return (
        (isOwnPlaylist || isLikedPlaylist) &&
        playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })



    const handleUnlikePlaylist = (e,playlist) => {
      e.stopPropagation();
      setDeletingPlaylistUUID(playlist.uuid);

      if (!document.startViewTransition) {
        setTimeout(() => {
          performUnlike(playlist);
        }, 300);
        return;
      }

      document.startViewTransition(() => {
        setTimeout(() => {
          performUnlike(playlist);
        }, 300);
      });
      const performUnlike = async (playlist) => {
        if (playlist.name === activePlaylist?.name) {
          localStorage.removeItem("activePlaylist");
          setActivePlaylist(null);
        }
        unlikePlaylist(
          playlist.uuid,
          extractUUIDPrefix(currentUser.uuid),
          triggerRefreshHandler
        );
        setDeletingPlaylistUUID(null);
      };
    };

   const handleDialogClose = () => {
     const dialog = document.querySelector(".modal");
     dialog.classList.add("closing");
     dialog.addEventListener(
       "animationend",
       () => {
         dialog.classList.remove("closing");
         setShowDialog(false);
       },
       { once: true }
     );
   };


  const cancelHandler = () => {
    handleDialogClose();
    setEditingPlaylist(null);
    setValuesWrapper(initialPlaylistValues);
  };

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
            name="input"
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
                } ${deletingPlaylistUUID === playlist.uuid ? "deleting" : ""}`}>
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
                  {playlist.liked_by?.includes(currentUser?.name) && (
                    <div className="action-btns">
                      <i
                        title="Unlike this playlist"
                        className="fa-solid fa-heart liked-indicator"
                        onClick={(e) => handleUnlikePlaylist(e, playlist)}></i>
                    </div>
                  )}
                  {playlist.name !== "Liked Songs" &&
                    playlist?.created_by === currentUser?.name && (
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
                {editingPlaylist ? "Edit Details" : "Create New Playlist"}
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

                <label htmlFor="visibility">Visibility:</label>
                <select
                  id="visibility"
                  name="visibility"
                  value={newPlaylist.visibility}
                  onChange={changeHandler}
                  style={{ marginBottom: "1rem" }}>
                  <option disabled value="default">
                    --- Choose playlist visibility- --
                  </option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>

                <div className="dialog-actions">
                  <button type="submit">
                    {editingPlaylist ? "Save Changes" : "Create"}
                  </button>
                  <button type="button" onClick={cancelHandler}>
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
          actionType="Deletion"
          action="delete"
          itemType="playlist"
          itemName={playlistToDelete.name}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
}
