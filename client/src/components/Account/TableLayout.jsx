import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import "./styles/table.css";

export default function TableLayout({
  data,
  columns,
  title,
  renderRow,
  onAddClick,
  hasDbSearch,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [originalData, setOriginalData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    setOriginalData(data);
  }, [data]);

  const handleSortChange = (e) => setSortOption(e.target.value);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearchResults = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  const sortedData = [...originalData].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "duration-asc":
        return a.duration - b.duration;
      case "duration-desc":
        return b.duration - a.duration;
      case "artist-name-asc":
        return a.artist.localeCompare(b.artist);
      case "artist-name-desc":
        return b.artist.localeCompare(a.artist);
      case "email-address-asc":
        return a.email_address.localeCompare(b.email_address);
      case "email-address-desc":
        return b.email_address.localeCompare(a.email_address);
      default:
        return 0;
    }
  });

  const filteredData = sortedData.filter(
    (item) =>
      item?.uuid?.toString().includes(searchQuery.toLowerCase()) ||
      item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="table-container">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
        }}>
        <h1>{title}</h1>
        {onAddClick && (
          <button className="addbtn | btn6" onClick={onAddClick}>
            Add {title.toLowerCase()}
          </button>
        )}
      </div>
      {hasDbSearch && (
        <div
          style={{
            backgroundColor: "var(--accent-clr-light)",
            display: "inline-block",
            marginBottom: "2rem",
            paddingBlockStart: "2rem",
            borderRadius: "1rem",
          }}>
          <label htmlFor="search">
            {" "}
            Search: &nbsp;
            <input
              id="search"
              type="search"
              placeholder="Search by UUID or name"
              value={searchQuery}
              onChange={handleSearchResults}
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "200px",
              }}
            />
          </label>
          <div className="select-container| sort-controls" style={{ gap: "0" }}>
            <label style={{ color: "var(--accent-clr-dark)" }}>
              Sort By: &nbsp;
              <select
                id="sort-by"
                value={sortOption}
                onChange={handleSortChange}>
                <option value="default"> --- Default sorting --- </option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                {data[0]?.email_address && (
                  <>
                    <option value="email-address-asc">
                      Email Address (A-Z)
                    </option>
                    <option value="email-address-desc">
                      Email Address (Z-A)
                    </option>
                  </>
                )}
                {data[0]?.artist && (
                  <>
                    <option value="artist-name-asc">Artist Name (A-Z)</option>
                    <option value="artist-name-desc">Artist Name (Z-A)</option>
                  </>
                )}
                {data[0]?.duration && (
                  <>
                    <option value="duration-asc">
                      Duration (Least to Most)
                    </option>
                    <option value="duration-desc">
                      Duration (Most to Least)
                    </option>
                  </>
                )}
              </select>
            </label>
            <label style={{ color: "var(--accent-clr-dark)" }}>
              Data per page: &nbsp;
              <select
                id="number-of-songs"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={30}>30 per page</option>
                <option value={40}>40 per page</option>
                <option value={50}>50 per page</option>
                <option value={69}>69 per page</option>
                <option value={999}>999 per page</option>
              </select>
            </label>
          </div>
        </div>
      )}
      <table className="rwd-table">
        <tbody>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                No matches found
              </td>
            </tr>
          ) : (
            currentItems.map(renderRow)
          )}
        </tbody>
      </table>
      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      )}
    </div>
  );
}
