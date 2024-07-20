import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../landingPage/styles/LandingPage.module.css";
export default function Header({ btnText, goToLocation, userUUID }) {
  const menuBtnRef = useRef();
  const navLinksRef = useRef();
  const menuBtnIconRef = useRef();
  const navigate = useNavigate();
  let [searchQuery, setSearchQuery] = useState("");

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery === "") searchQuery = "All-Songs";
    navigate(`/search?q=${searchQuery}`);
    setSearchQuery("");
  };

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
        <NavLink
          to={userUUID ? `/musicplayer/${userUUID}` : "/sign-in"}
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
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles["search__input"]}
            title={`${
              searchQuery ? "Search a specific song" : "Search all songs"
            }`}
          />
          <button
            type="submit"
            className={styles["search__button"]}
            title={`${
              searchQuery ? "Search a specific song" : "Search all songs"
            }`}>
            <i className="ri-search-line"></i>
          </button>
        </form>
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
