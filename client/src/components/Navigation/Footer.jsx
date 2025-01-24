import { NavLink } from "react-router";
import styles from "../LandingPage/styles/LandingPage.module.css";
import { useNavigate } from "react-router";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";

export default function Footer({ userUUID }) {
  const { activePlaylist, currentPage } = useMusicPlayer();

  const navigate = useNavigate();

  // Add view transition handler
  const handleNavigation = (to) => {
    if (!document.startViewTransition) {
      navigate(to);
      return;
    }

    document.startViewTransition(() => {
      navigate(to);
    });
  };
  const TransitionNavLink = ({ to, children, className }) => (
    <NavLink
      to={to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        handleNavigation(to);
      }}
      >
      {children}
    </NavLink>
  );

  return (
    <footer className={styles["footer"]}>
      <div
        className={`${styles["section__container"]} ${styles["footer__container"]}`}>
        <ul className={styles["footer__links"]}>
          <li className={styles["footer__logo"]}>
            <TransitionNavLink to="/" className={styles["logo"]}>
              TuneFusion
            </TransitionNavLink>
          </li>
          <li>
            <TransitionNavLink
              to={
                activePlaylist
                  ? `/musicplayer/${userUUID}?playlist=${activePlaylist?.name.replace(
                      /\s+/g,
                      ""
                    )}&page=${currentPage + 1}`
                  : `/musicplayer/${userUUID}?page=${currentPage + 1}`
              }
              className={({ isActive }) =>
                isActive ? styles["nav__link--active"] : styles["nav__link"]
              }
             >
              <i className="fas fa-play"></i>
              My Music
            </TransitionNavLink>
          </li>
          <li>
            <TransitionNavLink
              to="/information/aboutus"
              className={({ isActive }) =>
                isActive ? styles["nav__link--active"] : styles["nav__link"]
              }>
              <i className="fas fa-address-card"></i>
              About Us
            </TransitionNavLink>
          </li>
          <li>
            <TransitionNavLink
              to="/information/contactus"
              className={({ isActive }) =>
                isActive ? styles["nav__link--active"] : styles["nav__link"]
              }>
              <i className="fas fa-address-book"></i>
              Contact Us
            </TransitionNavLink>
          </li>
          <li>
            <TransitionNavLink
              to="/information/faq"
              className={({ isActive }) =>
                isActive ? styles["nav__link--active"] : styles["nav__link"]
              }>
              <i className="fas fa-circle-question"></i>
              FAQ
            </TransitionNavLink>
          </li>
        </ul>
      </div>
      <div className={styles["footer__bar"]}>
        Copyright TuneFusion © 2024. All rights reserved.
      </div>
    </footer>
  );
}
