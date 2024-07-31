import { createPortal } from "react-dom";

export const PiPContainer = ({ pipWindow, children }) => {
  return pipWindow ? createPortal(children, pipWindow.document.body) : null;
};
