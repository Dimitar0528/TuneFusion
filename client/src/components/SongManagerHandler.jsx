import { useEffect } from "react";
import styles from "../styles/SongManagerHandler.module.css";
import { useParams } from "react-router-dom";
import showToast from "../utils/showToast";
import {
  useCreateSong,
  useGetSong,
  useUpdateSong,
  validateSongData,
} from "../hooks/CRUD-hooks/useSongs";
import { useForm } from "../hooks/useForm";
const initialFormData = {
  name: "",
  artist: "",
  img_src: "",
  audio_src: "",
  duration: "",
};

export default function SongManagerHandler({ action }) {
  const { name } = useParams();
  const [song, fetchSong] = useGetSong(name);
  useEffect(() => {
    fetchSong();
  }, []);
  const onSubmit = async (values) => {
    const updateSong = useUpdateSong();
    const createSong = useCreateSong();
    if (action === "updatesong") {
      await updateSong(name, values);
    } else {
      const callback = (result) => {
        showToast(result.message, "success", 1500, true);
      };
      await createSong(values, callback);
    }
  };

  const { values, errors, changeHandler, submitHandler, setValuesWrapper } =
    useForm(initialFormData, onSubmit, validateSongData);

  useEffect(() => {
    if (action === "updatesong" && song) {
      setValuesWrapper({
        name: song.name || "",
        artist: song.artist || "",
        img_src: song.img_src || "",
        audio_src: song.audio_src || "",
        duration: song.duration || "",
      });
    }
  }, [action, song]);

  return (
    <>
      <h1 className={styles.h1}>
        {action === "updatesong" ? "Edit song" : "Add a new song"}
      </h1>
      <form className={styles.songForm} onSubmit={submitHandler}>
        <div className={styles.formGroup}>
          <label>Song Name:</label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={changeHandler}
            placeholder="Lose Yourself"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className={styles.formGroup}>
          <label>Artist:</label>
          <input
            type="text"
            name="artist"
            value={values.artist}
            onChange={changeHandler}
            placeholder="Eminem"
          />
          {errors.artist && <span className="error">{errors.artist}</span>}
        </div>
        <div className={styles.formGroup}>
          <label>Image URL:</label>
          <input
            type="text"
            name="img_src"
            value={values.img_src}
            onChange={changeHandler}
            placeholder="https://upload.wikimedia.org/wikipedia/en/d/d6/Lose_Yourself.jpg"
          />
          {errors.img_src && <span className="error">{errors.img_src}</span>}
        </div>
        <div className={styles.formGroup}>
          <label>Audio URL:</label>
          <input
            type="text"
            name="audio_src"
            value={values.audio_src}
            onChange={changeHandler}
            placeholder="https://www.youtube.com/watch?v=zlJ0Aj9y67c"
          />
          {errors.audio_src && (
            <span className="error">{errors.audio_src}</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label>Duration (in seconds):</label>
          <input
            type="text"
            name="duration"
            value={values.duration}
            onChange={changeHandler}
            placeholder="321"
          />
          {errors.duration && <span className="error">{errors.duration}</span>}
        </div>
        <button className={styles.submitButton} type="submit">
          {action === "updatesong" ? "Update" : "Add"} Song
        </button>
      </form>
    </>
  );
}
