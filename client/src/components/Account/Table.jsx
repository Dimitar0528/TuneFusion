// TableWithPagination.js
import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import "./styles/table.css";
export default function TableWithPagination({
  data,
  columns,
  title,
  itemsPerPage,
  renderRow,
  onAddClick,
}) {
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = data.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="table-container">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          marginBottom: '1rem'
        }}>
        <h1 >{title}</h1>
        {onAddClick && (
          <button className="addbtn | btn6" onClick={onAddClick}>Add {title.toLowerCase()}</button>
        )}
      </div>
      <table className="rwd-table">
        <tbody>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
          {currentItems.map(renderRow)}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
}
