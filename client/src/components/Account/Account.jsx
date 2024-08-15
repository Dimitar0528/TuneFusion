import { lazy, Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "./styles/Account.module.css";
import useTabs from "./hooks/useTabs";
import useTabEventListeners from "./hooks/useTabEventListeners";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import { useGetUserDetails } from "../../hooks/CRUD-hooks/useUsers";
import { useRefresh } from "../../hooks/useRefresh";
import { Navigate } from "react-router-dom";

const EditAccount = lazy(() => import("./SubComponents/EditAccount"));
const ViewAllUsers = lazy(() => import("./SubComponents/ViewAllUsers"));
const SongSuggestion = lazy(() => import("./SubComponents/SongSuggestion"));
const ViewAllSongs = lazy(() => import("./SubComponents/ViewAllSongs"));
const SpotifyIntegration = lazy(() =>
  import("./SubComponents/SpotifyIntegration")
);

export default function Account() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUserUUID } = useParams();
  const { triggerRefreshSongsHandler, triggerRefreshPlaylistsHandler, user } =
    useMusicPlayer();
  const { userUUID } = user;

  // Redirect if currentUserUUID does not match userUUID
  if (userUUID !== "" && currentUserUUID !== userUUID)
    return <Navigate to="/" replace />;

  const [refreshUserFlag, triggerRefreshUserHandler] = useRefresh();
  const [refreshUsersFlag, triggerRefreshUsersHandler] = useRefresh();
  const [currentUser] = useGetUserDetails(currentUserUUID, refreshUserFlag);

  const updateUnderlinePosition = (element) => {
    underlineRef.current.style.width = `${element.offsetWidth}px`;
    underlineRef.current.style.left = `${element.offsetLeft}px`;
  };

  const tabs = ["Song-Suggestions", "Spotify", "Songs", "Users", "Account"];
  const {
    activeTab,
    setActiveTab,
    underlineRef,
    tabsRef,
    contentsRef,
    updateUnderline,
  } = useTabs();

  const updateUrlWithTab = (tab) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("tab", tab.replace(/\s+/g, "-"));
    navigate(`/account/${currentUserUUID}?${queryParams.toString()}`, {
      replace: true,
    });
    setActiveTab(tab);
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
          <Suspense
            fallback={
              <Skeleton height={350} width="clamp(300px, 80vw, 100%)" />
            }>
            <EditAccount
              user={currentUser}
              triggerRefreshHandler={triggerRefreshUserHandler}
            />
          </Suspense>
        );
      case "Songs":
        return (
          currentUser.role === "admin" && (
            <Suspense
              fallback={
                <Skeleton height={350} width="clamp(300px, 80vw, 100%)" />
              }>
              <ViewAllSongs
                triggerRefreshSongsHandler={triggerRefreshSongsHandler}
                triggerRefreshPlaylistsHandler={triggerRefreshPlaylistsHandler}
              />
            </Suspense>
          )
        );
      case "Users":
        return (
          currentUser.role === "admin" && (
            <Suspense
              fallback={
                <Skeleton height={350} width="clamp(300px, 80vw, 100%)" />
              }>
              <ViewAllUsers
                refreshFlag={refreshUsersFlag}
                triggerRefreshHandler={triggerRefreshUsersHandler}
                userUUID={currentUserUUID}
              />
            </Suspense>
          )
        );
      case "Song-Suggestions":
        return (
          currentUser.role === "admin" && (
            <Suspense
              fallback={
                <Skeleton height={350} width="clamp(300px, 80vw, 100%)" />
              }>
              <SongSuggestion
                triggerRefreshHandler={triggerRefreshSongsHandler}
              />
            </Suspense>
          )
        );
      case "Spotify":
        return (
          currentUser.role === "admin" && (
            <Suspense
              fallback={
                <Skeleton height={350} width="clamp(300px, 80vw, 100%)" />
              }>
              <SpotifyIntegration />
            </Suspense>
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
                currentUser.role === "user" &&
                ["Songs", "Users", "Song-Suggestions"].includes(tab)
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
              onClick={() => {
                setActiveTab(tab);
                updateUrlWithTab(tab);
              }}
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
