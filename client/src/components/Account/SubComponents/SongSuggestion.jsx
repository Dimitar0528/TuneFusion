import { useState } from "react";
import showToast from "../../../utils/showToast";
import Table from "../TableLayout";
import styles from "../styles/Account.module.css";
import "../styles/table.css";
import { formatTime } from "../../../utils/formatTime";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  useCreateSong,
  useGetSongSuggestions,
} from "../../../hooks/CRUD-hooks/useSongs";

export default function SongSuggestion({ triggerRefreshHandler }) {
  const createSong = useCreateSong();
  const [query, setQuery] = useState("");
  const [songs, loading, fetchSuggestedSongs] = useGetSongSuggestions();
  const songsPerPage = 20;

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (query.trim() === "") {
      showToast("Query cannot be empty", "error");
      return;
    }
    fetchSuggestedSongs(query);
  };

  const handleAddToDB = async (song) => {
    const callback = (result) => {
      showToast(result.message, "success");
      triggerRefreshHandler();
    };
    await createSong(song, callback);
  };

  return (
    <div className={styles.songsContainer}>
      <div className={styles.description}>
        <h2>Song Suggestions</h2>
        <p>
          Use this feature to search for songs by artist or genre. Enter the
          artist&apos;s name or the genre and click &quot;Search&quot; to find
          songs. You can then add any song from the search results to the
          TuneFusion database.
        </p>
      </div>
      <form
        style={{
          display: "flex",
          justifyContent: "center",
          marginBlock: "4rem",
        }}
        onSubmit={handleFormSubmit}>
        <input
          type="search"
          className={styles["artist-input"]}
          value={query}
          onChange={handleInputChange}
          placeholder="Enter artist name or genre"
          required
        />
        <button
          style={{
            pointerEvents: loading ? "none" : "auto",
            cursor: loading ? "auto" : "pointer",
          }}
          className="addbtn btn6"
          type="submit"
          disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {loading ? (
        <div style={{ marginTop: "2rem" }}>
          <table className="rwd-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Artist</th>
                <th>Audio Source</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(songsPerPage)].map((_, index) => (
                <tr key={index}>
                  <td>
                    <Skeleton height={40} width={40} />
                  </td>
                  <td>
                    <Skeleton height={20} width={150} />
                  </td>
                  <td>
                    <Skeleton height={20} width={100} />
                  </td>
                  <td>
                    <Skeleton height={20} width={200} />
                  </td>
                  <td>
                    <Skeleton height={20} width={100} />
                  </td>
                  <td>
                    <Skeleton height={30} width={120} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        songs.length > 0 && (
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
            renderRow={(song) => (
              <tr key={song.audio_src}>
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
        )
      )}
    </div>
  );
}
