import React from "react";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
export default function SongDetails() {
  const { isLoading, lyrics, songRef, nameRef, imageRef, songs, musicIndex } =
    useMusicPlayer();
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
            ref={imageRef}
            className="image"
            src={songs[musicIndex]?.img_src}
            alt="Song Cover Art"
            width={440}
          />
        )}
      </div>
      <div className="song-details text-center">
        <p className="name" ref={songRef}></p>
        <p className="artist" ref={nameRef}></p>
      </div>
    </>
  );
}
