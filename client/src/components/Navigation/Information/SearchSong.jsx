import { useEffect, useState, Suspense, lazy } from "react";
import { useSearchParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./styles/SearchSong.module.css";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";

const MusicList = lazy(() => import("../../MyMusic/SubComponents/MusicList"));

export default function SearchSong() {
  const {
    songs,
    setFilteredSongs,
    playlists,
    setCurrentPage,
    setActivePlaylist,
    activePlaylist,
    triggerRefreshHandler,
  } = useMusicPlayer();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q");
  const [searchSongs, setSearchSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (searchTerm) {
      let filteredSongs;
      if (searchTerm === "All-Songs") {
        filteredSongs = songs;
      } else {
        filteredSongs = songs.filter(
          (song) =>
            song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setSearchSongs(filteredSongs);
      setFilteredSongs(filteredSongs);
      setLoading(false);
    } else {
      setLoading(false);
    }

    return () => {
      activePlaylist
        ? setFilteredSongs(activePlaylist.Songs)
        : setFilteredSongs(songs.slice(0, 20));
      setCurrentPage(0);
    };
  }, [searchTerm, songs, setFilteredSongs, setActivePlaylist, setCurrentPage]);

  return (
    <div className={styles.searchContainer}>
      <h1>Search Results for &quot;{searchTerm}&quot;</h1>
      {
        <Suspense
          fallback={
            <div
              style={{
                width: "95%",
                marginInline: "auto",
                maxHeight: "100vh",
              }}>
              <Skeleton height={800} count={1} />
            </div>
          }>
          <MusicList
            songs={searchSongs}
            title={`Search results for ${searchTerm}:  [Total Songs found: ${searchSongs.length} ]`}
            playlists={playlists}
            triggerRefresh={triggerRefreshHandler}
            styles={{ width: "95%", marginInline: "auto", maxHeight: "100vh" }}
          />
        </Suspense>
      }
    </div>
  );
}
