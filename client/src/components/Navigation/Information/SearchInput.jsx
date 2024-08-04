import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "../../LandingPage/styles/LandingPage.module.css";

export default function SearchInput() {
  let [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery === "") searchQuery = "All-Songs";
    navigate(`/search?q=${searchQuery}`);
    setSearchQuery("");
  };
  return (
    <form onSubmit={handleSearchSubmit}>
      <input
        type="text"
        placeholder="Search songs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles["search__input"]}
        title={`${searchQuery ? "Search a specific song" : "Search all songs"}`}
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
  );
}
