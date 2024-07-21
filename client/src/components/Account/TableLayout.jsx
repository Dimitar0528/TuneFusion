import { useState } from "react";
import ReactPaginate from "react-paginate";
import "./styles/table.css";

export default function TableLayout({
  data,
  columns,
  title,
  itemsPerPage,
  renderRow,
  onAddClick,
  hasDbSearch,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearchResults = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  const filteredData = data.filter(
    (item) =>
      item?.uuid?.toString()?.includes(searchQuery) ||
      item?.name?.toLowerCase()?.includes(searchQuery.toLowerCase())
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
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}>
          <input
            type="text"
            placeholder="Search by UUID or name"
            value={searchQuery}
            onChange={handleSearchResults}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "300px",
            }}
          />
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
