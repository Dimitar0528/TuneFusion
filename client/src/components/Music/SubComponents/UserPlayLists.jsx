import React, { useState } from "react";
import "./styles/UserPlayLists.css";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";

export default function UserPlayLists() {
  const { setActivePlaylist, playlists } = useMusicPlayer();
  const [activeIndex, setActiveIndex] = useState(() => {
    const storedActivePlaylist = JSON.parse(
      localStorage.getItem("activePlaylist")
    );
    return storedActivePlaylist.activeIndex;
  });

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

  return (
    <div className="accordion">
      {playlists.map((playlist, index) => (
        <div key={index} className="accordion-item">
          <div
            className={`accordion-title ${activeIndex === index && "active"}`}
            onClick={() => toggleActivePlayList(index, playlist)}>
            <h3>{playlist.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
