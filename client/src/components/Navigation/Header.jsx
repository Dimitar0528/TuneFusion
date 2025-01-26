import { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router";
import styles from "../LandingPage/styles/LandingPage.module.css";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";

export default function Header({ btnText, goToLocation, userUUID }) {
  const { activePlaylist, currentPage } = useMusicPlayer();
  const menuBtnRef = useRef();
  const navLinksRef = useRef();
  const menuBtnIconRef = useRef();
  const navigate = useNavigate();

  
  const navigationOrder = [
    "/",
    `/musicplayer/${userUUID}`,
    "/information/aboutus",
    "/information/contactus",
    "/information/faq",
    '/sign-in',
    `/account/${userUUID}`,
  ];

  function determineNavigationDirection(fromPath, toPath) {
    const normalizedFromPath = fromPath.split("?")[0];
    const normalizedToPath = toPath.split("?")[0];
    if (normalizedFromPath === normalizedToPath) return;
    const fromIndex = navigationOrder.findIndex(
      (route) => route === normalizedFromPath
    );
    const toIndex = navigationOrder.findIndex(
      (route) => route === normalizedToPath
    );
    return fromIndex < toIndex ? "forwards" : "backwards";
  }
  // Add view transition handler
  const handleNavigation = (to) => {
    const direction = determineNavigationDirection(location.pathname, to);
    if (!document.startViewTransition) {
      navigate(to);
      return;
    }

    document.startViewTransition({
      update: () => {
       navigate(to);
      },
      types: ["slide", direction],
    });
  };

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

  const TransitionNavLink = ({ to, children, className }) => (
    <NavLink
      to={to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        handleNavigation(to);
      }}>
      {children}
    </NavLink>
  );

  return (
    <nav className={styles["nav"]}>
      <div className={styles["nav__header"]}>
        <div className={styles["nav__logo"]}>
          <TransitionNavLink to="/" className={styles["logo"]}>
            TuneFusion
          </TransitionNavLink>
        </div>
        <div
          className={styles["nav__menu__btn"]}
          id="menu-btn"
          ref={menuBtnRef}>
          <span>
            <i className="fas fa-bars" ref={menuBtnIconRef}></i>
          </span>
        </div>
      </div>
      <ul className={styles["nav__links"]} id="nav-links" ref={navLinksRef}>
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
          }>
          <i className="fas fa-play"></i>
          My Music
        </TransitionNavLink>

        <TransitionNavLink
          to="/information/aboutus"
          className={({ isActive }) =>
            isActive ? styles["nav__link--active"] : styles["nav__link"]
          }>
          <i className="fas fa-address-card"></i>
          About Us
        </TransitionNavLink>
        <TransitionNavLink
          to="/information/contactus"
          className={({ isActive }) =>
            isActive ? styles["nav__link--active"] : styles["nav__link"]
          }>
          <i className="fas fa-address-book"></i>
          Contact Us
        </TransitionNavLink>
        <TransitionNavLink
          to="/information/faq"
          className={({ isActive }) =>
            isActive ? styles["nav__link--active"] : styles["nav__link"]
          }>
          <i className="fas fa-circle-question"></i>
          FAQ
        </TransitionNavLink>
        <div className={styles["nav__link"]}>
          <button
            className={styles["btn"]}
            onClick={() => handleNavigation(goToLocation)}>
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
