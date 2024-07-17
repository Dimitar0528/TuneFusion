import { NavLink } from "react-router-dom";
import styles from "../LandingPage/styles/LandingPage.module.css";

export default function Footer({ userUUID }) {
  return (
    <footer className={styles["footer"]}>
      <div
        className={`${styles["section__container"]} ${styles["footer__container"]}`}>
        <ul className={styles["footer__links"]}>
          <li className={styles["footer__logo"]}>
            <NavLink to="/" className={styles["logo"]}>
              TuneFusion
            </NavLink>
          </li>
          <li>
            <NavLink
              to={userUUID ? `/musicplayer/${userUUID}` : "/sign-in"}
              className={({ isActive }) =>
                isActive ? styles["nav__link--active"] : styles["nav__link"]
              }>
              <i className="fas fa-play"></i>
              Music Player
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/information/aboutus"
              className={({ isActive }) =>
                isActive ? styles["nav__link--active"] : styles["nav__link"]
              }>
              <i className="fas fa-address-card"></i>
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/information/contactus"
              className={({ isActive }) =>
                isActive ? styles["nav__link--active"] : styles["nav__link"]
              }>
              <i className="fas fa-address-book"></i>
              Contact Us
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/information/faq"
              className={({ isActive }) =>
                isActive ? styles["nav__link--active"] : styles["nav__link"]
              }>
              <i className="fas fa-circle-question"></i>
              FAQ
            </NavLink>
          </li>
        </ul>
      </div>
      <div className={styles["footer__bar"]}>
        Copyright TuneFusion © 2024. All rights reserved.
      </div>
    </footer>
  );
}
