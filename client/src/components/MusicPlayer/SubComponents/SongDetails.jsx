import React from "react";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import LoadingSpinner from "../../LoadingSpinner";
export default function SongDetails() {
  const { islyricsLoading, lyrics, currentSong } = useMusicPlayer();

  return (
    <>
      <div className="img-area text-center">
        {islyricsLoading ? (
          <LoadingSpinner
            isLoading={islyricsLoading}
          />
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
