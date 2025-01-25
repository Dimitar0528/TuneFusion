import { useEffect } from "react";
import { createPortal } from "react-dom";

export const PiPContainer = ({ pipWindow, children }) => {
  useEffect(() => {
    if (pipWindow) {
      const pipBody = pipWindow.document.body;

      // Apply the background color
      const computedStyles = getComputedStyle(document.documentElement);
      const bgColor = "hsl(339, 100%, 73%)";
      pipBody.style.background = bgColor.trim();
    }
  }, [pipWindow]);

  return pipWindow ? createPortal(children, pipWindow.document.body) : null;
};
