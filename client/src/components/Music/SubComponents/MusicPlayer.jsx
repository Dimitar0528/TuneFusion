import React, { useEffect } from "react";
import "./styles/MusicPlayer.css";
import "react-toastify/dist/ReactToastify.css";
import PlayerControls from "./PlayerControls";
import SongDetails from "./SongDetails";
import ProgressArea from "./ProgressArea";
import { useNavigate } from "react-router-dom";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import showToast from "../../../showToast";
import extractUUIDPrefix from "../../../utils/extractUUIDPrefix";

export default function MusicPlayer({ showList, userRole, userUUID }) {
  const {
    songs,
    currentSongUUID,
    isPlaying,
    isCollapsed,
    loadMusic,
    handleCollapseToggle,
  } = useMusicPlayer();

  const navigate = useNavigate();

  useEffect(() => {
    if (songs.length > 0) {
      loadMusic(currentSongUUID);
    }
  }, [songs, currentSongUUID]);

  const handleKeyPress = (event, action) => {
    if (event.key === "Enter") {
      action();
    }
  };

  const desiredUrls = [`/musicplayer/${userUUID}`];
  const handleCollapseAndWarn = () => {
    if (desiredUrls.every((url) => url !== location.pathname)) {
      return showToast(
        "To view the full version of the music player, please enter the Music Player section!",
        "warning"
      );
    } else {
      handleCollapseToggle();
    }
  };

  return (
    <div className={`wrapper ${isCollapsed && "collapsed"}`}>
      <div className="top-section">
        {userRole === "admin" && (
          <i
            className="fa-solid fa-pen-to-square"
            title="Update Song"
            onClick={() => {
              navigate(
                `/updatesong/${
                  songs.find(
                    (song) => extractUUIDPrefix(song.uuid) === currentSongUUID
                  ).name
                }`
              );
            }}
            tabIndex={0}
            onKeyDown={(event) =>
              handleKeyPress(event, () =>
                navigate(
                  `/updatesong/${
                    songs.find(
                      (song) => extractUUIDPrefix(song.uuid) === currentSongUUID
                    ).name
                  }`
                )
              )
            }></i>
        )}
        <h2>{isPlaying ? "Now Playing" : "TuneFusion"}</h2>
        <i
          className={`fa-solid ${
            !isCollapsed ? " fa-arrow-down" : " fa-arrow-up"
          }`}
          onClick={() => {
            isCollapsed === true
              ? handleCollapseAndWarn()
              : handleCollapseToggle();
          }}
          title={`${!isCollapsed ? "Collapse" : "Full View"}`}
          tabIndex={0}
          onKeyDown={(event) =>
            handleKeyPress(event, handleCollapseAndWarn)
          }></i>
      </div>

      <SongDetails />

      {songs.length > 0 && <ProgressArea />}

      <PlayerControls showList={showList} />
    </div>
  );
}
