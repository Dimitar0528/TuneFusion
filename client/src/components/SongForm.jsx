import React, { useRef, useState, useEffect } from "react";
import styles from "../styles/songForm.module.css"; // Import CSS module
import { useParams } from "react-router-dom";
import showToast from "../showToast";

export default function SongForm({ action }) {
  const { name } = useParams();

  const nameRef = useRef();
  const artistRef = useRef();
  const imageUrlRef = useRef();
  const audioSrcRef = useRef();
  const durationRef = useRef();
  const [errors, setErrors] = useState({});
  const [showDurationInput, setShowDurationInput] = useState(false);
  const [audioSrc, setAudioSrc] = useState("");

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
        if (nameRef.current) nameRef.current.value = song.name;
        if (artistRef.current) artistRef.current.value = song.artist;
        if (imageUrlRef.current) imageUrlRef.current.value = song.img_src;
        if (audioSrcRef.current) {
          audioSrcRef.current.value = song.audio_src;
          setAudioSrc(song.audio_src);
          setShowDurationInput(
            song.audio_src && !song.audio_src.includes("youtube.com")
          );
          durationRef.current.value = song.duration;
        }
      }
      getSong();
    }
  }, [action, name]);

  const validateForm = () => {
    const name = nameRef.current.value;
    const artist = artistRef.current.value;
    const imageUrl = imageUrlRef.current.value;
    const newErrors = {};

    if (!name) newErrors.name = "Name is required";
    if (!artist) newErrors.artist = "Artist is required";
    if (!imageUrl) {
      newErrors.imageUrl = "Image URL is required";
    }

    if (!audioSrc) {
      newErrors.audioSrc = "Audio URL is required";
    } else {
      const isYouTube = audioSrc.includes("youtube.com");

      if (!isYouTube) {
        const duration = durationRef.current.value;
        if (!duration || isNaN(duration) || duration <= 0) {
          newErrors.duration = "Valid duration in seconds is required";
        }
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAudioSrcChange = (e) => {
    const url = e.target.value;
    setAudioSrc(url);
    setShowDurationInput(url && !url.includes("youtube.com"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formData = {
        name: nameRef.current.value.trim(),
        artist: artistRef.current.value.trim(),
        img_src: imageUrlRef.current.value.trim(),
        audio_src: audioSrc.trim(),
      };

      if (showDurationInput) {
        formData.duration = parseInt(durationRef.current.value.trim(), 10);
      }

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
          <input type="text" name="name" ref={nameRef} />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>
        <div className={styles.formGroup}>
          <label>Artist:</label>
          <input type="text" name="artist" ref={artistRef} />
          {errors.artist && (
            <span className={styles.error}>{errors.artist}</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label>Image URL:</label>
          <input type="text" name="imageUrl" ref={imageUrlRef} />
          {errors.imageUrl && (
            <span className={styles.error}>{errors.imageUrl}</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label>Audio URL:</label>
          <input
            type="text"
            name="audioSrc"
            ref={audioSrcRef}
            value={audioSrc}
            onChange={handleAudioSrcChange}
          />
          {errors.audioSrc && (
            <span className={styles.error}>{errors.audioSrc}</span>
          )}
        </div>
        {audioSrc && showDurationInput && (
          <div className={styles.formGroup}>
            <label>Duration (in seconds):</label>
            <input type="text" name="duration" ref={durationRef} />
            {errors.duration && (
              <span className={styles.error}>{errors.duration}</span>
            )}
          </div>
        )}
        <button className={styles.submitButton} type="submit">
          {action === "updatesong" ? "Update" : "Add"} Song
        </button>
      </form>
    </>
  );
}
