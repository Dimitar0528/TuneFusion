import React from "react";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
export default function SongDetails() {
  const { isLoading, lyrics, currentSong } = useMusicPlayer();

  return (
    <>
      <div className="img-area text-center">
        {isLoading ? (
          <div className="loading">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <h2>Loading...</h2>
          </div>
        ) : lyrics ? (
          <div className="lyrics">{lyrics ? <pre>{lyrics}</pre> : null}</div>
        ) : (
          <img
            className="image"
            src={currentSong?.img_src}
            alt="Song Cover Art"
            width={440}
          />
        )}
      </div>
      <div className="song-details text-center">
        <p className="name">{currentSong?.name}</p>
        <p className="artist">{currentSong?.artist}</p>
      </div>
    </>
  );
}
