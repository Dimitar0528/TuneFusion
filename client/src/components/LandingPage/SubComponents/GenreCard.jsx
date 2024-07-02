import styles from "../../../styles/LandingPage.module.css";
import { Link } from "react-router-dom";
export default function GenreCard({ imageUrl, genreName, userUUID }) {
  return (
    <div className={styles["genre__card"]}>
      <div className={styles["genre__image"]}>
        <img src={imageUrl} alt="genre" />
        <div className={styles["genre__link"]}>
          <Link className={styles.link} to={"/musicplayer"}>
            <i className="ri-arrow-right-up-line"></i>
          </Link>
        </div>
      </div>
      <h4>{genreName}</h4>
    </div>
  );
}
