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
              className={styles["nav__link"]}>
              Music Player
            </NavLink>
          </li>
          <li>
            <NavLink to="/information/aboutus">About Us</NavLink>
          </li>
          <li>
            <NavLink to="/information/contactus">Contact Us</NavLink>
          </li>
          <li>
            <NavLink to="/information/faq">FAQ</NavLink>
          </li>
        </ul>
      </div>
      <div className={styles["footer__bar"]}>
        Copyright TuneFusion © 2024. All rights reserved.
      </div>
    </footer>
  );
}
