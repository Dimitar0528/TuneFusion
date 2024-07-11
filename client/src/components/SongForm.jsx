import React, { useState, useEffect } from "react";
import styles from "../styles/songForm.module.css"; // Import CSS module
import { useParams } from "react-router-dom";
import showToast from "../showToast";

export default function SongForm({ action }) {
  const { name } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    artist: "",
    img_src: "",
    audio_src: "",
    duration: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (action === "updatesong") {
      async function getSong() {
        const response = await fetch(
          `http://localhost:3000/api/songs/${name}`,
          {
            method: "GET",
          }
        );
        const song = await response.json();
        setFormData({
          name: song.name || "",
          artist: song.artist || "",
          img_src: song.img_src || "",
          audio_src: song.audio_src || "",
          duration: song.duration || "",
        });
      }
      getSong();
    }
  }, [action, name]);

  const validateForm = () => {
    const { name, artist, img_src, audio_src, duration } = formData;
    const newErrors = {};

    if (!name) newErrors.name = "Name is required";
    if (!artist) newErrors.artist = "Artist is required";
    if (!img_src) newErrors.img_src = "Image URL is required";
    if (!audio_src) newErrors.audio_src = "Audio URL is required";

    if (!duration || isNaN(duration) || duration <= 0) {
      newErrors.duration = "Valid duration in seconds is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const url =
          action === "updatesong"
            ? `http://localhost:3000/api/songs/updateSong/${name}`
            : "http://localhost:3000/api/songs/addsong";
        const method = action === "updatesong" ? "PUT" : "POST";

        await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        showToast(
          `Song ${action === "updatesong" ? "updated" : "added"} successfully!`,
          "success",
          1500,
          true
        );
        setErrors({});
      } catch (error) {
        console.error(
          `Error ${action === "updatesong" ? "updating" : "adding"} song:`,
          error
        );
        showToast(
          `Failed to ${action === "updatesong" ? "update" : "add"} song`,
          "error"
        );
      }
    }
  };

  return (
    <>
      <h1 className={styles.h1}>
        {action === "updatesong" ? "Update song" : "Add a new song"}
      </h1>
      <form className={styles.songForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Song Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Lose Yourself"
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>
        <div className={styles.formGroup}>
          <label>Artist:</label>
          <input
            type="text"
            name="artist"
            value={formData.artist}
            onChange={handleInputChange}
            placeholder="Eminem"
          />
          {errors.artist && (
            <span className={styles.error}>{errors.artist}</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label>Image URL:</label>
          <input
            type="text"
            name="img_src"
            value={formData.img_src}
            onChange={handleInputChange}
            placeholder="https://upload.wikimedia.org/wikipedia/en/d/d6/Lose_Yourself.jpg"
          />
          {errors.img_src && (
            <span className={styles.error}>{errors.img_src}</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label>Audio URL:</label>
          <input
            type="text"
            name="audio_src"
            value={formData.audio_src}
            onChange={handleInputChange}
            placeholder="https://www.youtube.com/watch?v=zlJ0Aj9y67c"
          />
          {errors.audio_src && (
            <span className={styles.error}>{errors.audio_src}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Duration (in seconds):</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="321"
          />
          {errors.duration && (
            <span className={styles.error}>{errors.duration}</span>
          )}
        </div>

        <button className={styles.submitButton} type="submit">
          {action === "updatesong" ? "Update" : "Add"} Song
        </button>
      </form>
    </>
  );
}
