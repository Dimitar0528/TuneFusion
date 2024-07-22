import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./styles/SearchSong.module.css";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import MusicList from "../../MyMusic/SubComponents/MusicList";

export default function SearchSong() {
  const {
    songs,
    musicListRef,
    setFilteredSongs,
    playlists,
    setCurrentPage,
    setActivePlaylist,
    refreshPlaylistHandler,
  } = useMusicPlayer();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q");
  const [searchSongs, setSearchSongs] = useState([]);

  useEffect(() => {
    if (searchTerm) {
      let filteredSongs;
      searchTerm === "All-Songs"
        ? (filteredSongs = songs)
        : (filteredSongs = songs.filter(
            (song) =>
              song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
              song.name.toLowerCase().includes(searchTerm?.toLowerCase())
          ));
      setSearchSongs(filteredSongs);
      setFilteredSongs(filteredSongs);
      localStorage.removeItem("activePlaylist");
      setActivePlaylist(null);
    }
    return () => {
      setFilteredSongs(songs.slice(0, 20));
      setCurrentPage(0);
    };
  }, [searchTerm, songs, setFilteredSongs, setActivePlaylist, setCurrentPage]);

  return (
    <div className={styles.searchContainer}>
      <h1>Search Results for &quot;{searchTerm}&quot;</h1>
      {searchSongs.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <MusicList
          songs={searchSongs}
          title={`Search results for ${searchTerm}:  [Total Songs found: ${searchSongs.length} ]`}
          musicListRef={musicListRef}
          playlists={playlists}
          refreshPlaylist={refreshPlaylistHandler}
          styles={{ width: "95%", marginInline: "auto", maxHeight: "100vh" }}
        />
      )}
    </div>
  );
}
