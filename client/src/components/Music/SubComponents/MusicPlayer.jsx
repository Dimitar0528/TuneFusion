import React, { useEffect } from "react";
import "./styles/MusicPlayer.css";
import "react-toastify/dist/ReactToastify.css";
import PlayerControls from "./PlayerControls";
import SongDetails from "./SongDetails";
import ProgressArea from "./ProgressArea";
import { useNavigate } from "react-router-dom";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";

export default function MusicPlayer({ showList, userRole }) {
  const {
    songs,
    musicIndex,
    isPlaying,
    isCollapsed,
    loadMusic,
    handleCollapseToggle,
  } = useMusicPlayer();

  const navigate = useNavigate();

  useEffect(() => {
    if (songs.length > 0) {
      loadMusic(musicIndex);
    }
  }, [songs, musicIndex]);

  const handleKeyPress = (event, action) => {
    if (event.key === "Enter") {
      action();
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
              navigate(`/updatesong/${songs[musicIndex].name}`);
            }}
            tabIndex={0}
            onKeyDown={(event) =>
              handleKeyPress(event, () =>
                navigate(`/updatesong/${songs[musicIndex].name}`)
              )
            }></i>
        )}
        <h2>{isPlaying ? "Now Playing" : "TuneFusion"}</h2>
        <i
          className={`fa-solid ${
            !isCollapsed ? " fa-arrow-down" : " fa-arrow-up"
          }`}
          onClick={handleCollapseToggle}
          title={`${!isCollapsed ? "Collapse" : "Full View"}`}
          tabIndex={0}
          onKeyDown={(event) =>
            handleKeyPress(event, handleCollapseToggle)
          }></i>
      </div>

      <SongDetails />

      {songs.length > 0 && musicIndex >= 0 && <ProgressArea />}

      <PlayerControls showList={showList} />
    </div>
  );
}
