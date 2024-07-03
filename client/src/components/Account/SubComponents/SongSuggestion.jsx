// SongSuggestion.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import showToast from "../../../showToast";
import Table from "../Table";
import "../styles/Account.css";
export default function SongSuggestion() {
  const [artist, setArtist] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const songsPerPage = 8;

  const handleInputChange = (e) => {
    setArtist(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSongs([]);
    try {
      const response = await fetch(
        `http://localhost:3000/api/song/search/${artist}`
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
      setLoading(false);
    }
  };

  const handleAddToDB = async (song) => {
    try {
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
      }
    } catch (error) {
      showToast(`Error: ${error.message}`, "error");
    }
  };

  return (
    <div className="songs-container">
      <div className="description">
        <h2>Song Suggestions</h2>
        <p>
          Use this feature to search for songs by artist. Enter the artist's
          name and click "Search" to find songs. You can then add any song from
          the search results to the TuneFusion database.
        </p>
      </div>
      <form
        style={{ display: "flex", justifyContent: "center" }}
        onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="artist-input"
          value={artist}
          onChange={handleInputChange}
          placeholder="Enter artist name"
          required
        />
        <button className="addbtn | btn6" type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {loading && (
        <i
          style={{ fontSize: "10rem" }}
          className="fa-solid fa-spinner fa-spin"></i>
      )}
      {songs.length > 0 && (
        <Table
          data={songs}
          hasDbSearch={false}
          columns={["Image", "Title", "Audio Source", "Actions"]}
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
              <td data-th="Audio Source">{song.audio_src}</td>
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
