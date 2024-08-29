import React, { useState } from "react";
import "./styles/Sidebar.css";
import { useGetUserDetails } from "../../hooks/CRUD-hooks/useUsers";
import { useRefresh } from "../../hooks/useRefresh";
import { useLogoutUser } from "../../hooks/CRUD-hooks/useAuth";
import showToast from "../../utils/showToast";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import extractUUIDPrefix from "../../utils/extractUUIDPrefix";
import SearchInput from "./SubComponents/SearchInput";
import Discover from "./Tabs/Discover";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import MyLibrary from "./Tabs/MyLibrary";
export default function Sidebar() {
  const { currentUserUUID } = useParams();
  const { user } = useMusicPlayer();
  const { userUUID } = user;
  if (userUUID !== "") {
    if (currentUserUUID !== userUUID) return <Navigate to="/" replace />;
  }
  const [refreshUserFlag] = useRefresh();
  const navigate = useNavigate();
  const [isNavbarActive, setIsNavbarActive] = useState(false);
  const [currentUser] = useGetUserDetails(userUUID, refreshUserFlag);
  const logoutUser = useLogoutUser();

  const [activeTab, setActiveTab] = useState("My Library");

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
      case "My Library":
        return (
          <div className="tab-content body">
            <MyLibrary />
          </div>
        );
      case "Discover":
        return (
          <div className="tab-content">
            <Discover userUUID={userUUID} />
          </div>
        );
      case "Settings":
        return <div className="tab-content"></div>;
      default:
        return null;
    }
  };

  return (
    <div className={`sidebar-container ${isNavbarActive ? "active" : ""}`}>
      <nav className={`navbar ${isNavbarActive ? "active" : ""}`}>
        <div className="navbar-container">
          <div className="navbar-logo-div">
            <button className="navbar-logo-link" onClick={() => navigate("/")}>
              TuneFusion
            </button>
            <button className="navbar-toggler" onClick={toggleNavbar}>
              <i
                className={isNavbarActive ? "fas fa-close" : "fas fa-bars"}></i>
            </button>
          </div>

          <SearchInput
            isNavbarActive={isNavbarActive}
            activateNavbar={activateNavbar}
          />

          <ul className="menu-list">
            <li
              title="My Library"
              className={`menu-item ${
                activeTab === "My Library" ? "active" : ""
              }`}
              onClick={() => setActiveTab("My Library")}>
              <div className="menu-link">
                <i className="fas fa-book-open"></i>
                <span className="menu-link-text">My Library</span>
              </div>
            </li>
            <li
              title="Discover"
              className={`menu-item ${
                activeTab === "Discover" ? "active" : ""
              }`}
              onClick={() => setActiveTab("Discover")}>
              <div className="menu-link">
                <i className="fas fa-circle-play"></i>
                <span className="menu-link-text">Discover</span>
              </div>
            </li>
            <li
              title="Settings"
              className={`menu-item ${
                activeTab === "Settings" ? "active" : ""
              }`}
              onClick={() => setActiveTab("Settings")}>
              <div className="menu-link">
                <i className="fas fa-gear"></i>
                <span className="menu-link-text">Settings</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="user-container">
          <div className="user-info">
            <i className="fas fa-user-secret"></i>
            <div className="user-details">
              <Link
                to={`/account/${extractUUIDPrefix(
                  currentUser.uuid
                )}?tab=Account`}
                className="user-name | song-artist">
                {currentUser.name}
              </Link>
            </div>
          </div>
          <button
            title="Log Out"
            className="logout-btn"
            onClick={handleUserLogout}>
            <i className="fas fa-arrow-right-from-bracket"></i>
          </button>
        </div>
      </nav>

      <main className="dashboard">{renderTabContent()}</main>
    </div>
  );
}
