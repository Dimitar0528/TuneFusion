import React from "react";

export default function SongDetails({
  isLoading,
  lyrics,
  songRef,
  nameRef,
  imageRef,
  songs,
  musicIndex,
}) {
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
