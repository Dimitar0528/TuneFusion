import { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../LandingPage/styles/LandingPage.module.css";
import SearchInput from "./Information/SearchInput";
export default function Header({ btnText, goToLocation, userUUID }) {
  const menuBtnRef = useRef();
  const navLinksRef = useRef();
  const menuBtnIconRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const menuBtn = menuBtnRef.current;
    const navLinks = navLinksRef.current;
    const menuBtnIcon = menuBtnIconRef.current;

    const handleMenuClick = () => {
      navLinks.classList.toggle(styles["open"]);

      const isOpen = navLinks.classList.contains(styles["open"]);
      menuBtnIcon.setAttribute(
        "class",
        isOpen ? "fas fa-close" : "fas fa-bars"
      );
    };

    const handleNavLinksClick = (e) => {
      if (e.target.tagName === "INPUT") return;
      navLinks.classList.remove(styles["open"]);
      menuBtnIcon.setAttribute("class", "fas fa-bars");
    };

    menuBtn.addEventListener("click", handleMenuClick);
    navLinks.addEventListener("click", handleNavLinksClick);
    return () => {
      menuBtn.removeEventListener("click", handleMenuClick);
      navLinks.removeEventListener("click", handleNavLinksClick);
    };
  }, []);

  return (
    <nav className={styles["nav"]}>
      <div className={styles["nav__header"]}>
        <div className={styles["nav__logo"]}>
          <NavLink to="/" className={styles["logo"]}>
            TuneFusion
          </NavLink>
        </div>
        <div
          className={styles["nav__menu__btn"]}
          id="menu-btn"
          ref={menuBtnRef}>
          <span>
            <i
              className={`fas fa-bars ${styles["menu__icon"]}`}
              ref={menuBtnIconRef}></i>
          </span>
        </div>
      </div>
      <ul className={styles["nav__links"]} id="nav-links" ref={navLinksRef}>
        <NavLink
          to={`/musicplayer/${userUUID}`}
          className={({ isActive }) =>
            isActive ? styles["nav__link--active"] : styles["nav__link"]
          }>
          <i className="fas fa-play"></i>
          My Music
        </NavLink>
        <NavLink
          to="/information/aboutus"
          className={({ isActive }) =>
            isActive ? styles["nav__link--active"] : styles["nav__link"]
          }>
          <i className="fas fa-address-card"></i>
          About Us
        </NavLink>
        <SearchInput />
        <NavLink
          to="/information/contactus"
          className={({ isActive }) =>
            isActive ? styles["nav__link--active"] : styles["nav__link"]
          }>
          <i className="fas fa-address-book"></i>
          Contact Us
        </NavLink>
        <NavLink
          to="/information/faq"
          className={({ isActive }) =>
            isActive ? styles["nav__link--active"] : styles["nav__link"]
          }>
          <i className="fas fa-circle-question"></i>
          FAQ
        </NavLink>
        <div className={styles["nav__link"]}>
          <button
            className={styles["btn"]}
            onClick={() => {
              navigate(goToLocation);
            }}>
            {btnText === "My Account" ? (
              <i className="fas fa-user"></i>
            ) : (
              <i className="fas fa-user-plus"></i>
            )}
            {btnText}
          </button>
        </div>
      </ul>
    </nav>
  );
}
