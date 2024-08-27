import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SearchInput({ isNavbarActive, activateNavbar }) {
  let [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery === "") searchQuery = "All-Songs";
    navigate(`/search?q=${searchQuery}&page=1`);
    setSearchQuery("");
  };
  return (
    <>
      <input
        type="search"
        name="search"
        placeholder="Search..."
        className="navbar-search"
        id="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClick={activateNavbar}
        title={`${searchQuery ? "Search a specific song" : "Search all songs"}`}
      />
      <i
        id="icon-search"
        title={`${searchQuery ? "Search a specific song" : "Search all songs"}`}
        className="fas fa-magnifying-glass"
        onClick={(e) => {
          isNavbarActive ? handleSearchSubmit(e) : activateNavbar();
        }}></i>
    </>
  );
}
