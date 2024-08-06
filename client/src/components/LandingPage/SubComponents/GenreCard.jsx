import styles from "../styles/LandingPage.module.css";

import { Link } from "react-router-dom";
export default function GenreCard({ imageUrl, genreName, userUUID }) {
  return (
    <div className={styles["genre__card"]}>
      <div className={styles["genre__image"]}>
        <img src={imageUrl} alt="genre" />
        <div className={styles["genre__link"]}>
          <Link
            className={styles.link}
            to={userUUID ? `/musicplayer/${userUUID}` : "/sign-in"}>
            <i className="fas fa-arrow-up-right-from-square"></i>
          </Link>
        </div>
      </div>
      <h4>{genreName}</h4>
    </div>
  );
}
