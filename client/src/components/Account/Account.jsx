import React, { useState, useRef, useEffect } from "react";
import styles from "./styles/Account.module.css";
import ViewSongs from "./SubComponents/ViewSongs";
import EditAccount from "./SubComponents/EditAccount";
import ViewUsers from "./SubComponents/ViewUsers";
import SongSuggestion from "./SubComponents/SongSuggestion";

export default function Account({ songs, userUUID }) {
  const [activeTab, setActiveTab] = useState("Account");
  const underlineRef = useRef(null);
  const tabsRef = useRef([]);
  const contentsRef = useRef([]);
  const [user, setUser] = useState({});

  const tabs = ["Song Suggestions", "Songs", "Account", "PlayLists", "Users"]; // Add new tab

  useEffect(() => {
    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [activeTab]);

  useEffect(() => {
    async function getUser() {
      const response = await fetch(
        `http://localhost:3000/api/users/${userUUID}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      setUser(data);
    }
    getUser();
  }, [userUUID]);

  useEffect(() => {
    const handleHover = (e) => {
      const hoveredTab = e.currentTarget;
      updateUnderlinePosition(hoveredTab);
    };

    const handleLeave = () => {
      updateUnderline();
    };

    tabsRef.current.forEach((tab) => {
      if (tab) {
        tab.addEventListener("mouseenter", handleHover);
        tab.addEventListener("mouseleave", handleLeave);
        tab.addEventListener("keydown", (e) => {
          if (e.code === "Enter") setActiveTab(e.currentTarget.dataset.target);
        });
      }
    });

    return () => {
      tabsRef.current.forEach((tab) => {
        if (tab) {
          tab.removeEventListener("mouseenter", handleHover);
          tab.removeEventListener("mouseleave", handleLeave);
          tab.removeEventListener("keydown", (e) => {
            if (e.code === "Enter")
              setActiveTab(e.currentTarget.dataset.target);
          });
        }
      });
    };
  }, [activeTab]);

  const updateUnderline = () => {
    const activeTabElement = tabsRef.current.find(
      (tab) => tab && tab.dataset.target === activeTab
    );
    if (activeTabElement && underlineRef.current) {
      updateUnderlinePosition(activeTabElement);
    }
  };

  const updateUnderlinePosition = (element) => {
    underlineRef.current.style.width = `${element.offsetWidth}px`;
    underlineRef.current.style.left = `${element.offsetLeft}px`;
  };

  const renderTabContent = (tab) => {
    switch (tab) {
      case "Account":
        return <EditAccount user={user} />;
      case "Songs":
        return user.role === "admin" && <ViewSongs songs={songs} />;
      case "PlayLists":
        return (
          <div>
            <h1>PlayLists Page</h1>
            <p>This is the PlayLists section.</p>
          </div>
        );
      case "Users":
        return user.role === "admin" && <ViewUsers />;
      case "Song Suggestions":
        return user.role === "admin" && <SongSuggestion />;
      default:
        return (
          <div>
            <h1>Page</h1>
            <p>This is an section.</p>
          </div>
        );
    }
  };

  return (
    <div className={styles.accountBody}>
      <div className={styles.navtabs}>
        {tabs
          .filter(
            (tab) =>
              !(
                user.role === "user" &&
                ["Songs", "Users", "Song Suggestions"].includes(tab)
              )
          )
          .map((tab, index) => (
            <div
              key={tab}
              tabIndex={0}
              className={`${styles.navtab} ${
                activeTab === tab ? styles.active : ""
              }`}
              data-target={tab}
              onClick={() => setActiveTab(tab)}
              ref={(el) => (tabsRef.current[index] = el)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
          ))}

        <div className={styles.underline} ref={underlineRef}></div>
      </div>
      <div className={styles.contentWrapper}>
        {tabs.map((tab) => (
          <div
            key={tab}
            id={tab}
            className={`${styles.content} ${
              activeTab === tab ? styles.active : ""
            }`}
            ref={(el) => (contentsRef.current[tab] = el)}>
            {renderTabContent(tab)}
          </div>
        ))}
      </div>
    </div>
  );
}
