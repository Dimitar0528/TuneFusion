import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./styles/SearchSong.module.css";
import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import MusicList from "../../myMusic/subComponents/MusicList";

export default function SearchSong() {
  const {
    songs,
    musicListRef,
    setFilteredSongs,
    playlists,
    setCurrentPage,
    setActivePlaylist,
  } = useMusicPlayer();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q");
  const [searchSongs, setSearchSongs] = useState([]);

  useEffect(() => {
    if (searchTerm) {
      let filteredSongs;
      searchTerm === "All_Songs"
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
  }, [searchTerm, songs, setFilteredSongs]);

  return (
    <div className={styles.searchContainer}>
      <h1>Search Results for "{searchTerm}"</h1>
      {searchSongs.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <MusicList
          songs={searchSongs}
          title={`Search results for ${searchTerm}`}
          musicListRef={musicListRef}
          playlists={playlists}
        />
      )}
    </div>
  );
}
