import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import styles from "./styles/ArtistDescription.module.css";

export default function ArtistDescription() {
  const { artistName } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [artist, setArtist] = useState([]);

  useEffect(() => {
    async function getArtistDescription() {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/songs/artist/${artistName}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      setArtist(data);
      setIsLoading(false);
    }
    getArtistDescription();
  }, [artistName]);
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Description for {artistName}</h1>
      <LoadingSpinner isLoading={isLoading} />
      {!isLoading && (
        <div className="artist-description">
          {artist?.thumbnails?.length > 0 && (
            <img
              className={styles.image}
              src={artist.thumbnails[0].url}
              alt=""
            />
          )}
          <p className={styles.description}>{artist.description}</p>
          {artist.albums?.map((album) => (
            <div key={album.albumId} className={styles.album}>
              <img width={40} height={40} src={album.thumbnailUrl} alt="" />
              <div>
                <p>Album title {album.title}</p>
                <p>Release Date {album.year}</p>
              </div>
            </div>
          ))}

          {artist.singles?.map((single) => (
            <div key={single.albumId} className={styles.single}>
              <img width={40} height={40} src={single.thumbnailUrl} alt="" />
              <div>
                <p>Single title {single.title}</p>
                <p>Release Date {single.year}</p>
              </div>
            </div>
          ))}

          {artist.suggestedArtists?.map((suggestedArtist) => (
            <div
              key={suggestedArtist.artistId}
              className={styles["suggested-artist"]}>
              <img
                width={40}
                height={40}
                src={suggestedArtist.thumbnailUrl}
                alt=""
              />
              <div>
                <p>
                  Artist Name{" "}
                  <Link to={`/artist/${suggestedArtist.name}/description`}>
                    {suggestedArtist.name}
                  </Link>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
