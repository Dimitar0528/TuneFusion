import { useEffect, useRef } from "react";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SongDetails() {
  let { islyricsLoading, lyrics, currentSong } = useMusicPlayer();
  const nameRef = useRef();
  const checkIfTextOverflowing = () => {
    const nameElement = nameRef.current;
    const isOverflowing = nameElement.scrollWidth > nameElement.clientWidth;

    isOverflowing
      ? nameElement.classList.add("animate")
      : nameElement.classList.remove("animate");
  };
  useEffect(() => {
    checkIfTextOverflowing();
    window.addEventListener("resize", checkIfTextOverflowing);
    return () => window.removeEventListener("resize", checkIfTextOverflowing);
  }, [currentSong?.name]);

  return (
    <>
      <div className="img-area text-center">
        {islyricsLoading ? (
          <Skeleton borderRadius={"1rem"} height={405} />
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
        <p className="name" ref={nameRef}>
          <span>{currentSong?.name}</span>
        </p>
        <p className="artist">{currentSong?.artist}</p>
      </div>
    </>
  );
}
