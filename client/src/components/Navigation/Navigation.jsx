import React, { useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "../../styles/LandingPage.module.css";

export default function Navigation({ btnText, goToLocation, userUUID }) {
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
        isOpen ? "ri-close-line" : "ri-menu-line"
      );
    };

    const handleNavLinksClick = () => {
      navLinks.classList.remove(styles["open"]);
      menuBtnIcon.setAttribute("class", "ri-menu-line");
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
              className={`ri-menu-line ${styles["menu__icon"]}`}
              ref={menuBtnIconRef}></i>
          </span>
        </div>
      </div>
      <ul className={styles["nav__links"]} id="nav-links" ref={navLinksRef}>
        <Link
          to={userUUID ? `/musicplayer/${userUUID}` : "/sign-in"}
          className={styles["nav__link"]}>
          Music Player
        </Link>
        <Link to="/information/aboutus" className={styles["nav__link"]}>
          About Us
        </Link>
        <Link to="/information/contactus" className={styles["nav__link"]}>
          Contact Us
        </Link>
        <Link to="/information/faq" className={styles["nav__link"]}>
          FAQ
        </Link>
        <div className={styles["nav__link"]}>
          <button
            className={styles["btn"]}
            onClick={() => {
              navigate(goToLocation);
            }}>
            {btnText}
          </button>
        </div>
      </ul>
    </nav>
  );
}
