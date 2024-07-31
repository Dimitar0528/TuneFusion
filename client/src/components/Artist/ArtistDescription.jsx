import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./styles/ArtistDescription.module.css";
import { useGetArtistDescription } from "../../hooks/CRUD-hooks/useSongs";
export default function ArtistDescription() {
  const { artistName } = useParams();
  const [artist, isArtistLoading] = useGetArtistDescription(artistName);
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>
        {isArtistLoading ? <Skeleton width={200} /> : `About ${artistName}`}
      </h1>
      <div className={styles["img-area"]}>
        {isArtistLoading ? (
          <Skeleton height={385} width={930} />
        ) : (
          artist?.thumbnails?.length > 0 && (
            <img
              className={styles.image}
              src={artist.thumbnails[1]?.url}
              alt="Artist"
            />
          )
        )}
      </div>
      <div className={styles.description}>
        {isArtistLoading ? (
          <Skeleton count={4} />
        ) : (
          <p className={styles.description}>{artist.description}</p>
        )}
      </div>

      {artist?.albums?.length > 0 && <h2 className={styles.h2}>Albums</h2>}
      <div className={styles.albumList}>
        {isArtistLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={styles.album}>
                <Skeleton circle={true} height={40} width={40} />
                <div>
                  <Skeleton width={150} />
                  <Skeleton width={100} />
                </div>
              </div>
            ))
          : artist.albums?.map((album) => (
              <div key={album.albumId} className={styles.album}>
                <img
                  width={40}
                  height={40}
                  src={album.thumbnailUrl}
                  alt="Album"
                />
                <div>
                  <p>{album.title}</p>
                  <p>{album.year}</p>
                </div>
              </div>
            ))}
      </div>

      <h2 className={styles.h2}>Singles</h2>
      <div className={styles.singleList}>
        {isArtistLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={styles.single}>
                <Skeleton circle={true} height={40} width={40} />
                <div>
                  <Skeleton width={150} />
                  <Skeleton width={100} />
                </div>
              </div>
            ))
          : artist.singles?.map((single) => (
              <div key={single.albumId} className={styles.single}>
                <img
                  width={40}
                  height={40}
                  src={single.thumbnailUrl}
                  alt="Single"
                />
                <div>
                  <p>{single.title}</p>
                  <p>{single.year}</p>
                </div>
              </div>
            ))}
      </div>

      <h2 className={styles.h2}>Suggested Artists</h2>
      <div className={styles.suggestedArtists}>
        {isArtistLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={styles["suggested-artist"]}>
                <Skeleton circle={true} height={40} width={40} />
                <div>
                  <Skeleton width={150} />
                </div>
              </div>
            ))
          : artist.suggestedArtists?.map((suggestedArtist) => (
              <div
                key={suggestedArtist.artistId}
                className={styles["suggested-artist"]}>
                <img
                  width={40}
                  height={40}
                  src={suggestedArtist.thumbnailUrl}
                  alt="Suggested Artist"
                />
                <div>
                  <p>
                    <Link to={`/artist/${suggestedArtist.name}/description`}>
                      {suggestedArtist.name}
                    </Link>
                  </p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
