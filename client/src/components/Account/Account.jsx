import { lazy, Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useParams } from "react-router-dom";
import styles from "./styles/Account.module.css";
import useTabs from "./hooks/useTabs";
import useTabEventListeners from "./hooks/useTabEventListeners";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import { useGetUserDetails } from "../../hooks/CRUD-hooks/useUsers";
import { useRefresh } from "../../hooks/useRefresh";

const EditAccount = lazy(() => import("./SubComponents/EditAccount"));
const ViewAllUsers = lazy(() => import("./SubComponents/ViewAllUsers"));
const SongSuggestion = lazy(() => import("./SubComponents/SongSuggestion"));
const ViewAllSongs = lazy(() => import("./SubComponents/ViewAllSongs"));

export default function Account() {
  const { userUUID } = useParams();
  const { triggerRefreshSongsHandler } = useMusicPlayer();
  const [refreshUserFlag, triggerRefreshUserHandler] = useRefresh();
  const [refreshUsersFlag, triggerRefreshUsersHandler] = useRefresh();
  const [user] = useGetUserDetails(userUUID, refreshUserFlag);
  const tabs = ["Song Suggestions", "Songs", "Users", "Account"];
  const {
    activeTab,
    setActiveTab,
    underlineRef,
    tabsRef,
    contentsRef,
    updateUnderline,
  } = useTabs();

  const updateUnderlinePosition = (element) => {
    underlineRef.current.style.width = `${element.offsetWidth}px`;
    underlineRef.current.style.left = `${element.offsetLeft}px`;
  };

  useTabEventListeners(
    tabsRef,
    activeTab,
    setActiveTab,
    updateUnderline,
    updateUnderlinePosition
  );

  const renderTabContent = (tab) => {
    switch (tab) {
      case "Account":
        return (
          <EditAccount
            user={user}
            triggerRefreshHandler={triggerRefreshUserHandler}
          />
        );
      case "Songs":
        return (
          user.role === "admin" && (
            <ViewAllSongs triggerRefreshHandler={triggerRefreshSongsHandler} />
          )
        );
      case "Users":
        return (
          user.role === "admin" && (
            <ViewAllUsers
              refreshFlag={refreshUsersFlag}
              triggerRefreshHandler={triggerRefreshUsersHandler}
            />
          )
        );
      case "Song Suggestions":
        return (
          user.role === "admin" && (
            <SongSuggestion
              triggerRefreshHandler={triggerRefreshSongsHandler}
            />
          )
        );
      default:
        return (
          <div>
            <h1>Page</h1>
            <p>This is a section.</p>
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
            <Suspense
              fallback={
                <Skeleton height={350} width="clamp(300px, 80vw, 100%)" />
              }>
              {renderTabContent(tab)}
            </Suspense>
          </div>
        ))}
      </div>
    </div>
  );
}
