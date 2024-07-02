import React, { useRef, useState } from "react";

import "../styles/songForm.css";
import { useParams } from "react-router-dom";
import showToast from "../showToast";
export default function SongForm({ action }) {
  const { name } = useParams();

  const nameRef = useRef();
  const artistRef = useRef();
  const imageUrlRef = useRef();
  const audioSrcRef = useRef();
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const name = nameRef.current.value;
    const artist = artistRef.current.value;
    const imageUrl = imageUrlRef.current.value;
    const audioSrc = audioSrcRef.current.value;
    const newErrors = {};

    if (!name) newErrors.name = "Name is required";
    if (!artist) newErrors.artist = "Artist is required";
    if (!imageUrl) {
      newErrors.imageUrl = "Image URL is required";
    }
    // else if (
    //   !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(imageUrl)
    // ) {
    //   newErrors.imageUrl = "Invalid image URL format";
    // }
    if (!audioSrc) {
      newErrors.audioSrc = "Audio URL is required";
    } else {
      const supportedWebsites = ["youtube.com", "soundcloud.com", "twitch.tv"];

      const isSupported = supportedWebsites.some((website) =>
        audioSrc.includes(website)
      );
      if (!isSupported) {
        newErrors.audioSrc =
          "The provided url is not supported for our audio system";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  if (action === "updatesong") {
    async function getSong() {
      const response = await fetch(`http://localhost:3000/api/songs/${name}`, {
        method: "GET",
      });
      const song = await response.json();
      console.log(song);
      if (nameRef.current) nameRef.current.value = song.name;
      if (artistRef.current) artistRef.current.value = song.artist;
      if (imageUrlRef.current) imageUrlRef.current.value = song.img_src;
      if (audioSrcRef.current) audioSrcRef.current.value = song.audio_src;
    }
    getSong();
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formData = {
        name: nameRef.current.value.trim(),
        artist: artistRef.current.value.trim(),
        img_src: imageUrlRef.current.value.trim(),
        audio_src: audioSrcRef.current.value.trim(),
      };
      if (action === "updatesong") {
        try {
          await fetch(`http://localhost:3000/api/songs/updateSong/${name}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          showToast(`Song updated successfully!`, "success");
          setTimeout(() => {
            location.href = "/";
          }, 2500);

          setErrors({});
        } catch (error) {
          console.error("Error updating song:", error);
          showToast("Failed to update song", "error");
        }
      } else {
        try {
          await fetch("http://localhost:3000/api/songs/addsong", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          showToast(`Song added successfully!`, "success");
          setTimeout(() => {
            location.href = "/";
          }, 2500);

          setErrors({});
        } catch (error) {
          console.error("Error adding song:", error);
          showToast("Failed to add song", "error");
        }
      }
    }
  };

  return (
    <>
      <h1 className="h1">
        {action === "updatesong" ? "Update song" : "Add a new song"}
      </h1>
      <form className="song-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Song Name:</label>
          <input type="text" name="name" ref={nameRef} />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>Artist:</label>
          <input type="text" name="artist" ref={artistRef} />
          {errors.artist && <span className="error">{errors.artist}</span>}
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input type="text" name="imageUrl" ref={imageUrlRef} />
          {errors.imageUrl && <span className="error">{errors.imageUrl}</span>}
        </div>
        <div className="form-group">
          <label>Audio URL:</label>
          <input type="text" name="audioSrc" ref={audioSrcRef} />
          {errors.audioSrc && <span className="error">{errors.audioSrc}</span>}
        </div>
        <button className="submit-button" type="submit">
          {action === "updatesong" ? "Update" : "Add"} Song
        </button>
      </form>
    </>
  );
}
