// ViewUsers.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../Table";

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const usersPerPage = 8;

  useEffect(() => {
    async function getUsers() {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "GET",
        credentials: "include",
      });
      const users = await response.json();
      setUsers(users);
    }
    getUsers();
  }, []);

  return (
    <Table
      data={users}
      columns={["UUID", "name", "Email Address", "Phone Number", "Actions"]}
      title="Users"
      hasDbSearch={true}
      itemsPerPage={usersPerPage}
      renderRow={(user) => (
        <tr key={user.uuid}>
          <td data-th="UUID">{user.uuid}</td>
          <td data-th="name">{user.name}</td>
          <td data-th="Email Address">{user.email_address}</td>
          <td data-th="Phone Number">{user.phone_number}</td>
          <td data-th="Actions">
            <div className="cta-admin-buttons">
              <button>Delete</button>
            </div>
          </td>
        </tr>
      )}
    />
  );
}
