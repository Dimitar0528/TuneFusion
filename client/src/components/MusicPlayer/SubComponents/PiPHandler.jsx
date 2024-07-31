import React, { useState, useCallback, useEffect, useRef } from "react";
import { PiPContainer } from "./PiPContainer";
import MusicPlayer from "../MusicPlayer";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
export const PiPHandler = () => {
  const { user } = useMusicPlayer();
  const { userUUID, role } = user;
  const [pipWindow, setPiPWindow] = useState(documentPictureInPicture.window);

  const handleClick = useCallback(async () => {
    if (pipWindow) {
      pipWindow.close();
    } else {
      const newWindow = await documentPictureInPicture.requestWindow();
      setPiPWindow(newWindow);

      [...document.styleSheets].forEach((styleSheet) => {
        try {
          const cssRules = [...styleSheet.cssRules]
            .map((rule) => rule.cssText)
            .join("");
          const style = document.createElement("style");

          style.textContent = cssRules;
          newWindow.document.head.appendChild(style);
        } catch (e) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.type = styleSheet.type;
          link.media = styleSheet.media;
          link.href = styleSheet.href;
          newWindow.document.head.appendChild(link);
        }
      });
    }
  }, [pipWindow]);

  useEffect(() => {
    const handleWindowClose = () => {
      setPiPWindow(null);
    };

    pipWindow?.addEventListener("pagehide", handleWindowClose);

    return () => {
      pipWindow?.removeEventListener("pagehide", handleWindowClose);
    };
  }, [pipWindow]);

  return (
    <>
      <button
        className="pip-btn"
        onClick={handleClick}
        title={pipWindow ? "Close PiP Window" : "Open PiP Window"}>
        <i className="fa-solid">
          {pipWindow ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={22}
              height={22}
              viewBox="0 0 23 23"
              stroke="currentColor"
              strokeWidth={0.4}>
              <path
                fill="currentColor"
                d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1zm-1 2h-6v4h6zm-8.5-8L9.457 9.043l2.25 2.25l-1.414 1.414l-2.25-2.25L6 12.5V7z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={22}
              height={22}
              viewBox="0 0 23 23">
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}>
                <path d="M8 4.5v5H3m-1-6l6 6m13 0v-3c0-1.16-.84-2-2-2h-7m-9 9v2c0 1.05.95 2 2 2h3"></path>
                <rect width={10} height={7} x={12} y={13.5} ry={2}></rect>
              </g>
            </svg>
          )}
        </i>
      </button>
      <PiPContainer pipWindow={pipWindow}>
        <MusicPlayer
          userUUID={userUUID}
          userRole={role}
          excludeElementWhenInPiPMode={true}
        />
      </PiPContainer>
    </>
  );
};
