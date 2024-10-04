import { useMusicPlayer } from "../../../contexts/MusicPlayerContext";
import styles from "../styles/LandingPage.module.css";

import { Link } from "react-router-dom";
export default function GenreCard({ imageUrl, genreName, userUUID }) {
  const { activePlaylist, currentPage } = useMusicPlayer();

  return (
    <div className={styles["genre__card"]}>
      <div className={styles["genre__image"]}>
        <img src={imageUrl} alt="genre" />
        <div className={styles["genre__link"]}>
          <Link
            className={styles.link}
            to={
              userUUID
                ? activePlaylist
                  ? `/musicplayer/${userUUID}?playlist=${activePlaylist?.name.replace(
                      /\s+/g,
                      ""
                    )}&page=${currentPage + 1}`
                  : `/musicplayer/${userUUID}?page=${currentPage + 1}`
                : "/sign-in"
            }>
            <i className="fas fa-arrow-up-right-from-square"></i>
          </Link>
        </div>
      </div>
      <h4>{genreName}</h4>
    </div>
  );
}
