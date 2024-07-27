import styles from "./styles/Account.module.css";
import EditAccount from "./SubComponents/EditAccount";
import ViewAllUsers from "./SubComponents/ViewAllUsers";
import SongSuggestion from "./SubComponents/SongSuggestion";
import ViewAllSongs from "./SubComponents/ViewAllSongs";
import { useParams } from "react-router-dom";

import useUserDetailsFetch from "./hooks/useUserDetailsFetch";
import useTabs from "./hooks/useTabs";
import useTabEventListeners from "./hooks/useTabEventListeners";
import { useRefresh } from "../../hooks/useRefresh";
export default function Account() {
  const { userUUID } = useParams();
  const [refreshFlag, triggerRefreshHandler] = useRefresh();

  const [user] = useUserDetailsFetch(userUUID, refreshFlag);
  const tabs = ["Song Suggestions", "Songs", "Account", "PlayLists", "Users"];
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
            triggerRefreshHandler={triggerRefreshHandler}
          />
        );
      case "Songs":
        return user.role === "admin" && <ViewAllSongs />;
      case "PlayLists":
        return (
          <div>
            <h1>PlayLists Page</h1>
            <p>This is the PlayLists section.</p>
          </div>
        );
      case "Users":
        return user.role === "admin" && <ViewAllUsers />;
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
