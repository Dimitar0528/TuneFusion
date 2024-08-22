import React, { useState } from "react";
import "./styles/Sidebar.css";
import { useGetUserDetails } from "../../hooks/CRUD-hooks/useUsers";
import { useRefresh } from "../../hooks/useRefresh";
import { useLogoutUser } from "../../hooks/CRUD-hooks/useAuth";
import showToast from "../../utils/showToast";

export default function Sidebar({ user }) {
  const { userUUID } = user;
  const [refreshUserFlag] = useRefresh();

  const [isNavbarActive, setIsNavbarActive] = useState(false);
  const [currentUser] = useGetUserDetails(userUUID, refreshUserFlag);
  const logoutUser = useLogoutUser();

  const [activeTab, setActiveTab] = useState("Discover");

  const toggleNavbar = () => {
    setIsNavbarActive(!isNavbarActive);
  };

  const activateNavbar = () => {
    if (!isNavbarActive) {
      setIsNavbarActive(true);
    }
  };

  const handleUserLogout = async () => {
    if (!window.confirm("Are you sure you want to log out from your account?"))
      return;
    logoutUser(
      showToast(
        "You have successfully logged out of your account!",
        "success",
        1500,
        true,
        true
      )
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Discover":
        return <div className="tab-content">Discover Content</div>;
      case "New Music":
        return <div className="tab-content">New Music Content</div>;
      case "Playlists":
        return <div className="tab-content">Playlists Content</div>;
      case "Liked Songs":
        return <div className="tab-content">Liked Songs Content</div>;
      case "Settings":
        return <div className="tab-content">Settings Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className={`sidebar-container ${isNavbarActive ? "active" : ""}`}>
      <nav className={`navbar ${isNavbarActive ? "active" : ""}`}>
        <div className="navbar-container">
          <div className="navbar-logo-div">
            <button className="navbar-logo-link">
              <i className="fa-brands fa-napster"></i>
            </button>
            <button className="navbar-toggler" onClick={toggleNavbar}>
              <i className="fas fa-bars"></i>
            </button>
          </div>

          <input
            type="search"
            name="search"
            placeholder="Search..."
            className="navbar-search"
            id="search"
            onClick={activateNavbar}
          />
          <i
            id="icon-search"
            className="fas fa-magnifying-glass"
            onClick={activateNavbar}></i>

          <ul className="menu-list">
            <li
              className={`menu-item ${
                activeTab === "Discover" ? "active" : ""
              }`}
              onClick={() => setActiveTab("Discover")}>
              <a className="menu-link" href="#">
                <i className="fas fa-music"></i>
                <span className="menu-link-text">Discover</span>
              </a>
            </li>
            <li
              className={`menu-item ${
                activeTab === "New Music" ? "active" : ""
              }`}
              onClick={() => setActiveTab("New Music")}>
              <a className="menu-link" href="#">
                <i className="fas fa-circle-play"></i>
                <span className="menu-link-text">New Music</span>
              </a>
            </li>
            <li
              className={`menu-item ${
                activeTab === "Playlists" ? "active" : ""
              }`}
              onClick={() => setActiveTab("Playlists")}>
              <a className="menu-link" href="#">
                <i className="fas fa-sliders"></i>
                <span className="menu-link-text">Playlists</span>
              </a>
            </li>
            <li
              className={`menu-item ${
                activeTab === "Liked Songs" ? "active" : ""
              }`}
              onClick={() => setActiveTab("Liked Songs")}>
              <a className="menu-link" href="#">
                <i className="fas fa-heart"></i>
                <span className="menu-link-text">Liked Songs</span>
              </a>
            </li>
            <li
              className={`menu-item ${
                activeTab === "Settings" ? "active" : ""
              }`}
              onClick={() => setActiveTab("Settings")}>
              <a className="menu-link" href="#">
                <i className="fas fa-gear"></i>
                <span className="menu-link-text">Settings</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="user-container">
          <div className="user-info">
            <i className="fas fa-user-secret"></i>
            <div className="user-details">
              <h3 className="user-name">{currentUser.name}</h3>
            </div>
          </div>
          <button className="logout-btn" onClick={handleUserLogout}>
            <i className="fas fa-arrow-right-from-bracket"></i>
          </button>
        </div>
      </nav>

      <main className="dashboard">
        <h1 className="title">{activeTab}</h1>
        {renderTabContent()}
      </main>
    </div>
  );
}
