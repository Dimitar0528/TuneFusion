import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export default function SongDetails() {
  let { islyricsLoading, lyrics, currentSong } = useMusicPlayer();
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
        <p className="name">{currentSong?.name}</p>
        <p className="artist">{currentSong?.artist}</p>
      </div>
    </>
  );
}
