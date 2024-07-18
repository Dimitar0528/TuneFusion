import React, { useState } from "react";
import showToast from "../../../utils/showToast";
import Table from "../TableLayout";
import styles from "../styles/Account.module.css"; // Import the CSS module
import "../styles/table.css";
import { formatTime } from "../../../utils/formatTime";
export default function SongSuggestion() {
  const [artist, setArtist] = useState("");
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const songsPerPage = 10;

  const handleInputChange = (e) => {
    setArtist(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSongs([]);
    try {
      const response = await fetch(
        `http://localhost:3000/api/songs/search/${artist}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        showToast(`Error: ${errorData.error}`, "error");
      } else {
        const data = await response.json();
        setSongs(data);
      }
    } catch (error) {
      showToast(`Error: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToDB = async (song) => {
    try {
      setIsLoading(true);
      setSongs([]);
      const response = await fetch("http://localhost:3000/api/songs/addsong", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(song),
      });
      if (!response.ok) {
        const errorData = await response.json();
        showToast(`Error: ${errorData.error}`, "error");
      } else {
        const responseData = await response.json();
        showToast(responseData.message, "success", 1500, true);
        setIsLoading(false);
      }
    } catch (error) {
      showToast(`Error: ${error.message}`, "error");
    }
  };

  return (
    <div className={styles.songsContainer}>
      <div className={styles.description}>
        <h2>Song Suggestions</h2>
        <p>
          Use this feature to search for songs by artist or genre. Enter the
          artist's name or the genre and click "Search" to find songs. You can
          then add any song from the search results to the TuneFusion database.
        </p>
      </div>
      <form
        style={{ display: "flex", justifyContent: "center" }}
        onSubmit={handleFormSubmit}>
        <input
          type="search"
          className={styles["artist-input"]}
          value={artist}
          onChange={handleInputChange}
          placeholder="Enter artist name"
          required
        />
        <button className="addbtn btn6" type="submit" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>
      {isLoading && (
        <i
          style={{ fontSize: "11rem", color: "white", marginBlock: "1rem" }}
          className="fas fa-spinner fa-spin"></i>
      )}
      {songs.length > 0 && (
        <Table
          data={songs}
          hasDbSearch={false}
          columns={[
            "Image",
            "Title",
            "Artist",
            "Audio Source",
            "Duration",
            "Actions",
          ]}
          itemsPerPage={songsPerPage}
          renderRow={(song) => (
            <tr key={song.uuid}>
              <td data-th="Image">
                <img
                  src={song.img_src}
                  alt={`${song.artist} cover`}
                  className="song-image"
                />
              </td>
              <td data-th="Title">{song.name}</td>
              <td data-th="Artist">{song.artist}</td>
              <td data-th="Audio Source">{song.audio_src}</td>
              <td data-th="Duration">{formatTime(song.duration)}</td>
              <td data-th="Actions">
                <div className="cta-admin-buttons">
                  <button onClick={() => handleAddToDB(song)}>
                    Add to database
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      )}
    </div>
  );
}
