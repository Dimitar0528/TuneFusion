import "./styles/MusicPlayer.css";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import PlayerControls from "./SubComponents/PlayerControls";
import SongDetails from "./SubComponents/SongDetails";
import ProgressArea from "./SubComponents/ProgressArea";
import { useNavigate } from "react-router-dom";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import showToast from "../../utils/showToast";
export default function MusicPlayer({
  userRole,
  userUUID,
  excludeElementsWhenInPiPModeFlag = false,
  applyStylesWhenInPiPModeFlag = false,
}) {
  const {
    currentSong,
    isPlaying,
    isCollapsed,
    handleCollapseToggle,
    handleKeyPressWhenTabbed,
  } = useMusicPlayer();
  const [pipWindow, setPiPWindow] = useState(documentPictureInPicture.window);

  const navigate = useNavigate();

  const desiredUrls = [`/musicplayer/${userUUID}`];
  const handleCollapseAndWarn = () => {
    if (desiredUrls.every((url) => url !== location.pathname)) {
      return showToast(
        "To view the expanded music player, please enter the My Music section!",
        "warning"
      );
    } else {
      handleCollapseToggle();
    }
  };

  return (
    <div
      className={`wrapper ${isCollapsed && "collapsed"} ${
        pipWindow &&
        applyStylesWhenInPiPModeFlag === true &&
        "picture-in-picture"
      }`}>
      <div className="top-section">
        {userRole === "admin" && (
          <i id="edit"
            className="fa-solid fa-pen-to-square"
            title="Edit Song"
            onClick={() => {
              navigate(`/updatesong/${currentSong.name}`);
            }}
            tabIndex={0}
            onKeyDown={(event) =>
              handleKeyPressWhenTabbed(event, () =>
                navigate(`/updatesong/${currentSong.name}`)
              )
            }></i>
        )}
        <h2>{isPlaying ? "Playing" : "TuneFusion"}</h2>
        <i
          className={`fa-solid ${
            !isCollapsed ? " fa-arrow-down" : " fa-arrow-up"
          }`}
          onClick={() => {
            isCollapsed ? handleCollapseAndWarn() : handleCollapseToggle();
          }}
          title={`${!isCollapsed ? "Collapse Player" : "Expand Player"}`}
          tabIndex={0}
          onKeyDown={(e) =>
            handleKeyPressWhenTabbed(e, handleCollapseAndWarn)
          }></i>
      </div>

      <SongDetails />

      {excludeElementsWhenInPiPModeFlag !== true && <ProgressArea />}

      <PlayerControls
        excludeElementsWhenInPiPModeFlag={excludeElementsWhenInPiPModeFlag}
        pipWindow={pipWindow}
        setPiPWindow={setPiPWindow}
      />
    </div>
  );
}
